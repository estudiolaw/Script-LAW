// ==UserScript==
// @name         Khanware + Estúdio LAW TASKS + Painel Seguro
// @namespace    http://estudiolaw.com/
// @version      5.1.0
// @description  Automatiza tarefas no Khan Academy com painel de senha moderno e seguro
// @author       Wesley1w2e, Estúdio LAW, adaptado Copilot Chat Assistant
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

// ====== CONFIGURAÇÃO DE SENHAS ======
const CONFIG = {
  PASSWORDS: [
    "law2025@premium",
    "estudiolaw!2025",
    "wesley@developer",
    "khanware.pro",
    "lawaccess2025",
    "premiumlaw@2025",
    "studiolaw.dev",
    "unlockkhan@law",
    "projectlaw2025",
    "masterkey@law"
  ],
  MAX_ATTEMPTS: 3,
  LOCK_TIME: 5*60*1000
};

// ====== PAINEL DE SENHA MODERNO COM OLHINHO ======
function showPasswordPanel() {
  return new Promise((resolve, reject) => {
    let attempts = Number(sessionStorage.getItem('law_attempts')||0);
    let lock = Number(sessionStorage.getItem('law_lock_until')||0);
    if (Date.now() < lock) {
      alert(`Muitas tentativas incorretas! Aguarde ${Math.ceil((lock-Date.now())/60000)} min`);
      reject("lock");
      return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;
      background:rgba(20,29,39,0.98);display:flex;align-items:center;justify-content:center;
      font-family:'Segoe UI',sans-serif;
    `;
    overlay.innerHTML = `
      <div style="background:#202c3c;border-radius:18px;padding:38px 30px;min-width:320px;max-width:95vw;box-shadow:0 12px 32px #0008;">
        <div style="font-size:2.1em;font-weight:700;color:#0ea5e9;text-align:center;margin-bottom:16px;">Estúdio LAW</div>
        <div style="color:#b9e3ff;margin-bottom:20px;text-align:center;">Painel de Autenticação</div>
        <div style="margin-bottom:18px;position:relative;">
          <input id="law-password-input" type="password" maxlength="64" autocomplete="current-password"
            style="width:100%;padding:14px 44px 14px 44px;border-radius:10px;border:2px solid #334155;background:#222e41;color:#fff;font-size:1em;" placeholder="Digite a senha..." autofocus>
          <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#0ea5e9;font-size:1.2em;">🔒</span>
          <button id="toggle-password-visibility" type="button" tabindex="-1"
            style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1.2em;color:#7dd3fc;">👁️</button>
        </div>
        <button id="law-password-submit" style="width:100%;padding:13px;border-radius:10px;background:linear-gradient(90deg,#0ea5e9,#2563eb);color:#fff;font-weight:600;font-size:1.1em;border:none;cursor:pointer;">Entrar</button>
        <div id="law-password-status" style="height:22px;margin:12px 0 0 0;text-align:center;font-size:0.98em;"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    let input = overlay.querySelector('#law-password-input');
    let toggleBtn = overlay.querySelector('#toggle-password-visibility');
    let status = overlay.querySelector('#law-password-status');
    let isVisible = false;
    toggleBtn.onclick = function() {
      isVisible = !isVisible;
      input.type = isVisible ? 'text' : 'password';
      toggleBtn.textContent = isVisible ? '🙈' : '👁️';
    };

    function showStatus(msg, color) {
      status.textContent = msg;
      status.style.color = color||"#e0e6ed";
    }

    async function validatePassword(password) {
      showStatus('Verificando...', '#06b6d4');
      await new Promise(r => setTimeout(r, 400));
      if (CONFIG.PASSWORDS.includes(password)) {
        sessionStorage.removeItem('law_attempts');
        showStatus('Acesso liberado!', '#10b981');
        setTimeout(()=>{ overlay.remove(); resolve(); }, 500);
      } else {
        attempts++;
        sessionStorage.setItem('law_attempts', attempts);
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
          sessionStorage.setItem('law_lock_until', Date.now()+CONFIG.LOCK_TIME);
          showStatus(`Acesso bloqueado por 5 min!`, '#ef4444');
          setTimeout(()=>{ overlay.remove(); reject("lock"); }, 1500);
        } else {
          showStatus(`Senha incorreta! (${CONFIG.MAX_ATTEMPTS-attempts} restantes)`, '#ef4444');
          input.value = '';
          input.focus();
        }
      }
    }
    overlay.querySelector('#law-password-submit').onclick = () => {
      const password = input.value;
      if (!password) {
        showStatus('Digite a senha!', '#f59e0b');
        return;
      }
      validatePassword(password);
    };
    input.onkeydown = e => { if (e.key === 'Enter') overlay.querySelector('#law-password-submit').click(); };
  });
}

// ======= SCRIPTS DE TAREFA (SEU CÓDIGO ORIGINAL) =======

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

let loadedPlugins = [];

console.clear();

const noop = () => {};
console.warn = console.error = window.debug = noop;

const splashScreen = document.createElement('div');

class EventEmitter {
  constructor() { this.events = {}; }
  on(t, e) { (Array.isArray(t) ? t : [t]).forEach(t => { (this.events[t] = this.events[t] || []).push(e); }); }
  off(t, e) { (Array.isArray(t) ? t : [t]).forEach(t => { if(this.events[t]) this.events[t] = this.events[t].filter(h => h !== e); }); }
  emit(t, ...e) { this.events[t]?.forEach(h => h(...e)); }
  once(t, e) { const s = (...i) => { e(...i); this.off(t, s); }; this.on(t, s); }
}
const plppdo = new EventEmitter();
new MutationObserver(mutationsList => {
  if (mutationsList.some(m => m.type === 'childList')) {
    plppdo.emit('domChanged');
  }
}).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const findAndClickBySelector = selector => document.querySelector(selector)?.click();

function sendToast(text, duration = 5000, gravity = 'bottom') {
  if (window.Toastify) {
    Toastify({
      text,
      duration,
      gravity,
      position: "center",
      stopOnFocus: true,
      style: { background: "#000000" }
    }).showToast();
  } else {
    alert(text);
  }
}

// === Animação CSS para fundo fogo azul ===
const styleFire = document.createElement('style');
styleFire.textContent = `
@keyframes fireAnimation {
0% { background-position: 0% 50%; filter: hue-rotate(0deg);}
50% { background-position: 100% 50%; filter: hue-rotate(20deg);}
100% { background-position: 0% 50%; filter: hue-rotate(0deg);}
}
.splash-fire {
background: linear-gradient(270deg, #001122, #0044cc, #003366, #000022);
background-size: 600% 600%;
animation: fireAnimation 3s infinite alternate;
}
`;
document.head.appendChild(styleFire);

async function showSplashScreen() {
  splashScreen.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; justify-content: center; align-items: center;
    user-select: none; z-index: 9999; color: #3399ff; font-family: MuseoSans, sans-serif;
    font-size: 48px; letter-spacing: 0.15em;
    text-shadow: 0 0 8px #3399ff, 0 0 15px #3399ff, 0 0 30px #66ccff; opacity: 1;
    transition: opacity 1s ease;
  `;
  splashScreen.classList.add('splash-fire');
  splashScreen.textContent = '';
  document.body.appendChild(splashScreen);
  const text = 'Estúdio LAW';
  let index = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      splashScreen.textContent = text.slice(0, index + 1);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          splashScreen.style.opacity = '0';
          setTimeout(() => {
            splashScreen.remove();
            resolve();
          }, 1000);
        }, 2000);
      }
    }, 150);
  });
}
async function hideSplashScreen() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}
async function loadScript(url, label) {
  const response = await fetch(url);
  const scriptText = await response.text();
  loadedPlugins.push(label);
  eval(scriptText);
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
          if (input instanceof Request) input = new Request(input, { body });
          else init.body = body;
          sendToast("🔓┃Vídeo explorado.", 1000);
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
        if (itemData.question && itemData.question.widgets && Object.keys(itemData.question.widgets).length) {
          Object.values(itemData.question.widgets).forEach(widget => {
            if (widget.type === "radio" && widget.options && widget.options.choices)
              widget.options.choices.forEach(choice => choice.correct = true);
          });
        }
        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
        return new Response(JSON.stringify(responseObj), {
          status: originalResponse.status,
          statusText: originalResponse.statusText,
          headers: originalResponse.headers
        });
      }
    } catch (e) {}
    return originalResponse;
  };

  // Auto-responder/auto-next
  const selectors = [
    '[data-testid="choice-icon__library-choice-icon"]',
    '[data-testid="exercise-check-answer"]',
    '[data-testid="exercise-next-question"]',
    '._1udzurba',
    '._awve9b'
  ];
  window.khanwareDominates = true;
  (async () => {
    while (window.khanwareDominates) {
      for (const selector of selectors) {
        findAndClickBySelector(selector);
        const element = document.querySelector(`${selector} > div`);
        if (element?.innerText === "Mostrar resumo") {
          sendToast("🎉┃Exercício concluído!", 3000);
        }
      }
      await delay(800);
    }
  })();
}

// ====== FLUXO PRINCIPAL ======
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async function init() {
    await showSplashScreen();
    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js','darkReaderPlugin').then(() => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    ]);
    await hideSplashScreen();
    // --- PAINEL DE SENHA ---
    await showPasswordPanel();
    // --- LIBERA AS TAREFAS ---
    setupMain();
    sendToast("🍀┃KhanResolver iniciado!");
    console.clear();
  })();
}
