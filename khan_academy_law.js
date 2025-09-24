/* ===========================
   Khanware - Versão Melhorada
   =========================== */

const ver = "V3.2.0";
const isDev = false;
const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

/* ===== Device Detection ===== */
const ua = navigator.userAgent;
const device = {
  mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(ua),
  apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua)
};

/* ===== User ===== */
let user = {
  username: "Username",
  nickname: "Nickname",
  UID: 0
};
const loadedPlugins = [];

/* ===== Elements ===== */
const unloader = document.createElement("unloader");
const dropdownMenu = document.createElement("dropDownMenu");
const watermark = document.createElement("watermark");
const statsPanel = document.createElement("statsPanel");
const splashScreen = document.createElement("splashScreen");

/* ===== Global Configs ===== */
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
document.addEventListener("contextmenu", e => {
  if (!window.disableSecurity) e.preventDefault();
});
document.addEventListener("keydown", e => {
  if (!window.disableSecurity &&
      (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)))) {
    e.preventDefault();
  }
});

/* ===== Styles ===== */
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @font-face {
    font-family: 'MuseoSans';
    src: url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #555; }
`;
document.head.appendChild(styleTag);

const favicon = document.querySelector("link[rel~='icon']");
if (favicon) {
  favicon.href = "https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png";
}

/* ===== EventEmitter ===== */
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, callback) { (this.events[event] ??= []).push(callback); }
  off(event, callback) { this.events[event] = (this.events[event] || []).filter(fn => fn !== callback); }
  emit(event, ...args) { (this.events[event] || []).forEach(fn => fn(...args)); }
  once(event, callback) {
    const fn = (...args) => { callback(...args); this.off(event, fn); };
    this.on(event, fn);
  }
}
const emitter = new EventEmitter();

/* ===== Observe DOM Changes ===== */
new MutationObserver(() => emitter.emit("domChanged"))
  .observe(document.body, { childList: true, subtree: true });

/* ===== Utils ===== */
const debug = text => { if (isDev) console.log("[DEBUG]", text); };
const delay = ms => new Promise(res => setTimeout(res, ms));
const playAudio = url => {
  const audio = new Audio(url);
  audio.play().catch(() => debug("Erro ao reproduzir áudio"));
  debug(`🔊 Playing audio from ${url}`);
};
const findAndClickBySelector = selector => {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
    sendToast(`⭕ Pressionando ${selector}...`, 1000);
  }
};

function sendToast(text, duration = 5000, gravity = "bottom") {
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

/* ===== Intro & Splash ===== */
async function showIntro() {
  const introScreen = document.createElement("div");
  introScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:#0d3b66;color:white;font-family:MuseoSans,sans-serif;
    display:flex;align-items:center;justify-content:center;
    text-align:center;font-size:40px;z-index:99999;opacity:1;
    transition:opacity 2s ease-out;
  `;
  introScreen.innerHTML = `
    <div style="animation:fadeIn 2s;">
      <h1>Andreeezerrr kskskks</h1>
      <p style="font-size:30px;margin-top:10px;">
        Transformando seu aprendizado, de maneira inovadora e dinâmica!
      </p>
    </div>
    <style>@keyframes fadeIn { from {opacity:0;} to {opacity:1;} }</style>
  `;
  document.body.appendChild(introScreen);
  await delay(3000);
  introScreen.style.opacity = "0";
  setTimeout(() => introScreen.remove(), 2000);
}

async function showSplashScreen() {
  splashScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;background:#000;
    display:flex;align-items:center;justify-content:center;z-index:9999;
    opacity:0;transition:opacity .5s ease;user-select:none;
    color:white;font-family:MuseoSans,sans-serif;font-size:30px;
  `;
  splashScreen.innerHTML = `<span style="color:white;">KHANWARE</span><span style="color:#72ff72;">.SPACE</span>`;
  document.body.appendChild(splashScreen);
  setTimeout(() => (splashScreen.style.opacity = "1"), 10);
}
async function hideSplashScreen() {
  splashScreen.style.opacity = "0";
  setTimeout(() => splashScreen.remove(), 1000);
}

/* ===== Script Loader ===== */
async function loadScript(url, label) {
  try {
    const response = await fetch(url);
    const script = await response.text();
    if (script.includes("function") || script.includes("class")) {
      eval(script);
      loadedPlugins.push(label);
    }
  } catch (err) {
    console.error(`Erro ao carregar ${label}:`, err);
  }
}
async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

/* ===== Visual Functions ===== */
function setupMenu() {
  loadScript(repoPath + "visuals/mainMenu.js", "mainMenu");
  loadScript(repoPath + "visuals/statusPanel.js", "statusPanel");
  loadScript(repoPath + "visuals/widgetBot.js", "widgetBot");
  if (isDev) loadScript(repoPath + "visuals/devTab.js", "devTab");
}

/* ===== Main Functions ===== */
function setupMain() {
  loadScript(repoPath + "functions/questionSpoof.js", "questionSpoof");
  loadScript(repoPath + "functions/videoSpoof.js", "videoSpoof");
  loadScript(repoPath + "functions/minuteFarm.js", "minuteFarm");
  loadScript(repoPath + "functions/spoofUser.js", "spoofUser");
  loadScript(repoPath + "functions/answerRevealer.js", "answerRevealer");
  loadScript(repoPath + "functions/rgbLogo.js", "rgbLogo");
  loadScript(repoPath + "functions/customBanner.js", "customBanner");
  loadScript(repoPath + "functions/autoAnswer.js", "autoAnswer");
}

/* ===== Inject ===== */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
  window.location.href = "https://pt.khanacademy.org/";
}

(async () => {
  await showIntro();
  await showSplashScreen();

  /* Plugins externos */
  await loadScript("https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js", "onekoJs");
  const onekoEl = document.getElementById("oneko");
  if (onekoEl) {
    onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
    onekoEl.style.display = "none";
  }

  await loadScript("https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js", "darkReaderPlugin");
  DarkReader.setFetchMethod(window.fetch);
  DarkReader.enable();

  await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
  await loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "toastifyPlugin");

  /* Carregar perfil */
  try {
    const response = await fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile", {
      referrer: "https://pt.khanacademy.org/profile/me",
      body: '{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) { user(kaid: $kaid, username: $username) { id nickname username } }"}',
      method: "POST",
      mode: "cors",
      credentials: "include"
    });
    const data = await response.json();
    user = {
      nickname: data.data.user.nickname,
      username: data.data.user.username,
      UID: data.data.user.id.slice(-5)
    };
  } catch {
    debug("Não foi possível carregar o perfil do usuário.");
  }

  sendToast("🌿 Khanware injetado com sucesso!");
  playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav");

  await delay(500);
  sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
  if (device.apple) {
    await delay(500);
    sendToast(`🪽 Que tal comprar um Samsung?`);
  }

  loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, "top"));

  hideSplashScreen();
  setupMenu();
  setupMain();

  console.clear();
})();
