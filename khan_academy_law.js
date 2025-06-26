javascript:(async function() {
  const VALID_UNTIL = "2025-12-31";
  const PASSWORDS = [
    "law2025@1", "khanlaw!2", "stud1oLAW", "wesleyx2025", "projetoblue",
    "lawaccess23", "segredoLAW", "unlockkhan", "estudiopass", "lawpremium"
  ];
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Painel de senha
  function showAnimatedPasswordPanel() {
    return new Promise((resolve, reject) => {
      const today = new Date();
      const validDate = new Date(VALID_UNTIL + "T23:59:59");
      if (today > validDate) {
        alert("Acesso expirado! Procure o Estúdio LAW.");
        return reject();
      }
      const overlay = document.createElement('div');
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
        <input id="pw" type="password" style="width:90%;padding:10px;border-radius:7px;
          border:1.2px solid #00aaff;margin-bottom:15px;box-shadow:0 0 0 2px #00aaff22;" autofocus />
        <br>
        <button id="ok" style="background:linear-gradient(90deg,#00aaff,#0077cc);
          color:#fff;border:none;border-radius:6px;padding:10px 38px;cursor:pointer;">
          Entrar
        </button>
        <div style="margin-top:10px;color:#8bb">Validade até ${VALID_UNTIL.split("-").reverse().join("/")}</div>
        <div id="err" style="color:#f66;margin-top:8px;min-height:20px;"></div>
      `;
      overlay.appendChild(panel);
      if (!document.getElementById('law-style')) {
        const s = document.createElement('style');
        s.id = 'law-style';
        s.innerHTML = `
          @keyframes lawBgFlow {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
          @keyframes fadeSlideIn {from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
          #pw:focus{border-color:#00ccff;box-shadow:0 0 8px #00aaff55}
          #ok:hover{filter:brightness(1.1) saturate(1.15)}
        `;
        document.head.appendChild(s);
      }
      document.body.appendChild(overlay);
      document.getElementById('ok').onclick = () => {
        const val = document.getElementById('pw').value;
        if (PASSWORDS.includes(val)) {
          overlay.remove();
          resolve();
        } else {
          document.getElementById('err').textContent = "Senha incorreta!";
        }
      };
      document.getElementById('pw').onkeydown = e => e.key==='Enter' && document.getElementById('ok').click();
    });
  }

  // Splash do Estúdio LAW
  const splash = document.createElement('div');
  async function showSplash() {
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
      const s = document.createElement('style');
      s.id = 'law-splash-style';
      s.innerHTML = `
        @keyframes backgroundFlow {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes glowText {0%{text-shadow:0 0 10px #00aaff,0 0 20px #0077cc}100%{text-shadow:0 0 30px #00ccff,0 0 40px #00aaff}}
        @keyframes fadeSlideIn {to{opacity:1;transform:translateY(0)}}
      `;
      document.head.appendChild(s);
    }
    document.body.appendChild(splash);
    setTimeout(()=>{
      const t=splash.querySelector('div');
      t.style.opacity='1';t.style.transform='translateY(0)';
    },10);
  }
  async function hideSplash() { splash.style.opacity='0'; await delay(800); splash.remove(); }

  // Funções de carregamento
  async function loadCss(u){return new Promise(r=>{const l=document.createElement('link');l.rel='stylesheet';l.href=u;l.onload=r;document.head.appendChild(l);});}
  async function loadScript(u){const r=await fetch(u);eval(await r.text());}

  // 1) senha
  await showAnimatedPasswordPanel();

  // 2) toastify
  await Promise.all([
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js')
  ]);
  function sendToast(t,d=3000){Toastify({text:t,duration:d,gravity:"bottom",position:"center",stopOnFocus:true,style:{background:"#000"}}).showToast();}

  // 3) comemoração
  sendToast("🎉 Bem-vindo ao Estúdio LAW!", 3500);
  await delay(3500);

  // 4) splash
  await showSplash();
  await delay(3000);
  await hideSplash();

  // 5) Khan Academy
  await Promise.all([
    loadScript('https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js'),
    loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js').then(()=>{DarkReader.setFetchMethod(fetch);DarkReader.enable();})
  ]);

  // setupMain (automação)
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let body = input instanceof Request ? await input.clone().text() : init?.body;
    if (body?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        const o=JSON.parse(body);
        const d=o.variables.input.durationSeconds;
        o.variables.input.secondsWatched=d;
        o.variables.input.lastSecondWatched=d;
        body=JSON.stringify(o);
        if (input instanceof Request) input=new Request(input,{body}); else init.body=body;
        sendToast("🔓┃Vídeo explorado.",1000);
      } catch{}
    }
    const resp = await originalFetch(input, init);
    try {
      const c=await resp.clone().text();
      const j=JSON.parse(c);
      if (j?.data?.assessmentItem?.item?.itemData) {
        const id=JSON.parse(j.data.assessmentItem.item.itemData);
        if (id.question.content[0]===id.question.content[0].toUpperCase()) {
          id.answerArea={calculator:false,chi2Table:false,periodicTable:false,tTable:false,zTable:false};
          id.question.content=" [[☃ radio 1]]";
          id.question.widgets={"radio 1":{type:"radio",options:{choices:[{content:"Wesley o Brabo",correct:true},{content:"Opção errada 1",correct:false}]}}};
          j.data.assessmentItem.item.itemData=JSON.stringify(id);
          return new Response(JSON.stringify(j),{status:resp.status,statusText:resp.statusText,headers:resp.headers});
        }
      }
    } catch{}
    return resp;
  };

  (async()=>{
    const sel=[`[data-testid="choice-icon__library-choice-icon"]`,`[data-testid="exercise-check-answer"]`,`[data-testid="exercise-next-question"]`,`._1udzurba`,`._awve9b`];
    window.khanwareDominates=true;
    while(window.khanwareDominates){
      sel.forEach(s=>{document.querySelector(s)?.click();const e=document.querySelector(`${s}>div`);if(e?.innerText==="Mostrar resumo")sendToast("🎉┃Exercício concluído!",3000);});
      await delay(800);
    }
  })();

  if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(location.href)) location.href="https://pt.khanacademy.org/";
})();
