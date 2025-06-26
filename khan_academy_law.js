// ==UserScript==
// @name         Estúdio LAW Khanware Injector
// @namespace    http://estudiolaw.com/
// @version      1.0.0
// @description  Script aprimorado para Khan Academy com interface moderna Estúdio LAW, painel de senha, animações e funções extras. Feito por Wesley.
// @author       Wesley (Estúdio LAW)
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

/*
███████╗███████╗████████╗██╗   ██╗██████╗ ██╗██╗   ██╗     ██╗      █████╗ ██╗    ██╗
██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║╚██╗ ██╔╝     ██║     ██╔══██╗██║    ██║
█████╗  ███████╗   ██║   ██║   ██║██████╔╝██║ ╚████╔╝█████╗██║     ███████║██║ █╗ ██║
██╔══╝  ╚════██║   ██║   ██║   ██║██╔═══╝ ██║  ╚██╔╝ ╚════╝██║     ██╔══██║██║███╗██║
███████╗███████║   ██║   ╚██████╔╝██║     ██║   ██║        ███████╗██║  ██║╚███╔███╔╝
╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝   ╚═╝        ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝
                        Feito por Wesley • Estúdio LAW (escondido)
*/

// ----------------- Splash Screen Estúdio LAW -----------------
const splashScreen = document.createElement('estudiolaw-splash');
let _splashAppended = false;
async function showEstudioLawSplash() {
  splashScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;
    display:flex;align-items:center;justify-content:center;
    background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
    background-size: 400% 400%;
    animation: backgroundFlow 10s ease infinite;
    user-select:none;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    opacity:0;transition:opacity 0.8s cubic-bezier(.4,0,.2,1);
  `;
  splashScreen.innerHTML = `
    <div id="estudio-law-text" style="
      font-size: 3em;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
      animation: glowText 2s ease-in-out infinite alternate, fadeSlideIn 1.5s cubic-bezier(.4,0,.2,1) forwards;
      opacity: 0;
      transform: translateY(30px);
    ">
      Estúdio <span style="color:#00aaff;">LAW</span>
    </div>
  `;
  if (!document.getElementById('estudio-law-style')) {
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
        to { opacity: 1; transform: translateY(0);}
      }
    `;
    document.head.appendChild(style);
  }
  if (!_splashAppended) {
    document.body.appendChild(splashScreen);
    _splashAppended = true;
  }
  setTimeout(() => splashScreen.style.opacity = '1', 30);
}
async function hideEstudioLawSplash() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 900);
}

// ----------------- Painel de Senha (com data de expiração) -----------------
const PASSWORD = "SENHA_FORTE_AQUI"; // Coloque sua senha
const VALID_UNTIL = "2025-12-31";    // AAAA-MM-DD

function showPasswordPanel() {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const validDate = new Date(VALID_UNTIL + "T23:59:59");
    if (today > validDate) {
      alert("Acesso expirado! Procure o Estúdio LAW.");
      reject("Expirado");
      return;
    }
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = "estudiolaw-password-overlay";
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
      background:rgba(10,25,40,0.95);display:flex;align-items:center;justify-content:center;
    `;
    // Painel
    const panel = document.createElement('div');
    panel.style = `
      background: linear-gradient(135deg, #112346 60%, #1d3870 100%);
      box-shadow: 0 8px 32px 0 #0009;
      border-radius: 18px;
      padding: 42px 36px 28px 36px;
      text-align:center;
      min-width:340px;max-width:90vw;
      font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
      animation: fadeSlideIn 1s cubic-bezier(.4,0,.2,1);
    `;
    panel.innerHTML = `
      <div style="font-size:2.1em;font-weight:bold;color:#fff;text-shadow:0 0 8px #00aaff77;">Estúdio <span style="color:#00aaff;">LAW</span></div>
      <div style="margin:18px 0 8px 0;color:#9ad">Insira a senha para continuar:</div>
      <input id="estudiolaw-passinput" type="password" maxlength="64"
        style="width:90%;padding:10px 12px;font-size:1.1em;border-radius:6px;border:1px solid #0077cc;outline:none;margin-bottom:12px;" autofocus />
      <br>
      <button id="estudiolaw-passok" style="
        background:linear-gradient(90deg,#00aaff,#0077cc);color:#fff;font-weight:bold;
        border:none;border-radius:5px;padding:10px 34px;font-size:1.1em;cursor:pointer;box-shadow:0 1px 5px #00aaff44;
        transition:filter .15s;
      ">Entrar</button>
      <div style="margin-top:10px;color:#8bb">Validade: até ${VALID_UNTIL.split("-").reverse().join("/")}</div>
      <div id="estudiolaw-pass-err" style="color:#ff6a6a;margin:6px 0 0 0;font-size:1em;min-height:18px"></div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function cleanup() { overlay.remove(); }

    document.getElementById("estudiolaw-passok").onclick = () => {
      const pass = document.getElementById("estudiolaw-passinput").value;
      if (pass === PASSWORD) {
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

// ----------------- Delay Util -----------------
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ----------------- Interface Estúdio LAW -----------------
function injectEstudioLawBranding() {
  // Favicon + Título + Watermark
  document.title = "Estúdio LAW | Khanware";
  if (!document.querySelector("link[rel~='icon']")) {
    const lnk = document.createElement("link");
    lnk.rel = "icon";
    lnk.href = "https://estudiolaw.com/favicon.ico";
    document.head.appendChild(lnk);
  } else {
    document.querySelector("link[rel~='icon']").href = "https://estudiolaw.com/favicon.ico";
  }
  // Watermark
  const marca = document.createElement('div');
  marca.id = "estudiolaw-watermark";
  marca.style = `
    position:fixed;bottom:10px;right:18px;z-index:99999;
    color:#00aaff;font-size:1.1em;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    opacity:0.7;text-shadow:0 0 8px #00aaff44;
    pointer-events:none;user-select:none;
  `;
  marca.innerHTML = "Estúdio <b>LAW</b>";
  document.body.appendChild(marca);
}

// ----------------- UI Toast (notificação) -----------------
function sendToastEstudioLaw(msg, dur=3000, color='#00aaff') {
  const t = document.createElement('div');
  t.style = `
    position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
    background:${color};color:#fff;padding:12px 28px;border-radius:8px;
    font-size:1.15em;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    z-index:999999;box-shadow:0 4px 24px #00aaff3a;opacity:0;transition:opacity 0.4s;
    pointer-events:none;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.style.opacity='1',50);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),500); }, dur);
}

// ----------------- Funções Extras -----------------
function addQuickTaskPanel() {
  // Painel lateral para tarefas rápidas
  const panel = document.createElement('div');
  panel.id = "estudiolaw-tasks";
  panel.style = `
    position:fixed;top:70px;right:12px;z-index:99997;
    background:rgba(18,43,70,0.97);
    border-radius:14px;
    box-shadow:0 8px 24px #00aaff33;
    padding:22px 18px 18px 18px;
    min-width:220px;max-width:300px;
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    color:#fff;
    transition:filter 0.2s;
    font-size:1.1em;
  `;
  panel.innerHTML = `
    <div style="font-size:1.34em;font-weight:bold;color:#00aaff;margin-bottom:8px;text-shadow:0 0 10px #00aaff55;">Painel Rápido</div>
    <button id="estudiolaw-quick-complete" style="margin:7px 0 10px 0;width:100%;background:#00aaff;color:#fff;font-weight:bold;border:none;border-radius:7px;padding:9px;font-size:1.1em;cursor:pointer;">Finalizar Tarefa Atual</button>
    <button id="estudiolaw-quick-next" style="width:100%;background:#0077cc;color:#fff;font-weight:bold;border:none;border-radius:7px;padding:9px;font-size:1.1em;cursor:pointer;">Próxima Recomendação</button>
    <br><br>
    <div style="font-size:0.95em;color:#bbd;margin-bottom:6px;">Atalhos úteis:</div>
    <button id="estudiolaw-quick-showanswers" style="width:100%;background:none;border:1px solid #00aaff;color:#00aaff;font-weight:bold;border-radius:7px;padding:7px;margin-bottom:6px;cursor:pointer;">Mostrar Respostas</button>
  `;
  document.body.appendChild(panel);

  // Funções dos botões:
  document.getElementById('estudiolaw-quick-complete').onclick = async () => {
    sendToastEstudioLaw("Tentando finalizar tarefa...");
    // Simula clique no botão "finalizar" (ajuste o seletor para o correto)
    const btn = document.querySelector('[data-test-id="task-done-button"], button[aria-label*="concluir"], button:contains("Finalizar")');
    if (btn) { btn.click(); sendToastEstudioLaw("Tarefa finalizada!"); }
    else sendToastEstudioLaw("Botão não encontrado!", 2000, "#ff6a6a");
  };
  document.getElementById('estudiolaw-quick-next').onclick = async () => {
    sendToastEstudioLaw("Avançando para a próxima recomendação...");
    // Simula clique no botão "próxima recomendação" (ajuste o seletor para o correto)
    const btn = document.querySelector('[data-test-id="next-recommendation-button"], button[aria-label*="próxima"], button:contains("Próxima")');
    if (btn) { btn.click(); }
    else sendToastEstudioLaw("Botão não encontrado!", 2000, "#ff6a6a");
  };
  document.getElementById('estudiolaw-quick-showanswers').onclick = async () => {
    sendToastEstudioLaw("Tentando mostrar respostas...");
    // Força mostrar respostas (ajuste para o caso correto)
    document.querySelectorAll('[data-test-id="answer"]').forEach(e => e.style.background = "#00aaff22");
    sendToastEstudioLaw("Respostas destacadas.");
  };
}

// ----------------- Script Principal -----------------
(async function main() {
  await showEstudioLawSplash();
  await delay(1500);

  // Painel de senha
  try {
    await showPasswordPanel();
  } catch (e) {
    hideEstudioLawSplash();
    return;
  }
  injectEstudioLawBranding();
  sendToastEstudioLaw("Bem-vindo(a) ao Estúdio LAW Khanware!");

  await delay(700);
  hideEstudioLawSplash();

  // Integrar com scripts Khanware originais (ajustado para brand Estúdio LAW)
  const ver = "V3.1.1-ESTUDIO-LAW";
  let isDev = false;
  const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;
  let loadedPlugins = [];
  // Outras variáveis do script original...

  // Carregar scripts visuais e funções Khanware
  function loadScript(url, label) {
    return fetch(url).then(response => response.text()).then(script => { loadedPlugins.push(label); eval(script); });
  }
  function loadCss(url) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  // Carregar Toastify só para retrocompatibilidade Khanware
  await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');

  // Carregar painel de tarefas Estúdio LAW
  addQuickTaskPanel();

  // Carregar scripts Khanware originais
  // (Coloque aqui as funções de loadScript para Khanware, como questionSpoof.js, videoSpoof.js etc)
  // SUGESTÃO: Adapte os nomes para a estética Estúdio LAW se quiser ir além

  sendToastEstudioLaw("Extensão Estúdio LAW ativa!", 3000, "#0077cc");
})();
