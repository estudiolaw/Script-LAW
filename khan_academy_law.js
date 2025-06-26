// ==UserScript==
// @name         Khanware + Estúdio LAW Password Panel
// @namespace    http://estudiolaw.com/
// @version      3.1.1-ESTUDIO-LAW
// @description  Script original Khanware com painel de senha animado (10 senhas), fundo dinâmico, sem perder nenhuma função original. Feito por Wesley/Estúdio LAW.
// @author       Wesley (Estúdio LAW), Niximkk
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

/* ==== PAINEL DE SENHA ANIMADO ESTÚDIO LAW ==== */
// Agora cada senha tem sua validade individual, fácil de editar!
const PASSWORDS = [
  { senha: "law2025@1",      validade: "2025-12-31" },
  { senha: "khanlaw!2",      validade: "2025-12-31" },
  { senha: "stud1oLAW",      validade: "2026-01-05" },
  { senha: "wesleyx2025",    validade: "2026-02-20" },
  { senha: "projetoblue",    validade: "2025-09-30" },
  { senha: "lawaccess23",    validade: "2025-10-31" },
  { senha: "segredoLAW",     validade: "2025-11-15" },
  { senha: "unlockkhan",     validade: "2025-12-01" },
  { senha: "estudiopass",    validade: "2025-12-15" },
  { senha: "lawpremium",     validade: "2025-12-20" }
];

function showAnimatedPasswordPanel() {
  return new Promise((resolve, reject) => {
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = "estudiolaw-password-overlay";
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
      background:linear-gradient(-45deg,#1e3c72,#2a5298,#0f2027,#232526,#1e3c72);
      background-size:400% 400%;animation:lawBgFlow 7s ease-in-out infinite alternate;
      display:flex;align-items:center;justify-content:center;
    `;
    // Painel
    const panel = document.createElement('div');
    panel.style = `
      background:rgba(18,43,70,0.93);
      box-shadow: 0 8px 32px 0 #000a,0 0 0 2px #00aaff44;
      border-radius: 18px;
      padding: 40px 36px 26px 36px;
      text-align:center;
      min-width:340px;max-width:90vw;
      font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
      animation: fadeSlideIn 1.1s cubic-bezier(.4,0,.2,1);
      backdrop-filter: blur(4px);
      border: 1.8px solid #00aaff88;
    `;
    // Maior validade para exibir no painel
    const maxValidDate = PASSWORDS.map(p=>p.validade).sort().reverse()[0];
    panel.innerHTML = `
      <div style="font-size:2.1em;font-weight:bold;color:#fff;text-shadow:0 0 8px #00aaff77;">
        Estúdio <span style="color:#00aaff;">LAW</span>
      </div>
      <div style="margin:18px 0 8px 0;color:#bbd;letter-spacing:0.02em;">Insira a senha para continuar:</div>
      <input id="estudiolaw-passinput" type="password" maxlength="64"
        style="width:90%;padding:10px 12px;font-size:1.1em;border-radius:7px;border:1.2px solid #00aaff;outline:none;margin-bottom:15px;box-shadow:0 0 0 2px #00aaff22;" autofocus autocomplete="current-password" />
      <br>
      <button id="estudiolaw-passok" style="
        background:linear-gradient(90deg,#00aaff,#0077cc);color:#fff;font-weight:bold;
        border:none;border-radius:6px;padding:10px 38px;font-size:1.1em;cursor:pointer;box-shadow:0 1px 5px #00aaff44;
        transition:filter .15s;
      ">Entrar</button>
      <div style="margin-top:10px;color:#8bb">Validade máxima: até ${maxValidDate.split("-").reverse().join("/")}</div>
      <div id="estudiolaw-pass-err" style="color:#ff6a6a;margin:8px 0 0 0;font-size:1em;min-height:22px"></div>
      <div style="margin-top:16px;font-size:0.9em;color:#59b;opacity:0.8;letter-spacing:0.01em;">
        Feito por Wesley • Estúdio LAW
      </div>
    `;
    overlay.appendChild(panel);
    // Animação de fundo
    if (!document.getElementById('estudiolaw-pw-style')) {
      const style = document.createElement('style');
      style.id = 'estudiolaw-pw-style';
      style.innerHTML = `
        @keyframes lawBgFlow {
          0% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
          100% {background-position:0% 50%;}
        }
        @keyframes fadeSlideIn {
          from {opacity:0;transform:translateY(40px);}
          to {opacity:1;transform:translateY(0);}
        }
        #estudiolaw-password-overlay input:focus {
          border-color: #00ccff;
          box-shadow: 0 0 8px #00aaff55;
        }
        #estudiolaw-password-overlay button:hover {
          filter: brightness(1.09) saturate(1.13);
        }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);

    function cleanup() { overlay.remove(); }

    document.getElementById("estudiolaw-passok").onclick = () => {
      const pass = document.getElementById("estudiolaw-passinput").value;
      const found = PASSWORDS.find(p => p.senha === pass);
      if (found) {
        // Checa validade individual
        const hoje = new Date();
        const validDate = new Date(found.validade + "T23:59:59");
        if (hoje <= validDate) {
          cleanup();
          resolve();
        } else {
          document.getElementById("estudiolaw-pass-err").textContent = "Senha expirada!";
        }
      } else {
        document.getElementById("estudiolaw-pass-err").textContent = "Senha incorreta!";
      }
    };
    document.getElementById("estudiolaw-passinput").onkeydown = (e) => {
      if (e.key === "Enter") document.getElementById("estudiolaw-passok").click();
    };
  });
}

/* ==== SCRIPT KHANWARE ORIGINAL (NÃO ALTERAR FLUXO) ==== */
(async function(){
  // Mostra a tela de senha antes de executar o script original
  await showAnimatedPasswordPanel();

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
  window.debug = function(text) { /* QuickFix */ }
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
