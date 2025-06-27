// ==UserScript==
// @name         Khan Academy LAW + Senha + Splash + Automação
// @namespace    http://estudiolaw.com/
// @version      1.5.0
// @description  Automação Khan Academy com senha por hora, splash, comemoração, dark, tarefas e mais!
// @author       Wesley
// @match        *://*.khanacademy.org/*
// @grant        none
// ==/UserScript==

(async function() {
  const delay = ms => new Promise(r => setTimeout(r, ms));

  const PASSWORDS = [
    { pass: "270425", expires: "2026-01-31T23:59:59" },
    { pass: "WesleyX_11#25", expires: "2025-12-31T12:00:00" },
    { pass: "Premium_LAW*Apr2026", expires: "2026-04-30T20:00:00" }
  ];

  async function showPasswordPanel() {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const validList = PASSWORDS.filter(p => new Date(p.expires) > now);
      const overlay = document.createElement('div');
      overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:#0a1a2fdd;display:flex;align-items:center;justify-content:center;
        z-index:999999;font-family:sans-serif;`;
      const box = document.createElement('div');
      box.style = `
        background:#111;border-radius:10px;padding:30px;color:#fff;text-align:center;
        box-shadow:0 0 20px #00aaff88;min-width:300px;`;
      box.innerHTML = `
        <h2 style="margin-bottom:10px;">Estúdio <span style="color:#00aaff;">LAW</span></h2>
        <p>Digite a senha para continuar:</p>
        <input type="password" id="lawPassInput" style="padding:10px;width:90%;margin-top:10px;border-radius:5px;" />
        <div id="lawPassError" style="color:#f66;height:20px;margin-top:10px;"></div>
        <button style="margin-top:10px;padding:10px 30px;background:#00aaff;border:none;border-radius:5px;color:#fff;cursor:pointer;">Entrar</button>
      `;
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      const input = box.querySelector("input");
      const error = box.querySelector("#lawPassError");
      const btn = box.querySelector("button");
      btn.onclick = () => {
        const val = input.value.trim();
        const found = validList.find(p => p.pass === val);
        if (found) {
          overlay.remove();
          resolve();
        } else {
          error.textContent = "Senha incorreta ou expirada.";
        }
      };
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") btn.click();
      });
    });
  }

  async function showCelebration() {
    const canvas = document.createElement("canvas");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;
      background:#000;z-index:999998;transition:opacity 1s ease;`;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let particles = [], rockets = [], tick = 0;
    class Rocket {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -5 - Math.random() * 2;
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
        for (let i = 0; i < 40; i++) {
          particles.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            alpha: 1,
            hue: Math.random() * 360
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
      if (tick % 30 === 0) rockets.push(new Rocket());
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

      if (tick < 180) {
        requestAnimationFrame(animate);
      } else {
        ctx.fillStyle = "#fff";
        ctx.font = "2.5em sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🎉 Bem-vindo ao Estúdio LAW!", canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
          canvas.style.opacity = 0;
          setTimeout(() => canvas.remove(), 1000);
        }, 3000);
      }
    }

    animate();
    await delay(5000);
  }

  async function showSplashScreen() {
    const splash = document.createElement("div");
    splash.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:linear-gradient(270deg,#001122,#003366,#000022);
      z-index:9999999;display:flex;align-items:center;justify-content:center;
      font-size:3em;font-weight:bold;color:#fff;text-shadow:0 0 10px #00aaff;
      animation:fadein 2s ease;
    `;
    splash.textContent = "Estúdio LAW";
    document.body.appendChild(splash);
    await delay(3000);
    splash.style.opacity = 0;
    await delay(1000);
    splash.remove();
  }

  async function loadScript(url) {
    const r = await fetch(url);
    return eval(await r.text());
  }

  await showPasswordPanel();

  await loadScript("https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js");
  DarkReader.setFetchMethod(window.fetch);
  DarkReader.enable();

  await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
  const toast = (text, d = 2500) => Toastify({ text, duration: d, gravity: "bottom", position: "center", style: { background: "#000" } }).showToast();

  toast("🔓 Acesso concedido!");
  await showCelebration();
  await showSplashScreen();

  // Automação Wesley1w2e
  const selectors = [
    `[data-testid="choice-icon__library-choice-icon"]`,
    `[data-testid="exercise-check-answer"]`,
    `[data-testid="exercise-next-question"]`,
    `._1udzurba`,
    `._awve9b`
  ];
  const originalFetch = window.fetch;
  window.fetch = async function(input, init = {}) {
    const url = input instanceof Request ? input.url : input;
    if (url.includes('/graphql') && init.method === 'POST') {
      let bodyText = init.body;
      if (input instanceof Request && !bodyText) bodyText = await input.clone().text();
      if (bodyText?.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          const o = JSON.parse(bodyText);
          const d = o.variables.input.durationSeconds;
          o.variables.input.secondsWatched = d;
          o.variables.input.lastSecondWatched = d;
          const newBody = JSON.stringify(o);
          if (input instanceof Request) input = new Request(input, { body: newBody });
          else init.body = newBody;
          toast("🔓 Vídeo explorado.", 1000);
        } catch {}
      }
      const resp = await originalFetch(input, init);
      try {
        const txt = await resp.clone().text();
        const j = JSON.parse(txt);
        const data = j?.data?.assessmentItem?.item?.itemData;
        if (data) {
          let item = JSON.parse(data);
          item.answerArea = { calculator: false };
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
          return new Response(JSON.stringify(j), {
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          });
        }
      } catch {}
      return resp;
    }
    return originalFetch(input, init);
  };

  window.khanwareDominates = true;
  (async () => {
    while (window.khanwareDominates) {
      for (const sel of selectors) {
        document.querySelector(sel)?.click();
      }
      await delay(800);
    }
  })();

})();
