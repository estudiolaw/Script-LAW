// ==UserScript==
// @name         Khanware + Estúdio LAW | Painel Realista + Expiração
// @namespace    http://estudiolaw.com/
// @version      3.2.0-LAW
// @description  Painel bonito, senha com hora/data de validade, integração total Khanware by Wesley
// @author       Estúdio LAW (Wesley)
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

// ====================== CONFIGURAÇÃO DO PAINEL/SENHA ======================
const SENHAS = [
  "law2025@premium", "estudiolaw!2025", "wesley@developer", "khanware.pro"
];
const MAX_TENTATIVAS = 3, BLOQUEIO_MINUTOS = 5;
const DATA_EXPIRA = "2025-12-31 23:59"; // UTC (Ano-mes-dia hora:min)

function isExpirado() {
  const agora = new Date();
  const [data, hora] = DATA_EXPIRA.split(" ");
  const [ano, mes, dia] = data.split("-").map(Number);
  const [h, m] = hora.split(":").map(Number);
  const exp = new Date(Date.UTC(ano, mes-1, dia, h, m));
  return agora.getTime() >= exp.getTime();
}

function showPainelSenhaLAW() {
  return new Promise((resolve, reject) => {
    const lockKey = "law_bloq";
    if (localStorage.getItem(lockKey)) {
      const unlock = parseInt(localStorage.getItem(lockKey));
      const falta = Math.ceil((unlock - Date.now())/60000);
      if (Date.now() < unlock) {
        alert(`Acesso bloqueado!\n\nVocê tentou muitas vezes.\nTente novamente em ${falta} minuto(s).`);
        reject("lock");
        return;
      } else {
        localStorage.removeItem(lockKey);
        localStorage.removeItem('law_tentativas');
      }
    }
    if (isExpirado()) {
      document.body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#111827;color:#eee;">
      <h1 style="font-size:2.5em;color:#0894ff;text-shadow:0 0 30px #0894ff52;">Estúdio LAW</h1>
      <p style="font-size:1.3em;">⏰ Acesso expirado<br>Validade: <b>${DATA_EXPIRA.replace(" ","&nbsp;")}</b> (UTC)</p>
      <p style="color:#f43f5e;margin-top:20px;">Contate o suporte para renovar sua licença.</p>
      </div>`;
      reject("expirado");
      return;
    }
    const overlay = document.createElement('div');
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;
      background:radial-gradient(ellipse at 50% 30%, #11203b 70%, #0a1629 100%);
      display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;
      animation:fadeLawIn 0.8s;
    `;
    overlay.innerHTML = `
      <div id="painel-law-main" style="
        background:rgba(19,29,49,0.98);border-radius:22px;box-shadow:0 18px 60px #0894ff33;
        padding:46px 38px;min-width:340px;max-width:95vw;display:flex;flex-direction:column;align-items:center;position:relative;
        border: 1.5px solid #0894ff37;animation:panelLawPop 0.8s;
      ">
        <div style="font-size:2.3em;font-weight:700;color:#0894ff;text-shadow:0 0 20px #0894ff82;margin-bottom:10px;letter-spacing:0.05em;">
          Estúdio <span style="color:#FFF;">LAW</span>
        </div>
        <div style="color:#b9e3ff;margin-bottom:18px;text-align:center;font-size:1.13em;">Acesso Premium<br><span style="font-size:0.86em;color:#57c3ff;">Desenvolvido por Wesley</span></div>
        <div style="margin-bottom:22px;position:relative;width:100%;max-width:350px;">
          <input id="law-senha" type="password" maxlength="64" autocomplete="current-password"
            style="width:100%;padding:17px 52px 17px 48px;border-radius:13px;border:2px solid #274472;
              background:#192a48;color:#fff;font-size:1.12em;outline:none;box-shadow:0 4px 14px #0894ff10;"
            placeholder="Digite sua senha..." autofocus>
          <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#60aaff;font-size:1.25em;">🔒</span>
          <button id="olho-law" type="button" tabindex="-1"
            style="position:absolute;right:13px;top:50%;transform:translateY(-50%);
            background:none;border:none;cursor:pointer;font-size:1.18em;color:#60aaff;">👁️</button>
        </div>
        <button id="entrar-law" style="width:100%;padding:15px 0;border-radius:11px;background:linear-gradient(93deg,#0894ff,#1a6ffb 98%);
          color:#fff;font-weight:600;font-size:1.15em;border:none;cursor:pointer;box-shadow:0 4px 16px #0ea5e930;letter-spacing:0.06em;">
          Entrar
        </button>
        <div id="status-law" style="height:28px;margin:16px 0 0 0;text-align:center;font-size:1.01em;"></div>
        <div style="margin-top:28px;text-align:center;color:#64748b;font-size:0.99em;">
          Validade: ${DATA_EXPIRA.replace(" ","&nbsp;")} UTC<br>Versão 3.2.0 • Estúdio LAW
        </div>
      </div>
    `;
    if (!document.getElementById('law-painel-style')) {
      const style = document.createElement('style');
      style.id = 'law-painel-style';
      style.innerHTML = `
        @keyframes fadeLawIn {from{opacity:0} to{opacity:1}}
        @keyframes panelLawPop {0%{opacity:0;transform:scale(0.85);}70%{opacity:1;transform:scale(1.05);}100%{opacity:1;transform:scale(1);}}
        @keyframes shakePanelLaw {0%,100%{transform:translateX(0);}25%{transform:translateX(-8px);}75%{transform:translateX(8px);}}
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#law-senha');
    const olho = overlay.querySelector('#olho-law');
    let visivel = false;
    olho.onclick = () => {
      visivel = !visivel;
      input.type = visivel ? 'text' : 'password';
      olho.textContent = visivel ? '🙈' : '👁️';
    };
    let tent = parseInt(localStorage.getItem('law_tentativas')) || 0;
    function status(msg, cor) {
      const el = overlay.querySelector('#status-law');
      el.textContent = msg;
      el.style.color = cor||"#b9e3ff";
    }
    async function validarSenha(senha) {
      status('Verificando...', '#38bdf8');
      await new Promise(r => setTimeout(r, 350));
      if (SENHAS.includes(senha)) {
        localStorage.removeItem('law_tentativas');
        status('Acesso liberado!', '#22c55e');
        setTimeout(()=>{overlay.remove();resolve();}, 700);
      } else {
        tent++;
        localStorage.setItem('law_tentativas', tent);
        if (tent >= MAX_TENTATIVAS) {
          localStorage.setItem(lockKey, Date.now()+(BLOQUEIO_MINUTOS*60000));
          status(`Acesso bloqueado (${BLOQUEIO_MINUTOS} min)!`, '#ef4444');
          overlay.querySelector('#painel-law-main').style.animation = 'shakePanelLaw 0.35s';
          setTimeout(()=>{overlay.remove();reject("bloqueado");}, 1400);
        } else {
          status(`Senha incorreta! (${MAX_TENTATIVAS-tent} restantes)`, '#ef4444');
          overlay.querySelector('#painel-law-main').style.animation = 'shakePanelLaw 0.35s';
          setTimeout(()=>overlay.querySelector('#painel-law-main').style.animation='',350);
          input.value = '';
          input.focus();
        }
      }
    }
    overlay.querySelector('#entrar-law').onclick = ()=> {
      if (!input.value) { status('Digite a senha!', '#f59e0b'); return; }
      validarSenha(input.value);
    };
    input.onkeydown = e => { if (e.key === 'Enter') overlay.querySelector('#entrar-law').click(); };
  });
}

/* ============ FLUXO DE EXECUÇÃO ============= */
(async function(){
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌ Khanware Estúdio LAW\n\nExecute no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }
  await showPainelSenhaLAW();
  // ---- SEU SCRIPT DE TAREFAS COMEÇA AQUI ----

  // ---- RESTO DO SEU SCRIPT, MODELO ORIGINAL ----
  // (a partir daqui é exatamente o SEU modelo, só que protegido pelo painel de senha)

  const ver = "V3.1.1";
  let isDev = false;

  const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

  let device = {
      mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
      apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
  };

  /* User */
  let user = {
      username: "Username",
      nickname: "Nickname",
      UID: 0
  }

  let loadedPlugins = [];

  /* Elements */
  const unloader = document.createElement('unloader');
  const dropdownMenu = document.createElement('dropDownMenu');
  const watermark = document.createElement('watermark');
  const statsPanel = document.createElement('statsPanel');
  const splashScreen = document.createElement('splashScreen');

  /* Globals */
  window.features = {
      questionSpoof: true,
      videoSpoof: true,
      showAnswers: false,
      autoAnswer: false,
      customBanner: false,
      nextRecomendation: false,
      repeatQuestion: false,
      minuteFarmer: false,
      rgbLogo: false
  };
  window.featureConfigs = {
      autoAnswerDelay: 3,
      customUsername: "",
      customPfp: ""
  };

  /* Security */
  document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
  document.addEventListener('keydown', (e) => { if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { e.preventDefault(); } });
  console.log(Object.defineProperties(new Error, { toString: {value() {(new Error).stack.includes('toString@') && location.reload();}}, message: {get() {location.reload();}}, }));

  /* Misc Styles */
  document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}" }));
  document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"}));
  document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

  /* Emmiter */
  class EventEmitter{constructor(){this.events={}}on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}};
  const plppdo = new EventEmitter();

  new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true });

  /* Misc Functions */
  window.debug = function(text) { /* QuickFix */}
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const playAudio = url => { const audio = new Audio(url); audio.play(); debug(`🔊 Playing audio from ${url}`); };
  const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); } };

  function sendToast(text, duration=5000, gravity='bottom') { Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast(); debug(text); };

  async function showSplashScreen() { splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;"; splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>'; document.body.appendChild(splashScreen); setTimeout(() => splashScreen.style.opacity = '1', 10);};
  async function hideSplashScreen() { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 1000); };

  async function loadScript(url, label) { return fetch(url).then(response => response.text()).then(script => { loadedPlugins.push(label); eval(script); }); }
  async function loadCss(url) { return new Promise((resolve) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = url; link.onload = () => resolve(); document.head.appendChild(link); }); }

  /* Visual Functions */
  function setupMenu() {
      loadScript(repoPath+'visuals/mainMenu.js', 'mainMenu');
      loadScript(repoPath+'visuals/statusPanel.js', 'statusPanel');
      loadScript(repoPath+'visuals/widgetBot.js', 'widgetBot');
      if(isDev) loadScript(repoPath+'visuals/devTab.js', 'devTab');
  }

  /* Main Functions */ 
  function setupMain(){
      loadScript(repoPath+'functions/questionSpoof.js', 'questionSpoof');
      loadScript(repoPath+'functions/videoSpoof.js', 'videoSpoof');
      loadScript(repoPath+'functions/minuteFarm.js', 'minuteFarm');
      loadScript(repoPath+'functions/spoofUser.js', 'spoofUser');
      loadScript(repoPath+'functions/answerRevealer.js', 'answerRevealer');
      loadScript(repoPath+'functions/rgbLogo.js', 'rgbLogo');
      loadScript(repoPath+'functions/customBanner.js', 'customBanner');
      loadScript(repoPath+'functions/autoAnswer.js', 'autoAnswer');
  }

  /* Inject */
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/"; }
  showSplashScreen();
  loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => { onekoEl = document.getElementById('oneko'); onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')"; onekoEl.style.display = "none"; });
  loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
  loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
  loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
  .then(async () => {
      await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`,{headers:{accept:"*/*","accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7","content-type":"application/json",priority:"u=1, i","sec-ch-ua":'"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"Windows"',"sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","sec-gpc":"1","x-ka-fkey":"1"},referrer:"https://pt.khanacademy.org/profile/me/teacher/kaid_589810246138844031185299/class/6245691961556992",referrerPolicy:"strict-origin-when-cross-origin",body:'{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\"can_do_what_only_admins_can_do\\")\\n    isPublisher: hasPermission(name: \\"can_publish\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\"can_moderate_users\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isFormalTeacher\\n    isK4dStudent\\n    isKmapStudent\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\"can_ban_users\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(\\n      name: \\"can_send_moderator_messages\\"\\n      scope: GLOBAL\\n    )\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    includesKmapDistrictOwnedData\\n    includesK4dDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    hasAccessToAIGuideCompanionMode\\n    hasAccessToAIGuideLearner\\n    hasAccessToAIGuideDistrictAdmin\\n    hasAccessToAIGuideParent\\n    hasAccessToAIGuideTeacher\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    region\\n    userDistrictInfos {\\n      id\\n      isKAD\\n      district {\\n        id\\n        region\\n        __typename\\n      }\\n      __typename\\n    }\\n    schoolAffiliation {\\n      id\\n      location\\n      __typename\\n    }\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}"}',method:"POST",mode:"cors",credentials:"include"})
      .then(async response => { let data = await response.json(); user = { nickname: data.data.user.nickname, username: data.data.user.username, UID: data.data.user.id.slice(-5) }; })
      
      sendToast("🌿 Khanware injetado com sucesso!");
      playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
      await delay(500);
      sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
      if(device.apple) { await delay(500); sendToast(`🪽 Que tal comprar um Samsung?`); }
      loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top') );
      hideSplashScreen();
      setupMenu();
      setupMain();
      console.clear();
  });
})();
