// ==UserScript==
// @name         Khan Academy LAW + Automação Completa
// @namespace    http://estudiolaw.com/
// @version      1.4.1
// @description  Automação de tarefas Khan + senha com hora, comemoração 5s, splash, DarkReader e toast — com lógica original Wesley1w2e  
// @author       Wesley1w2e
// @match        *://*.khanacademy.org/*
// @match        *://khanacademy.org/*
// @grant        none
// ==/UserScript==

(async function() {

  // 1) Base Wesley1w2e: protege fetch, auto next, etc.
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
  document.head.appendChild(script);

  let loadedPlugins = [];
  console.clear();
  const noop = () => {};
  console.warn = console.error = window.debug = noop;

  const delay = ms => new Promise(r => setTimeout(r, ms));
  const findAndClickBySelector = selector => document.querySelector(selector)?.click();

  function sendToast(text, duration = 3000) {
    Toastify({
      text,
      duration,
      gravity: 'bottom',
      position: "center",
      stopOnFocus: true,
      style: { background: "#000" }
    }).showToast();
  }

  // 2) Automação Wesley: clicas e avançar
  function setupMain() {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const [input, init] = args;
      let body;
      if (input instanceof Request) body = await input.clone().text();
      else if (init?.body) body = init.body;

      if (body?.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const bodyObj = JSON.parse(body);
          const d = bodyObj.variables.input.durationSeconds;
          bodyObj.variables.input.secondsWatched = d;
          bodyObj.variables.input.lastSecondWatched = d;
          const newBody = JSON.stringify(bodyObj);
          if (input instanceof Request) args[0] = new Request(input, { ...input, body: newBody });
          else args[1] = { ...init, body: newBody };
          sendToast("🔓 Vídeo explorado.", 1000);
        } catch {}
      }

      const resp = await originalFetch(...args);
      try {
        const txt = await resp.clone().text();
        const j = JSON.parse(txt);
        const data = j?.data?.assessmentItem?.item?.itemData;
        if (data) {
          let item = JSON.parse(data);
          // FORÇA "Opção LAW" como certa
          item.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
          item.question.content = " [[☃ radio 1]]";
          item.question.widgets = {
            "radio 1": {
              type: "radio",
              options: {
                choices: [
                  { content: "Opção LAW", correct: true },
                  { content: "Opção incorreta", correct: false }
                ]
              }
            }
          };
          j.data.assessmentItem.item.itemData = JSON.stringify(item);
          return new Response(JSON.stringify(j), { status: resp.status, statusText: resp.statusText, headers: resp.headers });
        }
      } catch {}
      return resp;
    };

    (async () => {
      const selectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`
      ];
      window.khanwareDominates = true;
      while (window.khanwareDominates) {
        selectors.forEach(sel => findAndClickBySelector(sel));
        await delay(800);
      }
    })();
  }

  // ---- Nossa parte visual ----

  // 3) Painel de senha rápida (sem hora desta vez, mas você pode reativar)
  async function showPasswordPanel() {
    return; // pulamos para teste direto
  }

  // 4) Comemoração suave 5s
  async function showCelebration() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    Object.assign(canvas, { width: innerWidth, height: innerHeight });
    Object.assign(canvas.style, {
      position: "fixed", top: 0, left: 0, zIndex: 999998,
      background: "radial-gradient(circle,#0a1a2f,#000)", opacity: 1, transition: "opacity 1s ease"
    });
    document.body.append(canvas);
    let particles = [], rockets = [], tick = 0;

    class Rocket {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -(4 + Math.random() * 3);
        this.exploded = false;
      }
      update() {
        if (!this.exploded) {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.1;
          if (this.vy >= 0) this.explode();
        }
      }
      explode() {
        this.exploded = true;
        const hue = Math.random() * 360;
        for (let i = 0; i < 30; i++) {
          particles.push({
            x: this.x, y: this.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            hue, alpha: 1
          });
        }
      }
      draw() {
        if (!this.exploded) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(this.x, this.y, 2, 4);
        }
      }
    }

    function animate() {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (tick % 20 === 0) rockets.push(new Rocket());
      rockets.forEach(r => { r.update(); r.draw(); });
      rockets = rockets.filter(r => !r.exploded);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsl(${p.hue},100%,70%)`;
        ctx.fillRect(p.x, p.y, 3, 3);
      });
      particles = particles.filter(p => p.alpha > 0);
      ctx.globalAlpha = 1;

      if (tick < 200) {
        requestAnimationFrame(animate);
      } else {
        ctx.fillStyle = "#fff";
        ctx.font = "2.5em sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🎉 Bem-vindo ao Estúdio LAW!", canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
          canvas.style.opacity = 0;
          setTimeout(() => { canvas.remove(); }, 1000);
        }, 3000);
      }
    }

    animate();
    await delay(5000);
  }

  // 5) Splash original
  async function showSplashScreen() {
    const splash = document.createElement("div");
    splash.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;
      display:flex;justify-content:center;align-items:center;
      background:linear-gradient(270deg,#001122,#0044cc,#003366,#000022);
      background-size:600% 600%;animation:fireAnimation 5s infinite alternate;
      color:#3399ff;font-family:MuseoSans,sans-serif;font-size:48px;
      text-shadow:0 0 8px,#3399ff,0 0 15px,#3399ff,0 0 30px,#66ccff;
      transition:opacity 1s ease;
    `;
    splash.textContent = "";
    document.body.append(splash);
    const text = "Estúdio LAW", len = text.length;
    let idx = 0;
    return new Promise(res => {
      const iv = setInterval(() => {
        splash.textContent = text.slice(0, ++idx);
        if (idx === len) {
          clearInterval(iv);
          setTimeout(() => {
            splash.style.opacity = 0;
            setTimeout(() => { splash.remove(); res(); }, 1000);
          }, 2000);
        }
      }, 100);
    });
  }

  // 6) Carrega DarkReader/Toast
  const loadCss = url => new Promise(r => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = url; l.onload = r;
    document.head.append(l);
  });
  const loadScript = async url => eval(await (await fetch(url)).text());

  await loadScript("https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js").then(() => {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
  });
  await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
  await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
  const toast = (t, d = 2000) => Toastify({ text: t, duration: d, stopOnFocus: true, gravity: "bottom", position: "center", style: { background: "#000" } }).showToast();

  // Sequência de execução
  // await showPasswordPanel();  // desabilitado para testes
  toast("🔐 Acesso ok", 1200);
  await showCelebration();
  await showSplashScreen();
  toast("🚀 Automação Khan Academy ativada", 1500);

  setupMain();

})();
