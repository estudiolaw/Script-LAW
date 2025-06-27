// ==UserScript==
// @name         Estúdio LAW | AutoScript V3.1.1
// @namespace    https://estudiolaw.dev/
// @version      3.1.1
// @description  Script desenvolvido por Wesley para automações na Khan Academy.
// @author       Wesley
// @match        https://*.khanacademy.org/*
// @icon         https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png
// @grant        none
// ==/UserScript==

const ver = "V3.1.1";
let isDev = false;

// TROQUE AQUI SE QUISER USAR SEU REPOSITÓRIO:
const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

let user = {
  username: "Username",
  nickname: "Nickname",
  UID: 0
};

let loadedPlugins = [];

/* Segurança */
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

/* Ferramentas */
window.debug = function (text) {};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => {
  const audio = new Audio(url);
  audio.play();
};
const sendToast = (text, duration = 5000, gravity = 'bottom') => {
  Toastify({
    text: text,
    duration: duration,
    gravity: gravity,
    position: "center",
    stopOnFocus: true,
    style: { background: "#000000" }
  }).showToast();
};

/* Splash Estúdio LAW */
const splashScreen = document.createElement('splashScreen');

async function showEstudioLawSplash() {
  splashScreen.style.cssText = `
    position:fixed;
    top:0; left:0; width:100%; height:100%;
    z-index:9999;
    display:flex;
    align-items:center;
    justify-content:center;
    background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
    background-size: 400% 400%;
    animation: backgroundFlow 10s ease infinite;
    user-select:none;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  splashScreen.innerHTML = `
    <div id="estudio-law-text" style="
      font-size: 3em;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
      animation: glowText 2s ease-in-out infinite alternate,
                 fadeSlideIn 1.5s ease forwards;
      opacity: 0;
      transform: translateY(30px);
    ">
      Estúdio <span style="color:#00aaff;">LAW</span>
    </div>
  `;

  const style = document.createElement('style');
  style.id = 'estudio-law-style';
  style.innerHTML = `
    @keyframes backgroundFlow {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }

    @keyframes glowText {
      from { text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc; }
      to { text-shadow: 0 0 20px #00ccff, 0 0 30px #00aaff; }
    }

    @keyframes fadeSlideIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  if (!document.getElementById('estudio-law-style')) {
    document.head.appendChild(style);
  }

  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideEstudioLawSplash() {
  splashScreen.style.transition = 'opacity 0.8s ease';
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

/* Loader de recursos */
async function loadScript(url, label) {
  return fetch(url).then(response => response.text()).then(script => {
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

/* Execução principal */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert("❌ Script Estúdio LAW só funciona na Khan Academy!\nAcesse: https://pt.khanacademy.org/");
  window.location.href = "https://pt.khanacademy.org/";
}

(async () => {
  await showEstudioLawSplash();

  await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify');

  // Visuals (menu, painel, etc)
  await loadScript(repoPath + 'visuals/mainMenu.js',     'mainMenu');
  await loadScript(repoPath + 'visuals/statusPanel.js',  'statusPanel');
  await loadScript(repoPath + 'visuals/widgetBot.js',    'widgetBot');
  if (isDev) await loadScript(repoPath + 'visuals/devTab.js', 'devTab');

  // Funções de tarefa
  await loadScript(repoPath + 'functions/questionSpoof.js',   'questionSpoof');
  await loadScript(repoPath + 'functions/videoSpoof.js',      'videoSpoof');
  await loadScript(repoPath + 'functions/minuteFarm.js',      'minuteFarm');
  await loadScript(repoPath + 'functions/answerRevealer.js',  'answerRevealer');
  await loadScript(repoPath + 'functions/spoofUser.js',       'spoofUser');
  await loadScript(repoPath + 'functions/rgbLogo.js',         'rgbLogo');
  await loadScript(repoPath + 'functions/customBanner.js',    'customBanner');
  await loadScript(repoPath + 'functions/autoAnswer.js',      'autoAnswer');

  sendToast("✨ Estúdio LAW ativado!");
  await delay(500);
  sendToast("🚀 Desenvolvido por Estúdio LAW | Wesley", 6000, "top");

  playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

  await delay(1000);
  await hideEstudioLawSplash();
})();
