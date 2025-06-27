// Script LAW personalizado completo com painel inferior e sem botão do Discord

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
document.addEventListener('keydown', (e) => {
  if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) {
    e.preventDefault();
  }
});
console.log(Object.defineProperties(new Error, {
  toString: {
    value() {
      (new Error).stack.includes('toString@') && location.reload();
    }
  },
  message: {
    get() {
      location.reload();
    }
  },
}));

/* Misc Styles */
document.head.appendChild(Object.assign(document.createElement("style"),{
  innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}"
}));
document.head.appendChild(Object.assign(document.createElement('style'),{
  innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"
}));
document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Emmiter */
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(t,e) {"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}
  off(t,e) {"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}
  emit(t,...e) {this.events[t]&&this.events[t].forEach(t=>{t(...e)})}
  once(t,e) {"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}
};
const plppdo = new EventEmitter();
new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList)
    if (mutation.type === 'childList')
      plppdo.emit('domChanged');
}).observe(document.body, { childList: true, subtree: true });

/* Misc Functions */
window.debug = function(text) {}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); debug(`🔊 Playing audio from ${url}`); };
const findAndClickBySelector = selector => {
  const element = document.querySelector(selector);
  if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); }
};

function sendToast(text, duration=5000, gravity='bottom') {
  Toastify({ text, duration, gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast();
  debug(text);
};

/* LAW Panel */
function removeDiscordIcon() {
  const remove = () => {
    const discordIframe = document.querySelector("iframe[src*='discord.com']");
    if (discordIframe) {
      discordIframe.parentElement?.remove();
    }
  };
  remove();
  new MutationObserver(remove).observe(document.body, { childList: true, subtree: true });
}
function createLawPanel() {
  const panel = document.createElement("div");
  panel.id = "law-panel";
  panel.style.cssText = `position: fixed; bottom: 10px; left: 10px; background: rgba(0, 0, 0, 0.75); color: #72ff72; font-family: monospace; padding: 6px 12px; border-radius: 8px; font-size: 13px; z-index: 9999; box-shadow: 0 0 10px #000; user-select: none;`;
  let fps = 144, ping = 259;
  const updateTime = () => {
    const now = new Date().toLocaleTimeString();
    panel.textContent = `LAW | ${fps}fps | ${ping}ms | ${now}`;
  };
  updateTime();
  setInterval(updateTime, 1000);
  document.body.appendChild(panel);
}

/* Load Visuals + Funcs */
function setupMenu() {
  loadScript(repoPath+'visuals/mainMenu.js', 'mainMenu');
  loadScript(repoPath+'visuals/statusPanel.js', 'statusPanel');
  loadScript(repoPath+'visuals/widgetBot.js', 'widgetBot');
  if(isDev) loadScript(repoPath+'visuals/devTab.js', 'devTab');
}
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
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
  window.location.href = "https://pt.khanacademy.org/";
}

showSplashScreen();

loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => {
  onekoEl = document.getElementById('oneko');
  onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
  onekoEl.style.display = "none";
});
loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {
  sendToast("🌿 Khanware injetado com sucesso!");
  playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
  await delay(500);
  sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
  if(device.apple) { await delay(500); sendToast(`🪽 Que tal comprar um Samsung?`); }
  loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top') );
  hideSplashScreen();
  setupMenu();
  setupMain();
  removeDiscordIcon();
  createLawPanel();
  console.clear();
});
