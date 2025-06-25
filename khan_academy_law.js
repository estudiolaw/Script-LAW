// Script oficial do Estúdio LAW – Automatizador Khan Academy
// Desenvolvido com aprimoramento visual, automação e proteção

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

let loadedPlugins = [];

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

const splashScreen = document.createElement('splashScreen');

class EventEmitter {
  constructor() { this.events = {} }
  on(t, e) { (Array.isArray(t) ? t : [t]).forEach(evt => { (this.events[evt] = this.events[evt] || []).push(e) }) }
  off(t, e) { (Array.isArray(t) ? t : [t]).forEach(evt => { this.events[evt] && (this.events[evt] = this.events[evt].filter(h => h !== e)) }) }
  emit(t, ...e) { this.events[t]?.forEach(h => h(...e)) }
  once(t, e) {
    const s = (...i) => { e(...i); this.off(t, s) };
    this.on(t, s);
  }
}

const plppdo = new EventEmitter();

new MutationObserver(mutationsList =>
  mutationsList.some(m => m.type === 'childList') && plppdo.emit('domChanged')
).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const findAndClickBySelector = selector => document.querySelector(selector)?.click();

function sendToast(text, duration = 5000) {
  Toastify({
    text,
    duration,
    gravity: 'bottom',
    position: "center",
    stopOnFocus: true,
    style: { background: "#0d47a1" } // Azul dark LAW
  }).showToast();
}

// Splash animada azul dark com animação fade+slide na letra
async function showSplashScreen() {
  splashScreen.style.cssText = `
    position:fixed;
    top:0;left:0;width:100%;height:100%;
    z-index:9999;
    display:flex;
    align-items:center;
    justify-content:center;
    background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
    background-size: 400% 400%;
    animation: backgroundFlow 10s ease infinite;
    user-select:none;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  splashScreen.innerHTML = `
    <div id="estudio-law-text" style="
      font-size: 3em;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
      animation: glowText 2s ease-in-out infinite alternate,
                 fadeSlideIn 1.5s ease forwards;
      opacity: 0;
      transform: translateY(30px);
    ">
      Estúdio <span style="color:#00aaff;">LAW</span>
    </div>
  `;

  const style = document.createElement('style');
  style.id = 'estudio-law-style';
  style.innerHTML = `
    @keyframes backgroundFlow {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }

    @keyframes glowText {
      from { text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc; }
      to { text-shadow: 0 0 20px #00ccff, 0 0 30px #00aaff; }
    }

    @keyframes fadeSlideIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (!document.getElementById('estudio-law-style')) {
    document.head.appendChild(style);
  }
  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
  splashScreen.style.transition = 'opacity 0.8s ease';
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

async function loadScript(url, label) {
  const response = await fetch(url);
  const script = await response.text();
  loadedPlugins.push(label);
  eval(script);
}

async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

function setupMain() {
  const originalFetch = window.fetch;

  window.fetch = async function(input, init) {
    let body;
    if (input instanceof Request) {
      body = await input.clone().text();
    } else if (init?.body) {
      body = init.body;
    }

    if (body?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        let bodyObj = JSON.parse(body);
        if (bodyObj.variables?.input) {
          const durationSeconds = bodyObj.variables.input.durationSeconds;
          bodyObj.variables.input.secondsWatched = durationSeconds;
          bodyObj.variables.input.lastSecondWatched = durationSeconds;
          body = JSON.stringify(bodyObj);

          if (input instanceof Request) {
            input = new Request(input, { body });
          } else {
            init.body = body;
          }

          sendToast("🎥┃Progresso de vídeo completo!");
        }
      } catch (e) {}
    }

    const originalResponse = await originalFetch.apply(this, arguments);

    try {
      const clonedResponse = originalResponse.clone();
      const responseBody = await clonedResponse.text();
      let responseObj = JSON.parse(responseBody);

      if (responseObj?.data?.assessmentItem?.item?.itemData) {
        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);

        if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
          itemData.answerArea = {
            calculator: false,
            chi2Table: false,
            periodicTable: false,
            tTable: false,
            zTable: false
          };

          itemData.question.content = " [[☃ radio 1]]";
          itemData.question.widgets = {
            "radio 1": {
              type: "radio",
              options: {
                choices: [{ content: "✅", correct: true }]
              }
            }
          };

          responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);

          return new Response(JSON.stringify(responseObj), {
            status: originalResponse.status,
            statusText: originalResponse.statusText,
            headers: originalResponse.headers
          });
        }
      }
    } catch (e) {}

    return originalResponse;
  };

  (async () => {
    const selectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];

    window.estudioLAWauto = true;

    while (window.estudioLAWauto) {
      for (const selector of selectors) {
        findAndClickBySelector(selector);

        const element = document.querySelector(`${selector}> div`);
        if (element?.innerText === "Mostrar resumo") {
          sendToast("🎉┃Exercício finalizado!");
        }
      }
      await delay(800);
    }
  })();
}

// Redireciona para versão PT da Khan se estiver fora do domínio
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async function init() {
    await showSplashScreen();

    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js', 'darkReaderPlugin').then(() => {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable();
      }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    ]);

    await delay(2000);
    await hideSplashScreen();

    setupMain();
    sendToast("🚀┃Estúdio LAW iniciado com sucesso!");
    console.clear();
  })();
}


