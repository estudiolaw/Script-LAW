// ==UserScript==
// @name         Khan Academy LAW + Senhas com Hora, Comemoração e Abertura
// @namespace    http://estudiolaw.com/
// @version      1.3.1
// @description  Painel de senhas com validade até hora exata, comemoração dinâmica, abertura animada, modo dark e automação Khan Academy (by Wesley1w2e)
// @author       Wesley
// @match        *://*.khanacademy.org/*
// @match        *://khanacademy.org/*
// @grant        none
// ==/UserScript==

(async function() {
  // ==== 1) CONFIGURAÇÃO DE SENHAS COM VALIDADE E HORA ====
  const PASSWORDS = [
    { pass: "Law!Access#2025",     expires: "2025-07-31T23:59:59" },
    { pass: "K@hnL4w*Sept",        expires: "2025-09-30T23:59:59" },
    { pass: "StuD10-L@wOct",       expires: "2025-10-31T23:59:59" },
    { pass: "WesleyX_11#25",       expires: "2025-11-30T23:59:59" },
    { pass: "Proj3toBlue*Dez25",   expires: "2025-12-31T23:59:59" },
    { pass: "SegredoLAW$Jan26",    expires: "2026-01-31T23:59:59" },
    { pass: "Unlock-Khan#02Feb26", expires: "2026-02-28T23:59:59" },
    { pass: "EstudioPass!Mar26",   expires: "2026-03-31T23:59:59" },
    { pass: "Premium_LAW*Apr2026", expires: "2026-04-30T23:59:59" },
    { pass: "Access23-Law#May26",  expires: "2026-05-31T23:59:59" }
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
            border-color:#00ccff;
            box-shadow:0 0 8px #00aaff55;
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

  // ==== 3) COMEMORAÇÃO DINÂMICA ====
  async function showCelebration() {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      Object.assign(canvas.style, {
        position: 'fixed', top:0, left:0,
        width:'100vw', height:'100vh',
        background:'#0a1a2f', zIndex:10000
      });
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      canvas.width = innerWidth; canvas.height = innerHeight;

      class Firework {
        constructor() {
          this.x = Math.random()*canvas.width;
          this.y = canvas.height+50;
          this.vx = (Math.random()-.5)*2;
          this.vy = -(5+Math.random()*3);
          this.exploded = false;
          this.particles = [];
        }
        update() {
          if(!this.exploded) {
            this.x+=this.vx; this.y+=this.vy; this.vy+=0.1;
            if(this.vy>=0) this.explode();
          } else {
            this.particles.forEach(p=>p.update());
            this.particles = this.particles.filter(p=>p.alpha>0);
          }
        }
        explode() {
          this.exploded = true;
          for(let i=0;i<30+Math.random()*30;i++) {
            this.particles.push(new Particle(this.x,this.y));
          }
        }
        draw() {
          if(!this.exploded) {
            ctx.fillStyle='#fff'; ctx.fillRect(this.x,this.y,2,4);
          } else {
            this.particles.forEach(p=>p.draw());
          }
        }
      }
      class Particle {
        constructor(x,y) {
          this.x=x; this.y=y;
          const angle=Math.random()*Math.PI*2;
          const speed=1+Math.random()*3;
          this.vx=Math.cos(angle)*speed;
          this.vy=Math.sin(angle)*speed;
          this.alpha=1;
          this.color=`hsl(${Math.random()*360},100%,70%)`;
        }
        update() { this.x+=this.vx; this.y+=this.vy+0.2; this.alpha-=0.02; }
        draw() {
          ctx.globalAlpha=this.alpha;
          ctx.fillStyle=this.color;
          ctx.fillRect(this.x,this.y,3,3);
          ctx.globalAlpha=1;
        }
      }

      const fireworks=[]; let ticks=0;
      function animate() {
        ticks++;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(ticks%30===0) fireworks.push(new Firework());
        fireworks.forEach(fw=>{ fw.update(); fw.draw(); });
        if(ticks<200) requestAnimationFrame(animate);
        else {
          ctx.fillStyle='#fff';
          ctx.font='3em Segoe UI';
          ctx.textAlign='center';
          ctx.fillText('Bem-vindo ao Script LAW!', canvas.width/2, canvas.height/2);
          setTimeout(() => { canvas.remove(); resolve(); }, 2500);
        }
      }
      animate();
    });
  }

  // ==== 4) ABERTURA ANIMADA LAW ====
  const splash = document.createElement('div');
  async function showLawSplash() {
    splash.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(-45deg,#0f1c2e,#0a1a2f,#152842,#0a1b2d);
      background-size:400% 400%;animation:backgroundFlow 10s ease infinite;
      font-family:'Segoe UI',sans-serif;opacity:1;transition:opacity .8s;
    `;
    splash.innerHTML = `
      <div style="
        font-size:3em;font-weight:bold;color:#fff;
        text-shadow:0 0 10px #00aaff,0 0 20px #0077cc;
        animation:glowText 2s ease-in-out infinite alternate,
                   fadeSlideIn 1.5s ease forwards;
        opacity:0;transform:translateY(30px);
      ">
        Estúdio <span style="color:#00aaff;">LAW</span>
      </div>
    `;
    if(!document.getElementById('law-splash-style')) {
      const s = document.createElement('style'); s.id='law-splash-style';
      s.innerHTML = `
        @keyframes backgroundFlow{0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}}
        @keyframes glowText{0%{text-shadow:0 0 10px #00aaff,0 0 20px #0077cc}100%{text-shadow:0 0 30px #00ccff,0 0 40px #00aaff}}
        @keyframes fadeSlideIn{to{opacity:1;transform:translateY(0)}}
      `;
      document.head.appendChild(s);
    }
    document.body.appendChild(splash);
    setTimeout(()=>{
      const txt=splash.querySelector('div');
      txt.style.opacity='1'; txt.style.transform='translateY(0)';
    },10);
  }
  async function hideLawSplash() {
    splash.style.opacity='0';
    await delay(800);
    splash.remove();
  }

  // ==== 5) FUNÇÕES DE CARREGAMENTO ====
  async function loadCss(u){return new Promise(r=>{const l=document.createElement('link');l.rel='stylesheet';l.href=u;l.onload=r;document.head.appendChild(l);});}
  async function loadScript(u){const r=await fetch(u);eval(await r.text());}

  // ==== 6) FLUXO PRINCIPAL ====
  await showAnimatedPasswordPanel();
  await Promise.all([
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js')
  ]);
  function sendToast(txt,d=3000){Toastify({text:txt,duration:d,gravity:"bottom",position:"center",stopOnFocus:true,style:{background:"#000"}}).showToast();}
  sendToast("🔐 Acesso concedido!",2000);
  await delay(2000);
  await showCelebration();
  await showLawSplash();
  await delay(3000);
  await hideLawSplash();

  // ==== 7) PROTEÇÃO + DARKREADER + AUTOMAÇÃO KHAN ACADEMY ====
  const prot = document.createElement('script');
  prot.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
  document.head.appendChild(prot);
  await loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js').then(()=>{
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
  });

  const _origFetch = window.fetch.bind(window);
  window.fetch = async (input, init={}) => {
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
          sendToast("🔓┃Vídeo explorado.",1000);
        } catch {}
      }
      const resp = await _origFetch(input, init);
      try {
        const txt = await resp.clone().text();
        const j = JSON.parse(txt);
        const data = j?.data?.assessmentItem?.item?.itemData;
        if (data) {
          let id = JSON.parse(data);
          if (id.question.content[0] === id.question.content[0].toUpperCase()) {
            id.answerArea = {calculator:false,chi2Table:false,periodicTable:false,tTable:false,zTable:false};
            id.question.content = " [[☃ radio 1]]";
            id.question.widgets = {"radio 1":{type:"radio",options:{choices:[
              {content:"Opção LAW.",correct:true},
              {content:"Opção errada.",correct:false}
            ]}}};
            j.data.assessmentItem.item.itemData = JSON.stringify(id);
            return new Response(JSON.stringify(j),{status:resp.status,statusText:resp.statusText,headers:resp.headers});
          }
        }
      } catch {}
      return resp;
    }
    return _origFetch(input, init);
  };

  (async()=>{
    const sels = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
    window.khanwareDominates = true;
    while(window.khanwareDominates) {
      for(const sel of sels) {
        document.querySelector(sel)?.click();
        const e = document.querySelector(`${sel}>div`);
        if(e?.innerText==="Mostrar resumo") sendToast("🎉┃Exercício Pronto Mani!",3000);
      }
      await delay(800);
    }
  })();

  if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(location.href)) {
    location.href = "https://pt.khanacademy.org/";
  }
})();
