// ==UserScript==
// @name         Studio Law Khanware: Painel Senha + Splash
// @namespace    https://estudiolaw.com/
// @version      1.0.0
// @description  Painel de senha animado, comemoração, splash e depois script Khanware. Feito por Wesley.
// @author       Wesley
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @grant        none
// ==/UserScript==

// --- CONFIGURE AS SUAS SENHAS E VALIDES INDIVIDUAIS AQUI: ---
const PASSWORDS = [
  { senha: "law2025@1", validade: "2025-12-31" },
  { senha: "khanlaw!2", validade: "2025-11-01" },
  { senha: "stud1oLAW", validade: "2025-10-15" },
  { senha: "wesleyx2025", validade: "2025-12-31" },
  { senha: "projetoblue", validade: "2025-08-01" },
  { senha: "lawaccess23", validade: "2025-09-30" },
  { senha: "segredoLAW", validade: "2025-07-20" },
  { senha: "unlockkhan", validade: "2025-12-15" },
  { senha: "estudiopass", validade: "2025-12-31" },
  { senha: "lawpremium", validade: "2025-12-31" }
];

// ========== PAINEL DE SENHA ==========
function showLawSenhaPanel() {
  return new Promise((resolve, reject) => {
    // Cria overlay e painel
    const overlay = document.createElement('div');
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
      background:linear-gradient(-45deg,#1e3c72,#2a5298,#0f2027,#232526,#1e3c72);
      background-size:400% 400%;animation:lawBgFlow 8s ease-in-out infinite alternate;
      display:flex;align-items:center;justify-content:center;
    `;
    const panel = document.createElement('div');
    panel.style = `
      background:rgba(18,43,70,0.95);
      box-shadow: 0 8px 40px 0 #000b,0 0 0 2px #00aaff44;
      border-radius: 20px;
      padding: 48px 38px 32px 38px;
      text-align:center;min-width:310px;max-width:94vw;
      font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
      animation: fadeSlideIn 1.1s cubic-bezier(.4,0,.2,1);
      backdrop-filter: blur(8px);
      border: 1.7px solid #00aaff55;
      box-shadow: 0 0 0 10px #00aaff11;
    `;
    panel.innerHTML = `
      <div style="font-size:2.2em;font-weight:bold;color:#00aaff;text-shadow:0 0 12px #00aaff80;">
        Estúdio <span style="color:#fff">LAW</span>
      </div>
      <div style="margin:19px 0 12px 0;color:#bbd;letter-spacing:0.02em;font-size:1.13em;">
        Digite a senha para acessar
      </div>
      <input id="law-senha-input" type="password" maxlength="64"
        style="width:90%;padding:14px 14px;font-size:1.23em;border-radius:9px;border:1.3px solid #00aaff;outline:none;margin-bottom:18px;box-shadow:0 0 0 2px #00aaff22;transition:.2s all;" autofocus autocomplete="current-password" />
      <br>
      <button id="law-senha-ok" style="
        background:linear-gradient(90deg,#00aaff,#0077cc);color:#fff;font-weight:bold;
        border:none;border-radius:8px;padding:13px 44px;font-size:1.17em;cursor:pointer;box-shadow:0 2px 8px #00aaff44;
        transition:filter .15s,box-shadow .15s;
      ">Acessar</button>
      <div id="law-pass-err" style="color:#ff6a6a;margin:12px 0 0 0;font-size:1em;min-height:22px"></div>
      <div style="margin-top:28px;font-size:0.93em;color:#459;opacity:0.6;letter-spacing:0.01em;">
        Feito por Wesley • Estúdio LAW
      </div>
      <style>
        @keyframes lawBgFlow {
          0% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
          100% {background-position:0% 50%;}
        }
        @keyframes fadeSlideIn {
          from {opacity:0;transform:translateY(55px);}
          to {opacity:1;transform:translateY(0);}
        }
        #law-senha-input:focus {
          border-color: #00ccff;
          box-shadow: 0 0 14px #00aaff66;
        }
        #law-senha-ok:hover {
          filter: brightness(1.09) saturate(1.13);
          box-shadow:0 2px 14px #00ccff55;
        }
      </style>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function cleanup() { overlay.remove(); }

    document.getElementById("law-senha-ok").onclick = tryLogin;
    document.getElementById("law-senha-input").onkeydown = (e) => { if (e.key === "Enter") tryLogin(); };

    function tryLogin() {
      const pass = document.getElementById("law-senha-input").value;
      const senhaObj = PASSWORDS.find(obj => obj.senha === pass);
      if (senhaObj) {
        const hoje = new Date();
        const validade = new Date(senhaObj.validade + "T23:59:59");
        if (hoje <= validade) {
          cleanup();
          resolve(pass);
        } else {
          document.getElementById("law-pass-err").textContent = "Senha expirada!";
        }
      } else {
        document.getElementById("law-pass-err").textContent = "Senha incorreta!";
      }
    }
    setTimeout(()=>document.getElementById("law-senha-input").focus(), 200);
  });
}

// ========== COMEMORAÇÃO ==========
function showLawCelebration(nome="") {
  // Mensagem + confete (canvas-confetti)
  const overlay = document.createElement("div");
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000001;
    background:rgba(10,22,34,0.70);display:flex;align-items:center;justify-content:center;transition:opacity .6s;
  `;
  overlay.innerHTML = `
    <div style="text-align:center;animation:fadeInCelebration 1.1s cubic-bezier(.4,0,.2,1) forwards;opacity:0;">
      <div style="font-size:2.2em;font-weight:bold;color:#fff;text-shadow:0 0 22px #00aaff;">
        Bem-vindo(a) <span style="color:#00aaff;">${nome}</span>
      </div>
      <div style="font-size:1.6em;color:#c2e7ff;margin-top:18px;">
        Acesso liberado!
      </div>
    </div>
    <style>
      @keyframes fadeInCelebration {
        from {opacity:0;transform:scale(0.92);}
        to {opacity:1;transform:scale(1);}
      }
    </style>
  `;
  document.body.appendChild(overlay);
  // Confetti
  function confettiLaw() {
    if (!window.confetti) {
      let s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      s.onload = () => { window.confetti && window.confetti({particleCount: 220,spread: 120,origin:{y:0.8}}); };
      document.head.appendChild(s);
    } else {
      window.confetti({particleCount: 220,spread: 120,origin:{y:0.8}});
    }
  }
  confettiLaw();
  setTimeout(()=>overlay.style.opacity=1,40);
  setTimeout(()=>{
    overlay.style.opacity=0;
    setTimeout(()=>overlay.remove(),800);
  }, 2100);
}

// ========== SPLASH LOGO LAW ==========
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
    setTimeout(()=>{splash.style.opacity=0;setTimeout(()=>{splash.remove();resolve();},900)}, 2200);
  });
}

// ========== INTEGRAÇÃO FINAL ==========
(async function(){
  let senha = await showLawSenhaPanel();
  showLawCelebration("Usuário");
  await new Promise(res=>setTimeout(res,2400));
  await showSplashLAW();

  // ===== DAQUI PRA BAIXO: SEU SCRIPT ORIGINAL DO KHANWARE =====
  // (pode colar ele igual, nada será quebrado)

  // ... cole seu script Khanware inteiro aqui (a partir de const ver = "V3.1.1"...)

})();
