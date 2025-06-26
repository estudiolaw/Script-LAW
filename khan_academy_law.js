// ==UserScript==
// @name         Khanware + Estúdio LAW Completo
// @namespace    http://estudiolaw.com/
// @version      3.1.1-ESTUDIO-LAW
// @description  Script completo com painel de senha, tela de comemoração, abertura e funções Khanware. Feito por Wesley/Estúdio LAW.
// @author       Wesley (Estúdio LAW)
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

(async function(){
  const VALID_UNTIL = "2025-12-31";
  const PASSWORDS = [
    "law2025@1","khanlaw!2","stud1oLAW","wesleyx2025","projetoblue",
    "lawaccess23","segredoLAW","unlockkhan","estudiopass","lawpremium"
  ];

  async function showPasswordPanel() {
    return new Promise((resolve, reject) => {
      const today = new Date();
      const validDate = new Date(VALID_UNTIL + "T23:59:59");
      if (today > validDate) return alert("⚠️ Acesso expirado! Contate o Estúdio LAW.") || reject();

      const overlay = document.createElement('div');
      overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;
        display:flex;align-items:center;justify-content:center;
        background:linear-gradient(45deg,#1e3c72,#2a5298,#0f2027,#232526);
        animation:bgFlow 10s ease infinite alternate;background-size:300% 300%;
      `;

      const panel = document.createElement('div');
      panel.style = `
        background:#121f33;padding:30px 25px;border-radius:15px;
        box-shadow:0 0 15px #00aaff88;text-align:center;
        color:white;font-family:sans-serif;
      `;
      panel.innerHTML = `
        <h2 style='color:#00aaff;'>Estúdio LAW</h2>
        <p>Insira a senha para acessar:</p>
        <input id='law-pass' type='password' placeholder='Senha...' style='padding:8px;font-size:1em;border-radius:6px;width:90%;'><br><br>
        <button id='law-btn' style='padding:10px 30px;font-size:1em;background:#00aaff;border:none;border-radius:6px;color:white;'>Entrar</button>
        <div id='law-err' style='margin-top:10px;color:#ff6a6a;'></div>
      `;
      overlay.appendChild(panel);

      const style = document.createElement('style');
      style.textContent = `
        @keyframes bgFlow {
          0%{background-position:0% 50%} 100%{background-position:100% 50%}
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(overlay);

      document.getElementById('law-btn').onclick = () => {
        const val = document.getElementById('law-pass').value;
        if (PASSWORDS.includes(val)) {
          overlay.remove();
          resolve();
        } else {
          document.getElementById('law-err').textContent = "Senha incorreta!";
        }
      };
    });
  }

  async function showCelebration() {
    const confettiScript = document.createElement("script");
    confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
    document.body.appendChild(confettiScript);
    confettiScript.onload = () => {
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 150, spread: 150 }), 500);
    };
    await new Promise(r => setTimeout(r, 1800));
  }

  async function showIntroLAW() {
    const splash = document.createElement('div');
    splash.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;
      display:flex;align-items:center;justify-content:center;color:#00aaff;
      font-size:2.5em;font-family:sans-serif;text-shadow:0 0 20px #00aaff;
      animation:fadein 1.5s ease;
    `;
    splash.textContent = "ESTÚDIO LAW";
    document.body.appendChild(splash);
    await new Promise(r => setTimeout(r, 2500));
    splash.remove();
  }

  await showPasswordPanel();
  await showCelebration();
  await showIntroLAW();

  /* === Início do script Khanware === */
  const script = document.createElement('script');
  script.src = 'https://raw.githubusercontent.com/Niximkk/Khanware/main/loader.js';
  document.body.appendChild(script);
})();

