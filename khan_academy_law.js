// ==UserScript==
// @name         Khan Academy LAW + Painel e Abertura
// @namespace    http://estudiolaw.com/
// @version      1.1.0
// @description  Painel de senha + abertura animada + modo dark e automação Khan Academy (by Wesley1w2e)
// @author       Wesley
// @match        *://*/*
// @grant        none
// ==/UserScript==

(async function() {
  // ==== CONFIGURAÇÃO =====
  const VALID_UNTIL = "2025-12-31";
  const PASSWORDS = [
    "law2025@1","khanlaw!2","stud1oLAW","wesleyx2025","projetoblue",
    "lawaccess23","segredoLAW","unlockkhan","estudiopass","lawpremium"
  ];
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ==== 1) PAINEL DE SENHA =====
  function showAnimatedPasswordPanel() {
    return new Promise((resolve, reject) => {
      const today = new Date();
      if (today > new Date(VALID_UNTIL + "T23:59:59")) {
        alert("Acesso expirado! Procure o Estúdio LAW.");
        return reject("Expirado");
      }

      // overlay e painel
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
        <div style="margin:18px 0;color:#bbd;">Insira a senha:</div>
        <input id="estudiolaw-passinput" type="password" maxlength="64"
          style="width:90%;padding:10px;border-radius:7px;border:1.2px solid #00aaff;
                 margin-bottom:15px;box-shadow:0 0 0 2px #00aaff22;" autofocus />
        <br>
        <button id="estudiolaw-passok" style="
          background:linear-gradient(90deg,#00aaff,#0077cc);color:#fff;border:none;
          border-radius:6px;padding:10px 38px;cursor:pointer;box-shadow:0 1px 5px #00aaff44;
          transition:filter .15s;
        ">Entrar</button>
        <div style="margin-top:10px;color:#8bb">Validade: até ${VALID_UNTIL.split("-").reverse().join("/")}</div>
        <div id="estudiolaw-pass-err" style="color:#ff6a6a;margin-top:8px;min-height:20px;"></div>
      `;
      overlay.appendChild(panel);
      if (!document.getElementById('estudiolaw-pw-style')) {
        const s = document.createElement('style'); s.id = 'estudiolaw-pw-style';
        s.innerHTML = `
          @keyframes lawBgFlow {0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}}
          @keyframes fadeSlideIn {from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
          #estudiolaw-passinput:focus{border-color:#00ccff;box-shadow:0 0 8px #00aaff55;}
          #estudiolaw-passok:hover{filter:brightness(1.09) saturate(1.13);}
        `;
        document.head.appendChild(s);
      }
      document.body.appendChild(overlay);

      // eventos
      document.getElementById("estudiolaw-passok").onclick = () => {
        const val = document.getElementById("estudiolaw-passinput").value;
        if (PASSWORDS.includes(val)) {
          overlay.remove();
          resolve();
        } else {
          document.getElementById("estudiolaw-pass-err").textContent = "Senha incorreta!";
        }
      };
      document.getElementById("estudiolaw-passinput").onkeydown = e => {
        if (e.key === "Enter") document.getElementById("estudiolaw-passok").click();
      };
    });
  }

  // ==== 2) ABERTURA ANIMADA =====
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
      <div style="font-size:3em;font-weight:bold;color:#fff;
                  text-shadow:0 0 10px #00aaff,0 0 20px #0077cc;
                  animation:glowText 2s ease-in-out infinite alternate,fadeSlideIn 1.5s forwards;
                  opacity:0;transform:translateY(30px);">
        Estúdio <span style="color:#00aaff;">LAW</span>
      </div>
    `;
    if (!document.getElementById('law-splash-style')) {
      const s = document.createElement('style'); s.id = 'law-splash-style';
      s.innerHTML = `
        @keyframes backgroundFlow {0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}}
        @keyframes glowText {0%{text-shadow:0 0 10px #00aaff,0 0 20px #0077cc}100%{text-shadow:0 0 30px #00ccff,0 0 40px #00aaff}}
        @keyframes fadeSlideIn {to{opacity:1;transform:translateY(0)}}
      `;
      document.head.appendChild(s);
    }
    document.body.appendChild(splash);
    setTimeout(()=>{
      const txt = splash.querySelector('div');
      txt.style.opacity = '1'; txt.style.transform = 'translateY(0)';
    },10);
  }
  async function hideLawSplash() {
    splash.style.opacity = '0';
    await delay(800);
    splash.remove();
  }

  // ==== 3) LOAD TOASTIFY (antes de enviar toast) =====
  async function loadCss(url){return new Promise(r=>{const l=document.createElement('link');l.rel='stylesheet';l.href=url;l.onload=r;document.head.appendChild(l);});}
  async function loadScript(url){const r=await fetch(url);eval(await r.text());}

  // 1) Painel de senha
  await showAnimatedPasswordPanel();

  // 2) Carrega Toastify
  await Promise.all([
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js')
  ]);
  function sendToast(txt,d=3000){
    Toastify({text:txt,duration:d,gravity:"bottom",position:"center",stopOnFocus:true,style:{background:"#000"}}).showToast();
  }

  // 3) Toast de boas-vindas
  sendToast("🎉 Bem-vindo ao Estúdio LAW!",3500);
  await delay(3500);

  // 4) Abertura animada
  await showLawSplash();
  await delay(3000);
  await hideLawSplash();

  // ==== 4) PROTEÇÃO + DARKREADER + AUTOMAÇÃO KHAN ACADEMY ====
  // Proteção original do Wesley1w2e
  const prot = document.createElement('script');
  prot.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
  document.head.appendChild(prot);

  // Carrega DarkReader
  await loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js').then(()=>{
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
  });

  // Inicia automação
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let body = input instanceof Request ? await input.clone().text() : init?.body;
    if (body?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        const o = JSON.parse(body);
        const d = o.variables.input.durationSeconds;
        o.variables.input.secondsWatched = d;
        o.variables.input.lastSecondWatched = d;
        body = JSON.stringify(o);
        if (input instanceof Request) input = new Request(input,{body});
        else init.body = body;
        sendToast("🔓┃Vídeo explorado.",1000);
      } catch{}
    }
    const resp = await originalFetch(input, init);
    try {
      const c = await resp.clone().text();
      const j = JSON.parse(c);
      if (j?.data?.assessmentItem?.item?.itemData) {
        const id = JSON.parse(j.data.assessmentItem.item.itemData);
        if (id.question.content[0] === id.question.content[0].toUpperCase()) {
          id.answerArea = {calculator:false,chi2Table:false,periodicTable:false,tTable:false,zTable:false};
          id.question.content = " [[☃ radio 1]]";
          id.question.widgets = {"radio 1":{type:"radio",options:{choices:[
            {content:"Wesley o Brabo",correct:true},
            {content:"Opção errada 1",correct:false}
          ]}}};
          j.data.assessmentItem.item.itemData = JSON.stringify(id);
          return new Response(JSON.stringify(j),{
            status:resp.status,statusText:resp.statusText,headers:resp.headers
          });
        }
      }
    } catch{}
    return resp;
  };

  // Loop de cliques
  (async()=>{
    const sels=[`[data-testid="choice-icon__library-choice-icon"]`,
                `[data-testid="exercise-check-answer"]`,
                `[data-testid="exercise-next-question"]`,`._1udzurba`,`._awve9b`];
    window.khanwareDominates=true;
    while(window.khanwareDominates){
      for(const s of sels){
        document.querySelector(s)?.click();
        const el = document.querySelector(`${s}>div`);
        if(el?.innerText==="Mostrar resumo"){
          sendToast("🎉┃Exercício concluído!",3000);
        }
      }
      await delay(800);
    }
  })();

  // Redireciona se não estiver na Khan
  if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(location.href)){
    location.href = "https://pt.khanacademy.org/";
  }
})();
