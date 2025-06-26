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
const VALID_UNTIL = "2025-12-31";
const PASSWORDS = [
  "law2025@1","khanlaw!2","stud1oLAW","wesleyx2025","projetoblue",
  "lawaccess23","segredoLAW","unlockkhan","estudiopass","lawpremium"
];
function showAnimatedPasswordPanel() {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const validDate = new Date(VALID_UNTIL + "T23:59:59");
    if (today > validDate) {
      alert("Acesso expirado! Procure o Estúdio LAW.");
      reject("Expirado");
      return;
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
      <div style="margin-top:10px;color:#8bb">Validade: até ${VALID_UNTIL.split("-").reverse().join("/")}</div>
      <div id="estudiolaw-pass-err" style="color:#ff6a6a;margin:8px 0 0 0;font-size:1em;min-height:22px"></div>
      <div style="margin-top:16px;font-size:0.9em;color:#59b;opacity:0.8;letter-spacing:0.01em;">
        Feito por Wesley • Estúdio LAW
      </div>
    `;
    overlay.appendChild(panel);
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
      if (PASSWORDS.includes(pass)) {
        cleanup();
        resolve();
      } else {
        document.getElementById("estudiolaw-pass-err").textContent = "Senha incorreta!";
      }
    };
    document.getElementById("estudiolaw-passinput").onkeydown = (e) => {
      if (e.key === "Enter") document.getElementById("estudiolaw-passok").click();
    };
  });
}

/* ==== SCRIPT KHANWARE ORIGINAL COM INJEÇÃO ==== */
(async function(){
  await showAnimatedPasswordPanel();

  const ver = "V3.1.1";
  let isDev = false;
  const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;
  let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
  };
  let user = { username: "Username", nickname: "Nickname", UID: 0 };
  let loadedPlugins = [];

  const splashScreen = document.createElement('div');
  function sendToast(text, duration = 5000, gravity = 'bottom') {
    Toastify({ text, duration, gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast();
  }
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

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const loadScript = async (url, label) => fetch(url).then(r => r.text()).then(script => { loadedPlugins.push(label); eval(script); });
  const loadCss = async url => new Promise(res => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = url; link.onload = res; document.head.appendChild(link); });

  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌ Você precisa executar o Khanware no site da Khan Academy!");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }

  showSplashScreen();

  await loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs');
  await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReader');
  DarkReader.setFetchMethod(window.fetch); DarkReader.enable();
  await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify');

  try {
    const response = await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: '{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile { user { username nickname id } }"}' });
    const data = await response.json();
    user = { username: data.data.user.username, nickname: data.data.user.nickname, UID: data.data.user.id.slice(-5) };
  } catch (e) {}

  sendToast("🌿 Khanware injetado com sucesso!");
  const audio = new Audio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
  audio.play();

  await delay(500);
  sendToast(`⭐ Bem-vindo(a) de volta: ${user.nickname}`);
  if (device.apple) await delay(500), sendToast(`🪽 Que tal comprar um Samsung?`);

  loadedPlugins.forEach(p => sendToast(`🪝 ${p} carregado!`, 2000, 'top'));

  hideSplashScreen();

  // Aqui carregam os scripts originais (NÃO EDITAR)
  loadScript(repoPath + 'functions/questionSpoof.js', 'questionSpoof');
  loadScript(repoPath + 'functions/videoSpoof.js', 'videoSpoof');
  loadScript(repoPath + 'functions/minuteFarm.js', 'minuteFarm');
  loadScript(repoPath + 'functions/spoofUser.js', 'spoofUser');
  loadScript(repoPath + 'functions/answerRevealer.js', 'answerRevealer');
  loadScript(repoPath + 'functions/rgbLogo.js', 'rgbLogo');
  loadScript(repoPath + 'functions/customBanner.js', 'customBanner');
  loadScript(repoPath + 'functions/autoAnswer.js', 'autoAnswer');

  console.clear();
})();
