// ==UserScript==
// @name         Studio Law Khanware Login Modern
// @namespace    https://estudiolaw.com/
// @version      1.0.0
// @description  Painel de login profissional + integração Khanware, com toast, online, fogos, splash e auto-tarefas!
// @author       Wesley
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @grant        none
// ==/UserScript==

// ========== CONFIG ==========
const USERS = [
  { ra: "0001134609322sp", senha: "Osma@2024", validade: "2025-12-31" },
  { ra: "lawuser01", senha: "law2025", validade: "2025-08-01" }
];
const VERSION = "1.0.0";
// ============================

function isOnline() {
  // Simples: verifica se consegue acessar Khan Academy (ou um endpoint qualquer)
  return fetch("https://www.khanacademy.org/")
    .then(() => true)
    .catch(() => false);
}

function showToast(msg, type="success") {
  const colors = {success:"#338fff",error:"#e74c3c",info:"#222"};
  let toast = document.createElement("div");
  toast.style = `
    position:fixed;top:38px;right:30px;z-index:999999;background:${colors[type]||colors.info};
    color:white;padding:16px 32px;border-radius:12px;box-shadow:0 2px 12px #0006;font-size:1.13em;
    font-family:'Segoe UI',Tahoma,Verdana,sans-serif;opacity:0;transition:opacity .4s;
    pointer-events:auto;cursor:pointer;user-select:none`;
  toast.innerHTML = `<b>Login Realizado!</b><br>${msg}`;
  document.body.appendChild(toast);
  setTimeout(()=>toast.style.opacity=1,50);
  setTimeout(()=>{toast.style.opacity=0;setTimeout(()=>toast.remove(),400)},3500);
}

function showFireworks() {
  // Use canvas-confetti (CDN) para animação de fogos/festa
  if (!window.confetti) {
    let s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    s.onload = () => { window.confetti && window.confetti({particleCount: 180,spread: 110,origin:{y:0.7}}); };
    document.head.appendChild(s);
  } else {
    window.confetti({particleCount: 180,spread: 110,origin:{y:0.7}});
  }
}

function showSplashLAW() {
  return new Promise(resolve=>{
    let splash = document.createElement("div");
    splash.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000001;
      background:linear-gradient(-45deg,#10192B 0%,#072047 100%);
      display:flex;align-items:center;justify-content:center;transition:opacity .6s;opacity:0;`;
    splash.innerHTML = `
      <div style="
        text-align:center; animation:lawlogoanim 1.44s cubic-bezier(.6,0,.3,1) forwards;
        opacity:0;transform:translateY(40px);
      ">
        <svg width="110" height="110" viewBox="0 0 100 100" fill="none" style="margin-bottom: 18px;">
          <circle cx="50" cy="50" r="46" stroke="#00aaff" stroke-width="6"/>
          <text x="50%" y="54%" text-anchor="middle" fill="#00aaff" font-size="42" font-family="arial" dy=".3em" font-weight="bold">L</text>
        </svg>
        <div style="font-size:2.8em; font-weight:bold; color:#fff;text-shadow:0 0 18px #00aaff90">
          Estúdio <span style="color:#00aaff">LAW</span>
        </div>
      </div>
      <style>
        @keyframes lawlogoanim {
          from { opacity:0;transform:translateY(40px);}
          to {opacity:1;transform:translateY(0);}
        }
      </style>
    `;
    document.body.appendChild(splash);
    setTimeout(()=>splash.style.opacity=1,20);
    setTimeout(()=>{splash.style.opacity=0;setTimeout(()=>{splash.remove();resolve();},800)}, 2100);
  });
}

function checkForUpdate() {
  // Simples: compara versão
  fetch("https://raw.githubusercontent.com/estudiolaw/khanwarelaw/main/version.txt")
    .then(r=>r.text())
    .then(v=>{
      if(v.trim()!==VERSION) showToast("Há uma nova versão disponível!", "info");
    }).catch(()=>{});
}

// Painel de login estilizado (igual ao print)
async function showLoginLAW() {
  return new Promise(async (resolve, reject) => {
    // Online status
    let online = await isOnline();
    // Overlay
    let overlay = document.createElement("div");
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
      background:linear-gradient(-35deg,#1e3c72 60%,#0f2027 100%);
      background-size: 400% 400%;animation:lawBgFlow 11s ease-in-out infinite alternate;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.6s;
    `;
    // Painel
    let panel = document.createElement("div");
    panel.style = `
      background:rgba(18,43,70,0.96);box-shadow:0 8px 40px 0 #000a,0 0 0 2px #00aaff33;
      border-radius: 19px;padding: 48px 38px 28px 38px;text-align:center;
      min-width:340px;max-width:95vw;
      font-family:'Segoe UI',Tahoma,Verdana,sans-serif;
      animation: fadeSlideIn 1.2s cubic-bezier(.4,0,.2,1);
      backdrop-filter: blur(7px);border:1.5px solid #00aaff33;
      box-shadow:0 0 0 10px #00aaff0d;
    `;
    panel.innerHTML = `
      <div style="font-size:2.3em;font-weight:bold;color:#00aaff;text-shadow:0 0 12px #00aaff90;">
        Studio Law
      </div>
      <div style="margin-bottom:20px;color:#9fd;font-size:1.1em;">para sala do futuro e cmspl</div>
      <div style="margin-bottom:14px;">
        <input id="law-ra" type="text" placeholder="RA" style="width:88%;padding:10px 14px;font-size:1.13em;border-radius:8px;border:1.2px solid #00aaff;outline:none;transition:.2s all;" autocomplete="username" />
      </div>
      <div style="margin-bottom:12px;">
        <input id="law-senha" type="password" placeholder="Senha" style="width:88%;padding:10px 14px;font-size:1.13em;border-radius:8px;border:1.2px solid #00aaff;outline:none;transition:.2s all;" autocomplete="current-password" />
      </div>
      <div style="margin-bottom:18px;">
        <label style="color:#72f;font-size:0.98em;">
          <input id="law-verificado" type="checkbox" checked style="accent-color:#00aaff;"> Verificado
        </label>
      </div>
      <button id="law-pend" style="width:99%;background:#338fff;color:#fff;font-weight:bold;border:none;border-radius:8px;padding:13px 0;font-size:1.13em;margin-bottom:12px;cursor:pointer;box-shadow:0 2px 7px #338fff33;">ATIVIDADES PENDENTES</button><br>
      <button id="law-exp" style="width:99%;background:#555a;color:#fff;font-weight:bold;border:none;border-radius:8px;padding:13px 0;font-size:1.13em;margin-bottom:12px;cursor:pointer;box-shadow:0 2px 7px #338fff18;">ATIVIDADES EXPIRADAS</button><br>
      <button id="law-sair" style="width:99%;background:#ea5975;color:#fff;font-weight:bold;border:none;border-radius:8px;padding:13px 0;font-size:1.13em;margin-bottom:0;cursor:pointer;box-shadow:0 2px 7px #ea597588;">SAIR</button>
      <div id="law-login-err" style="color:#ff6a6a;margin:12px 0 0 0;font-size:1em;min-height:22px"></div>
      <div style="margin-top:24px;font-size:0.92em;color:#59b;opacity:0.7;letter-spacing:0.01em;">
        Entre no nosso Discord: <a href="https://discord.gg/lawhouse" style="color:#00aaff;text-decoration:underline" target="_blank">Law House</a>
      </div>
      <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:1.09em;color:${online ? "#00ff90":"#ff4444"};letter-spacing:0.04em;font-weight:bold;opacity:.82;">
        ${online ? "● Online" : "● Offline"}
      </div>
    `;
    overlay.appendChild(panel);

    // Animações e estilos extra
    if (!document.getElementById('lawpw-style')) {
      const style = document.createElement('style');
      style.id = 'lawpw-style';
      style.innerHTML = `
        @keyframes lawBgFlow {
          0% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
          100% {background-position:0% 50%;}
        }
        @keyframes fadeSlideIn {
          from {opacity:0;transform:translateY(55px);}
          to {opacity:1;transform:translateY(0);}
        }
        #law-ra:focus, #law-senha:focus {
          border-color: #00ccff;
          box-shadow: 0 0 12px #00aaff55;
        }
        button:active {filter: brightness(0.93);}
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);

    // Funções dos botões
    document.getElementById("law-pend").onclick = () => {
      // Atividades pendentes (pode puxar as do Khanware ou exibir simulação)
      showToast("Você tem 3 atividades pendentes.", "info");
    };
    document.getElementById("law-exp").onclick = () => {
      showToast("Nenhuma atividade expirada encontrada.", "info");
    };
    document.getElementById("law-sair").onclick = () => {
      overlay.remove();
      location.reload();
    };

    // Autenticação
    function login() {
      let ra = document.getElementById("law-ra").value.trim();
      let senha = document.getElementById("law-senha").value.trim();
      let user = USERS.find(u => u.ra === ra && u.senha === senha);
      if(user) {
        let hoje = new Date();
        let validade = new Date(user.validade + "T23:59:59");
        if(hoje <= validade) {
          showToast(`Bem-vindo, ${ra}`, "success");
          overlay.remove();
          showFireworks();
          setTimeout(async ()=>{
            await showSplashLAW();
            resolve(user);
          }, 2200);
        } else {
          document.getElementById("law-login-err").textContent = "Senha expirada!";
        }
      } else {
        document.getElementById("law-login-err").textContent = "RA ou senha inválidos!";
      }
    }
    document.getElementById("law-senha").onkeydown = (e) => { if(e.key==="Enter") login(); };
    document.getElementById("law-ra").onkeydown = (e) => { if(e.key==="Enter") login(); };
    document.getElementById("law-passok")?.addEventListener("click", login);
    document.getElementById("law-pend").onkeydown = (e)=>{if(e.key==="Enter")login();}
    // Foca no RA ao abrir
    setTimeout(()=>document.getElementById("law-ra").focus(), 200);
  });
}

// =========== INÍCIO ===========
(async function(){
  checkForUpdate();
  await showLoginLAW();

  // Aqui entra o seu script do Khanware INTEIRO, igual você já usa!
  // Por exemplo:
  // ...código original do Khanware...
  // (não precisa mexer em mais nada!)

})();
