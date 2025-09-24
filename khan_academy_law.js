/* ===== Config ===== */
const ver = "V3.1.2";
let isDev = false;
const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

/* ===== Device ===== */
let device = {
  mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i
    .test(navigator.userAgent),
  apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i
    .test(navigator.userAgent)
};

/* ===== User ===== */
let user = { username: "Username", nickname: "Nickname", UID: 0 };
let loadedPlugins = [];

/* ===== Elements ===== */
const unloader = document.createElement('unloader');
const dropdownMenu = document.createElement('dropDownMenu');
const watermark = document.createElement('watermark');
const statsPanel = document.createElement('statsPanel');
const splashScreen = document.createElement('splashScreen');

/* ===== Globals ===== */
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

/* ===== Security ===== */
document.addEventListener('contextmenu', (e) => {
  if (!window.disableSecurity) e.preventDefault();
});
document.addEventListener('keydown', (e) => {
  if (
    !window.disableSecurity &&
    (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))
  ) {
    e.preventDefault();
  }
});
console.log(
  Object.defineProperties(new Error, {
    toString: {
      value() {
        (new Error).stack.includes('toString@') && location.reload();
      }
    },
    message: {
      get() {
        location.reload();
      }
    }
  })
);

/* ===== Misc Styles ===== */
document.head.appendChild(
  Object.assign(document.createElement("style"), {
    innerHTML: "@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype')}"
  })
);
document.head.appendChild(
  Object.assign(document.createElement('style'), {
    innerHTML: `::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }`
  })
);
document.querySelector("link[rel~='icon']").href =
  'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* ===== EventEmitter ===== */
class EventEmitter {
  constructor() { this.events = {}; }
  on(t, e) {
    if (typeof t === "string") t = [t];
    t.forEach(event => {
      this.events[event] ||= [];
      this.events[event].push(e);
    });
  }
  off(t, e) {
    if (typeof t === "string") t = [t];
    t.forEach(event => {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(fn => fn !== e);
      }
    });
  }
  emit(t, ...args) {
    if (this.events[t]) {
      this.events[t].forEach(fn => fn(...args));
    }
  }
  once(t, e) {
    if (typeof t === "string") t = [t];
    let wrapper = (...args) => {
      e(...args);
      this.off(t, wrapper);
    };
    this.on(t, wrapper);
  }
};
const plppdo = new EventEmitter();
new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') plppdo.emit('domChanged');
  }
}).observe(document.body, { childList: true, subtree: true });

/* ===== Misc Functions ===== */
window.debug = function (text) { /* QuickFix */ }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => {
  const audio = new Audio(url);
  audio.play();
  debug(`🔊 Playing audio from ${url}`);
};
const findAndClickBySelector = selector => {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
    sendToast(`⭕ Pressionando ${selector}...`, 1000);
  }
};
function sendToast(text, duration = 5000, gravity = 'bottom') {
  Toastify({
    text,
    duration,
    gravity,
    position: "center",
    stopOnFocus: true,
    style: { background: "#000000" }
  }).showToast();
  debug(text);
}

/* ===== Intro Animada ===== */
async function showIntro() {
  const introScreen = document.createElement('div');
  introScreen.style.cssText = `
    position: fixed; 
    top: 0; left: 0; 
    width: 100%; height: 100%; 
    background: url('https://i.imgur.com/fQpyJ97.jpeg') no-repeat center center / cover;
    font-family: MuseoSans, sans-serif; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    font-size: 40px; 
    z-index: 99999; 
    opacity: 1; 
    transition: opacity 2s ease-out;
  `;
  introScreen.innerHTML = `
    <div style="animation: fadeIn 2s; color:black;">
      <h1>Andreeezerrr kkkk</h1>
      <p style="font-size: 30px; margin-top: 10px;">
        Transformando seu aprendizado, de maneira inovadora e dinâmica!
      </p>
    </div>
    <style>
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
  `;
  document.body.appendChild(introScreen);
  await delay(3000);
  introScreen.style.opacity = '0';
  setTimeout(() => introScreen.remove(), 2000);
}

/* ===== Splash Screen ===== */
async function showSplashScreen() {
  splashScreen.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background: url("https://i.imgur.com/10YPvrX.jpeg") no-repeat center center / cover;
    display:flex; align-items:center; justify-content:center;
    z-index:9999; opacity:0; transition:opacity 0.5s ease; user-select:none;
    color:white; font-family:MuseoSans,sans-serif; font-size:30px; text-align:center;
  `;
  splashScreen.innerHTML = `<span style="color:white;">KHANWARE</span> <span style="color:#72ff72;">.SPACE</span>`;
  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}
async function hideSplashScreen() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

/* ===== Loaders ===== */
async function loadScript(url, label) {
  return fetch(url)
    .then(response => response.text())
    .then(script => {
      loadedPlugins.push(label);
      eval(script);
    });
}
async function loadCss(url) {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
}

/* ===== Visual Functions ===== */
function setupMenu() {
  loadScript(repoPath + 'visuals/mainMenu.js', 'mainMenu');
  loadScript(repoPath + 'visuals/statusPanel.js', 'statusPanel');
  loadScript(repoPath + 'visuals/widgetBot.js', 'widgetBot');
  if (isDev) loadScript(repoPath + 'visuals/devTab.js', 'devTab');
}

/* ===== Main Functions ===== */
function setupMain() {
  loadScript(repoPath + 'functions/questionSpoof.js', 'questionSpoof');
  loadScript(repoPath + 'functions/videoSpoof.js', 'videoSpoof');
  loadScript(repoPath + 'functions/minuteFarm.js', 'minuteFarm');
  loadScript(repoPath + 'functions/spoofUser.js', 'spoofUser');
  loadScript(repoPath + 'functions/answerRevealer.js', 'answerRevealer');
  loadScript(repoPath + 'functions/rgbLogo.js', 'rgbLogo');
  loadScript(repoPath + 'functions/customBanner.js', 'customBanner');
  loadScript(repoPath + 'functions/autoAnswer.js', 'autoAnswer');
}

/* ===== Inject ===== */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
  window.location.href = "https://pt.khanacademy.org/";
}
showIntro();
showSplashScreen();

loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs')
  .then(() => {
    onekoEl = document.getElementById('oneko');
    onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
    onekoEl.style.display = "none";
  });

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin')
  .then(() => {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
  });

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
  .then(async () => {
    fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile", {
      referrer: "https://pt.khanacademy.org/profile/me",
      body: '{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) {...}}"}',
      method: "POST",
      mode: "cors",
      credentials: "include"
    }).then(async response => {
      let data = await response.json();
      user = {
        nickname: data.data.user.nickname,
        username: data.data.user.username,
        UID: data.data.user.id.slice(-5)
      };
    });

    sendToast("🌿 Khanware injetado com sucesso!");
    playAudio("https://cdn.discordapp.com/attachments/1158456648323575948/1420518238147711047/WhatsApp_Ptt_2025-09-24_at_18.11.19.ogg?ex=68d5b033&is=68d45eb3&hm=4c9e37fa2be24ee380d2648458117d5346a6b4e89c0046a6cfc006ca7c43455d&");
    await delay(500);
    sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
    if (device.apple) {
      await delay(500);
      sendToast("🪽 Que tal comprar um Samsung?");
    }
    loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top'));
    hideSplashScreen();
    setupMenu();
    setupMain();
    console.clear();
  });
