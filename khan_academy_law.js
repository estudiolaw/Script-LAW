// ==UserScript==
// @name         Khanware + Estúdio LAW Painel Moderno + Comemoração + Tarefas (Completo)
// @namespace    http://estudiolaw.com/
// @version      3.1.1-PREMIUM
// @description  Script para automatizar tarefas no Khan Academy, painel de senha moderno, comemoração animada, splash, tudo responsivo!
// @author       Estúdio LAW, Niximkk, adaptado por Copilot Chat Assistant
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

/* ================== PAINEL DE SENHA MODERNO + OLHINHO ================== */
const SENHAS = [
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
];
let tentativas = 0;
const maxTentativas = 3;

function showPasswordPanel() {
  return new Promise((resolve, reject) => {
    const overlay = document.createElement('-index:2147483647;
      background:rgba(20,29,39,0.97);display:flex;align-items:center;justify-content:center;
      font-family:'Segoe UI',sans-serif;animation:fadeInPanel 0.7s;
    `;
    overlay.innerHTML = `
      <div id="law-panel-main" style="background:#161f2f;border-radius:18px;padding:38px 32px;min-width:330px;max-width:92vw;box-shadow:0 12px 32px #0008;display:flex;flex-direction:column;align-items:center;animation:zoomInPanel 0.8s;">
        <div style="font-size:2.2em;font-weight:700;color:#0ea5e9;text-align:center;margin-bottom:10px;letter-spacing:0.05em;">Estúdio LAW</div>
        <div style="color:#b9e3ff;margin-bottom:26px;text-align:center;font-size:1.;">Painel de Autenticação Premium</div>
        <div style="margin-bottom:18px;position:relative;width:100%;">
          <input id="law-password-input" type="password" maxlength="64" autocomplete="current-password"
            style="width:100%;padding:15px 44px 15px 44px;border-radius:10px;border:2px solid #334155;background:#232e44;color:#fff;font-size:1.08em;" placeholder="Digite a senha..." autofocus>
          <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#0ea5e9;font-size:1.25em;">🔒</span>
          <button id="toggle-password-visibility" type="button" tabindex="-1"
            style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1.15em;color:#7dd3fc;">👁️</button>
        </div>
        <button id="law-password-submit" style="width:100%;padding:14px 0;border-radius:10px;background:linear-gradient(90deg,#0ea5e9,#2563eb);color:#fff;font-weight:600;font-size:1.13em;border:none;cursor:pointer;box-shadow:0 4px 16px #0ea5e940;">Entrar</button>
        <div id="law-password-status" style="height:22px;margin:14px 0 0 0;text-align:center;font-size:0.98em;"></div>
        <div style="margin-top:28px;text-align:center;color:#64748b;font-size:0.93em;">Versão 3.1.1 • Estúdio LAW</div>
      </div>
    `;
    document.body.appendChild(overlay);

    if (!document.getElementById('law-panel-animations')) {
      const style = document.createElement('style');
      style.id = 'law-panel-animations';
      style.textContent = `
        @keyframes fadeInPanel {from{opacity:0} to{opacity:1}}
        @keyframes zoomInPanel {0%{opacity:0;transform:scale(0.85);}70%{opacity:1;transform:scale(1.08);}100%{opacity:1;transform:scale(1);}}
        @keyframes shakePanel {0%,100%{transform:translateX(0);}25%{transform:translateX(-8px);}75%{transform:translateX(8px);}}
      `;
      document.head.appendChild(style);
    }
    const input = overlay.querySelector('#law-password-input');
    const toggleBtn = overlay.querySelector('#toggle-password-visibility');
    let isVisible = false;
    toggleBtn.onclick = function() {
      isVisible = !isVisible;
      input.type = isVisible ? 'text' : 'password';
      toggleBtn.textContent = isVisible ? '🙈' : '👁️';
    };
    function showStatus(msg, color) {
      const el = overlay.querySelector('#law-password-status');
      el.textContent = msg;
      el.style.color = color||"#e0e6ed";
    }
    async function validatePassword(password) {
      showStatus('Verificando...', '#06b6d4');
      await new Promise(r => setTimeout(r, 400));
      if (SENHAS.includes(password)) {
        showStatus('Acesso liberado!', '#10b981');
        setTimeout(() => { overlay.remove(); resolve(); }, 700);
      } else {
        tentativas++;
        if (tentativas >= maxTentativas) {
          showStatus(`Acesso bloqueado!`, '#ef4444');
          overlay.querySelector('#law-panel-main').style.animation = 'shakePanel 0.35s';
          setTimeout(()=>{overlay.remove();reject("blocked");}, 1300);
        } else {
          showStatus(`Senha incorreta! (${maxTentativas-tentativas} restantes)`, '#ef4444');
          overlay.querySelector('#law-panel-main').style.animation = 'shakePanel 0.35s';
          setTimeout(()=>overlay.querySelector('#law-panel-main').style.animation='',400);
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

/* ================== ANIMAÇÃO DE COMEMORAÇÃO ================== */
function showCelebration() {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;
      background:rgba(10,20,40,0.98);display:flex;align-items:center;justify-content:center;animation:fadeInPanel 0.7s;
    `;
    overlay.innerHTML = `
      <div style="background:rgba(22,31,47,0.99);21em;text-align:center;">Acesso concedido ao Khanware + Estúdio LAW!</div>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.8s';
      setTimeout(()=>{overlay.remove(); resolve();}, 900);
    }, 2100);
  });
}

/* ================== SPLASH ANIMADO ================== */
const splashScreen = document.createElement('splashScreen');
async function showSplashScreen() {
  splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;";
  splashScreen.innerHTML = '<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>';
  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}
async function hideSplashScreen() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

/* ================== RESTO DO SCRIPT (TAREFAS) ================== */
/* ... (Seu script original começa aqui, igual ao último que você mandou) ... */

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

/* INJECT: Fluxo protegido por senha, comemoração, splash e tudo mais */
(async function(){
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }
  await showPasswordPanel();   // PAINEL DE SENHA
  await showCelebration();     // COMEMORAÇÃO
  await showSplashScreen();    // SPLASH ANIMADO

  // --- Resto igual ao seu original ---
  loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => { onekoEl = document.getElementById('oneko'); onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')"; onekoEl.style.display = "none"; });
  loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
  loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
  loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
  .then(async () => {
      await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`,
        {headers:{accept:"*/*","accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7","content-type":"application/json",priority:"u=1, i"},
        body:'{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    username\\n    nickname\\n    __typename\\n  }\\n}"}',
        method:"POST",mode:"cors",credentials:"include"})
      .then(async response => { let data = await response.json(); user = { nickname: data.data.user.nickname, username: data.data.user.username, UID: data.data.user.id.slice(-5) }; });
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
