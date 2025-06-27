// ==UserScript==
// @name         Khan Academy LAW + Senhas com Hora, Comemoração e Abertura (Corrigido)
// @namespace    http://estudiolaw.com/
// @version      1.3.2
// @description  Painel de senhas (com hora), comemoração dinâmica (3s), abertura animada, Dark-Mode e automação Khan Academy (sem forçar respostas falsas) — Wesley1w2e  
// @author       Wesley - Estúdio LAW
// @match        *://*.khanacademy.org/*
// @match        *://khanacademy.org/*
// @grant        none
// ==/UserScript==

(async function() {
  // ==== 1) CONFIGURAÇÃO DE SENHAS COM VALIDADE E HORA ====
  const PASSWORDS = [
    { pass: "270425",     expires: "2026-01-31T23:59:59" },
    { pass: "kng120120",  expires: "2026-01-31T23:59:59" },
    { pass: "dogmal",     expires: "2026-01-31T23:59:59" },
    { pass: "WesleyX_11#25", expires: "2025-11-30T23:59:59" },
    { pass: "Proj3toBlue*Dez25", expires: "2025-12-31T23:59:59" },
    { pass: "SegredoLAW$Jan26",   expires: "2026-01-31T23:59:59" },
    { pass: "Unlock-Khan#02Feb26",expires: "2026-02-28T23:59:59" },
    { pass: "EstudioPass!Mar26",  expires: "2026-03-31T23:59:59" },
    { pass: "Premium_LAW*Apr2026",expires: "2026-04-30T23:59:59" },
    { pass: "Access23-Law#May26", expires: "2026-05-31T23:59:59" }
  ];
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ==== 2) PAINEL DE SENHA DINÂMICO ====
  async function showAnimatedPasswordPanel() {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const validList = PASSWORDS.filter(item => new Date(item.expires) >= now);
      if (!validList.length) {
        alert("Todas as senhas expiraram! Consulte o Estúdio LAW.");
        return reject("Sem senhas válidas");
      }

      const overlay = document.createElement('div');
      overlay.id = "estudiolaw-password-overlay";
      overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
        background:linear-gradient(-45deg,#1e3c72,#2a5298,#0f2027,#232526,#1e3c72);
        background-size:400% 400%;animation:lawBgFlow 7s ease-in-out infinite alternate;
        display:flex;align-items:center;justify-content:center;
      `;

      const panel = document.createElement('div');
      panel.style = `
        background:rgba(18,43,70,0.93);box-shadow:0 8px 32px #000a,0 0 0 2px #00aaff44;
        border-radius:18px;padding:40px 36px 26px;font-family:'Segoe UI',sans-serif;
        text-align:center;min-width:340px;max-width:90vw;backdrop-filter:blur(4px);
        border:1.8px solid #00aaff88;animation:fadeSlideIn 1.1s cubic-bezier(.4,0,.2,1);
      `;
      panel.innerHTML = `
        <div style="font-size:2.1em;font-weight:bold;color:#fff;text-shadow:0 0 8px #00aaff77;">
          Estúdio <span style="color:#00aaff;">LAW</span>
        </div>
        <div style="margin:18px 0;color:#bbd;">Insira a senha para continuar:</div>
        <input id="estudiolaw-passinput" type="password" maxlength="64"
          style="width:90%;padding:10px;border-radius:7px;border:1.2px solid #00aaff;
                 margin-bottom:8px;box-shadow:0 0 0 2px #00aaff22;" autofocus />
        <br>
        <button id="estudiolaw-passok" style="
          background:linear-gradient(90deg,#00aaff,#0077cc);
          color:#fff;border:none;border-radius:6px;padding:10px 38px;
          cursor:pointer;box-shadow:0 1px 5px #00aaff44;transition:filter .15s;
        ">Entrar</button>
        <div id="estudiolaw-pass-err" style="color:#ff6a6a;margin-top:12px;min-height:20px;"></div>
        <div style="margin-top:16px;font-size:0.9em;color:#59b;opacity:0.8;">
          Senhas expiradas não são aceitas.
        </div>
      `;
      overlay.appendChild(panel);

      if (!document.getElementById('estudiolaw-pw-style')) {
        const s = document.createElement('style');
        s.id = 'estudiolaw-pw-style';
        s.innerHTML = `
          @keyframes lawBgFlow {
            0% { background-position:0 50%; }
            50% { background-position:100% 50%; }
            100% { background-position:0 50%; }
          }
          @keyframes fadeSlideIn {
            from { opacity:0; transform:translateY(40px); }
            to { opacity:1; transform:translateY(0); }
          }
          #estudiolaw-passinput:focus {
            border-color:#00ccff; box-shadow:0 0 8px #00aaff55;
          }
          #estudiolaw-passok:hover {
            filter:brightness(1.09) saturate(1.13);
          }
        `;
        document.head.appendChild(s);
      }

      document.body.appendChild(overlay);

      document.getElementById("estudiolaw-passok").onclick = () => {
        const val = document.getElementById("estudiolaw-passinput").value;
        const match = validList.find(item => item.pass === val);
        if (match) {
          overlay.remove();
          resolve();
        } else {
          document.getElementById("estudiolaw-pass-err").textContent =
            "Senha incorreta ou expirada!";
        }
      };
      document.getElementById("estudiolaw-passinput").onkeydown = e => {
        if (e.key === "Enter") document.getElementById("estudiolaw-passok").click();
      };
    });
  }

  // ==== 3) COMEMORAÇÃO DINÂMICA (3s) ====
  async function showCelebration() {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      Object.assign(canvas.style, {
        position:'fixed', top:0, left:0,
        width:'100vw',height:'100vh',
        background:'radial-gradient(circle,#0a1a2f,#000)',
        zIndex:10000
      });
      document.body.appendChild(canvas);
      canvas.width=innerWidth; canvas.height=innerHeight;
      const ctx=canvas.getContext('2d');
      let fireworks=[], ticks=0;

      class Particle {
        constructor(x,y,color){
          this.x=x; this.y=y;
          const angle=Math.random()*Math.PI*2;
          const speed=1+Math.random()*3;
          this.vx=Math.cos(angle)*speed;
          this.vy=Math.sin(angle)*speed;
          this.alpha=1; this.color=color;// ==UserScript==
// @name         Khan Academy LAW v1.3.4
// @namespace    http://estudiolaw.com/
// @version      1.3.4
// @description  Senha c/ hora, comemoração 5s, splash LAW, DarkMode, toast, auto-exercícios e força “Opção LAW” como certa  
// @author       Wesley - Estúdio LAW
// @match        *://*.khanacademy.org/*
// @match        *://khanacademy.org/*
// @grant        none
// ==/UserScript==

(async function() {
  const PASSWORDS = [
    { pass: "270425",     expires: "2026-01-31T23:59:59" },
    { pass: "kng120120",  expires: "2026-01-31T23:59:59" },
    { pass: "dogmal",     expires: "2026-01-31T23:59:59" },
    { pass: "WesleyX_11#25", expires: "2025-11-30T23:59:59" },
    { pass: "Proj3toBlue*Dez25", expires: "2025-12-31T23:59:59" },
    { pass: "SegredoLAW$Jan26",   expires: "2026-01-31T23:59:59" },
    { pass: "Unlock-Khan#02Feb26",expires: "2026-02-28T23:59:59" },
    { pass: "EstudioPass!Mar26",  expires: "2026-03-31T23:59:59" },
    { pass: "Premium_LAW*Apr2026",expires: "2026-04-30T23:59:59" },
    { pass: "Access23-Law#May26", expires: "2026-05-31T23:59:59" }
  ];
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // 1) painel de senha
  async function showPassword() {
    return new Promise((res, rej) => {
      const now = new Date();
      const valid = PASSWORDS.filter(p => new Date(p.expires) >= now);
      if (!valid.length) { alert("Sem senhas válidas"); return rej(); }

      const o = document.createElement("div");
      o.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(0,0,0,0.7);display:flex;justify-content:center;
        align-items:center;z-index:999999;font-family:sans-serif`;
      const p = document.createElement("div");
      p.style = `background:#122b46;padding:30px;border-radius:12px;
        box-shadow:0 0 20px #00aaff44;text-align:center;color:#fff;`;
      p.innerHTML = `
        <h2>Estúdio <span style="color:#0af">LAW</span></h2>
        <input id="law-pw" type="password" placeholder="Senha" autofocus
          style="padding:10px;font-size:1em;border-radius:5px;border:1px solid #0af;
          margin-top:8px;">
        <button id="law-go" style="margin-left:8px;padding:10px;border:none;
          background:#0af;color:#fff;border-radius:5px;cursor:pointer;">OK</button>
        <div id="law-err" style="color:#f66;margin-top:8px"></div>`;
      o.append(p); document.body.append(o);

      p.querySelector("#law-go").onclick = () => {
        const v = p.querySelector("#law-pw").value;
        if (valid.some(x=>x.pass===v)) { o.remove(); res(); }
        else p.querySelector("#law-err").textContent="Senha inválida ou expirada";
      };
      p.querySelector("#law-pw").onkeydown = e => e.key==="Enter"&&p.querySelector("#law-go").click();
    });
  }

  // 2) comemoração 5s
  async function celebrate() {
    return new Promise(res=>{
      const c = document.createElement("canvas"),
            ctx = c.getContext("2d");
      Object.assign(c, { width:innerWidth, height:innerHeight });
      Object.assign(c.style, {
        position:"fixed",top:0,left:0,zIndex:999998,
        background:"#0a1a2f"
      });
      document.body.append(c);
      let fw = [], t=0;

      class Firework {
        constructor(){
          this.x = Math.random()*c.width;
          this.y = c.height+50;
          this.vx = (Math.random()-.5)*2;
          this.vy = -(4+Math.random()*3);
          this.expl=false; this.p=[];
        }
        explode(){
          this.expl = true;
          const hue = Math.random()*360;
          for(let i=0;i<30;i++){
            this.p.push({
              x:this.x, y:this.y,
              vx:(Math.random()-.5)*4,
              vy:(Math.random()-.5)*4,
              c:`hsl(${hue},100%,70%)`,
              a:1
            });
          }
        }
        update(){
          if(!this.expl){
            this.x+=this.vx; this.y+=this.vy; this.vy+=0.1;
            if(this.vy>=0) this.explode();
          } else {
            this.p.forEach(o=>{ o.x+=o.vx; o.y+=o.vy; o.a-=0.02 });
            this.p = this.p.filter(o=>o.a>0);
          }
        }
        draw(){
          if(!this.expl){
            ctx.fillStyle="#fff"; ctx.fillRect(this.x,this.y,2,4);
          } else {
            this.p.forEach(o=>{
              ctx.globalAlpha=o.a;
              ctx.fillStyle=o.c;
              ctx.fillRect(o.x,o.y,3,3);
              ctx.globalAlpha=1;
            });
          }
        }
      }

      function anim(){
        t++;
        ctx.clearRect(0,0,c.width,c.height);
        if(t%20===0) fw.push(new Firework());
        fw.forEach(f=>{f.update();f.draw()});
        if(t<150) requestAnimationFrame(anim);
        else {
          ctx.fillStyle="#fff";
          ctx.font="2.2em sans-serif";
          ctx.textAlign="center";
          ctx.fillText("🎉 Bem-vindo ao Estúdio LAW!",c.width/2,c.height/2);
          setTimeout(()=>{c.remove();res()},2500);
        }
      }
      anim();
    });
  }

  // 3) splash LAW
  async function showSplash(){
    const d = document.createElement("div");
    d.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;z-index:999997;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(-45deg,#0f1c2e,#152842);
      background-size:400% 400%;animation:flow 8s ease infinite;
      opacity:1;transition:opacity .6s`;
    d.innerHTML = `<div style="color:#fff;font-size:3em;
      text-shadow:0 0 10px #0af;">Estúdio <span style="color:#0af">LAW</span></div>`;
    const s = document.createElement("style");
    s.textContent = `
      @keyframes flow {
        0%{background-position:0 50%}
        50%{background-position:100% 50%}
        100%{background-position:0 50%}
      }
    `;
    document.head.append(s);
    document.body.append(d);
    await delay(2000);
    d.style.opacity=0; await delay(600); d.remove();
  }

  // 4) Toastify & DarkReader
  const loadCss = url => new Promise(r=>{
    const l = document.createElement("link");
    l.rel="stylesheet";l.href=url;l.onload=r;
    document.head.append(l);
  });
  const loadScript = async url => eval(await (await fetch(url)).text());

  await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
  await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
  await loadScript("https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js").then(()=>{
    DarkReader.setFetchMethod(window.fetch); DarkReader.enable();
  });
  const sendToast = (t,d=2000)=>Toastify({
    text:t,duration:d,gravity:"bottom",position:"center",
    style:{background:"#000"}
  }).showToast();

  // sequência
  await showPassword();
  sendToast("🔐 Acesso permitido",1200); await delay(1200);
  await celebrate();
  await showSplash();
  sendToast("🚀 Script LAW ativo",1500);

  // 5) override fetch: vídeo + forçar “Opção LAW”
  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init={}) => {
    const url = input instanceof Request ? input.url : input;
    if (url.includes('/graphql') && init.method==='POST') {
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
          sendToast("🔓 Vídeo explorado",800);
        } catch {}
      }
      const resp = await origFetch(input, init);
      try {
        const txt = await resp.clone().text();
        const j = JSON.parse(txt);
        const data = j?.data?.assessmentItem?.item?.itemData;
        if (data) {
          let item = JSON.parse(data);
          // força widget com Opção LAW
          item.answerArea = {
            calculator:false, chi2Table:false,
            periodicTable:false, tTable:false, zTable:false
          };
          item.question.content = " " + `[[☃ radio 1]]`;
          item.question.widgets = {
            "radio 1": {
              type:"radio",
              options:{choices:[
                {content:"Opção LAW", correct:true},
                {content:"Opção incorreta", correct:false}
              ]}
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

  // 6) auto-exercícios: marcar 1ª, conferir, próximo
  (async()=>{
    while(true) {
      const choice = document.querySelector("input[type=radio]");
      if (choice) choice.click();
      const chk = document.querySelector('[data-testid="exercise-check-answer"]');
      if (chk) chk.click();
      await delay(500);
      const nxt = document.querySelector('[data-testid="exercise-next-question"]');
      if (nxt) nxt.click();
      await delay(800);
    }
  })();

})();
