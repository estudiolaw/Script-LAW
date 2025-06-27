// ==UserScript==
// @name         Khan Academy LAW + Senha, Comemoração Suave e Automação Corrigida
// @namespace    http://estudiolaw.com/
// @version      1.4.0
// @description  Painel de senha c/ hora, comemoração suave 5s, splash, DarkReader, toast e auto-exercícios com “Opção LAW” correta  
// @author       Wesley1w2e
// @match        *://*.khanacademy.org/*
// @grant        none
// ==/UserScript==

(async function() {
  // 1) Configuração de senhas
  const PASSWORDS = [
    { pass: "270425", expires: "2026-01-31T23:59:59" },
    { pass: "kng120120", expires: "2026-01-31T23:59:59" },
    { pass: "dogmal",     expires: "2026-01-31T23:59:59" },
    // … outras …
  ];
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // 2) Painel de senha com hora
  async function showPasswordPanel() {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const valid = PASSWORDS.filter(p => new Date(p.expires) >= now);
      if (!valid.length) {
        alert("Sem senhas válidas! Contate o Estúdio LAW.");
        return reject();
      }

      const overlay = document.createElement("div");
      overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(0,0,0,0.7);display:flex;justify-content:center;
        align-items:center;z-index:999999;font-family:sans-serif;
      `;
      overlay.innerHTML = `
        <div style="background:#122b46;padding:30px;border-radius:12px;
          box-shadow:0 0 20px #00aaff44;text-align:center;color:#fff;">
          <h2>Estúdio <span style="color:#0af">LAW</span></h2>
          <input id="law-pw" type="password" placeholder="Senha"
            style="padding:10px;border-radius:5px;border:1px solid #0af;width:200px;">
          <button id="law-go" style="margin-left:8px;padding:10px;
            background:#0af;border:none;color:#fff;border-radius:5px;cursor:pointer;">
            OK
          </button>
          <div id="law-err" style="color:#f66;margin-top:8px;"></div>
        </div>
      `;
      document.body.append(overlay);

      const input = overlay.querySelector("#law-pw");
      const btn = overlay.querySelector("#law-go");
      const err = overlay.querySelector("#law-err");

      function tryPass() {
        const v = input.value.trim();
        if (valid.some(x => x.pass === v)) {
          overlay.remove();
          resolve();
        } else {
          err.textContent = "Senha inválida ou expirada";
        }
      }
      btn.onclick = tryPass;
      input.onkeydown = e => e.key === "Enter" && tryPass();
    });
  }

  // 3) Comemoração suave 5s
  async function showCelebration() {
    return new Promise(res => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      Object.assign(canvas, { width: innerWidth, height: innerHeight });
      Object.assign(canvas.style, {
        position: "fixed", top: 0, left: 0, zIndex: 999998,
        background: "radial-gradient(circle,#0a1a2f,#000)", opacity: 1,
        transition: "opacity 1s ease"
      });
      document.body.append(canvas);

      let particles = [], rockets = [], tick = 0;

      class Rocket {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
          this.vx = (Math.random() - .5) * 2;
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
              vx: (Math.random() - .5) * 4,
              vy: (Math.random() - .5) * 4,
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
          p.x += p.vx; p.y += p.vy; p.alpha -= 0.02;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = `hsl(${p.hue},100%,70%)`;
          ctx.fillRect(p.x, p.y, 3, 3);
        });
        particles = particles.filter(p => p.alpha > 0);
        ctx.globalAlpha = 1;

        if (tick < 200) {
          requestAnimationFrame(animate);
        } else {
          // texto central
          ctx.fillStyle = "#fff";
          ctx.font = "2.5em sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🎉 Bem-vindo ao Estúdio LAW!", canvas.width/2, canvas.height/2);
          setTimeout(() => {
            canvas.style.opacity = 0;
            setTimeout(() => { canvas.remove(); res(); }, 1000);
          }, 3000);
        }
      }

      animate();
    });
  }

  // 4) Splash original
  async function showSplashScreen() {
    const splash = document.createElement("div");
    splash.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;z-index:999997;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(270deg,#001122,#0044cc,#003366,#000022);
      background-size:600% 600%;animation:fireAnimation 5s infinite alternate;
      color:#3399ff;font-family: MuseoSans,sans-serif;font-size:48px;
      text-shadow:0 0 8px,#3399ff,0 0 15px,#3399ff,0 0 30px,#66ccff;
      transition:opacity 1s ease;
    `;
    splash.textContent = "";
    document.body.append(splash);
    const text = "Estúdio LAW", len = text.length;
    let i = 0;
    return new Promise(res => {
      const iv = setInterval(() => {
        splash.textContent = text.slice(0, ++i);
        if (i === len) {
          clearInterval(iv);
          setTimeout(() => {
            splash.style.opacity = 0;
            setTimeout(() => { splash.remove(); res(); }, 1000);
          }, 2000);
        }
      }, 100);
    });
  }

  // 5) Carrega DarkReader e Toastify
  const loadCss = url => new Promise(r => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = url; l.onload = r;
    document.head.append(l);
  });
  const loadScript = async url => eval(await (await fetch(url)).text());

  await loadScript("https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js")
    .then(() => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); });
  await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
  await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
  const sendToast = (t, d=3000) => Toastify({
    text:t, duration:d, gravity:"bottom", position:"center",
    stopOnFocus:true, style:{background:"#000"}
  }).showToast();

  // Execução sequencial
  await showPasswordPanel();
  sendToast("🔐 Acesso permitido", 1200);
  await delay(1200);
  await showCelebration();
  await showSplashScreen();
  sendToast("🚀 KhanResolver iniciado", 1500);

  // 6) Override fetch + forçar “Opção LAW”
  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init={}) => {
    const url = input instanceof Request ? input.url : input;
    if (url.includes("/graphql") && init.method === "POST") {
      let body = init.body;
      if (input instanceof Request && !body) body = await input.clone().text();
      if (body?.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const o = JSON.parse(body);
          const d = o.variables.input.durationSeconds;
          o.variables.input.secondsWatched = d;
          o.variables.input.lastSecondWatched = d;
          const nb = JSON.stringify(o);
          if (input instanceof Request) input = new Request(input, { body: nb });
          else init.body = nb;
          sendToast("🔓 Vídeo explorado", 800);
        } catch {}
      }
      const resp = await origFetch(input, init);
      try {
        const txt = await resp.clone().text();
        const j = JSON.parse(txt);
        const data = j?.data?.assessmentItem?.item?.itemData;
        if (data) {
          let item = JSON.parse(data);
          item.answerArea = {
            calculator:false, chi2Table:false,
            periodicTable:false, tTable:false, zTable:false
          };
          item.question.content = " [[☃ radio 1]]";
          item.question.widgets = {
            "radio 1": {
              type:"radio", options:{
                choices:[
                  { content:"Opção LAW", correct:true },
                  { content:"Opção incorreta", correct:false }
                ]
              }
            }
          };
          j.data.assessmentItem.item.itemData = JSON.stringify(item);
          return new Response(JSON.stringify(j), {
            status:resp.status, statusText:resp.statusText, headers:resp.headers
          });
        }
      } catch {}
      return resp;
    }
    return origFetch(input, init);
  };

  // 7) Auto-exercícios
  (async()=>{
    while (true) {
      const choice = document.querySelector("input[type=radio]");
      if (choice) choice.click();
      const check = document.querySelector('[data-testid="exercise-check-answer"]');
      if (check) check.click();
      await delay(500);
      const next = document.querySelector('[data-testid="exercise-next-question"]');
      if (next) next.click();
      await delay(800);
    }
  })();
})();
