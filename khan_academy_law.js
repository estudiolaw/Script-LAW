// Painel de senha Estúdio LAW v2 (dinâmico, animado, 10 senhas possíveis)

const VALID_UNTIL = "2025-12-31"; // AAAA-MM-DD

// 10 senhas válidas (adicione aqui as que desejar)
const PASSWORDS = [
  "law2025@1",
  "khanlaw!2",
  "stud1oLAW",
  "wesleyx2025",
  "projetoblue",
  "lawaccess23",
  "segredoLAW",
  "unlockkhan",
  "estudiopass",
  "lawpremium"
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
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = "estudiolaw-password-overlay";
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
      background:linear-gradient(-45deg,#1e3c72,#2a5298,#0f2027,#232526,#1e3c72);
      background-size:400% 400%;animation:lawBgFlow 7s ease-in-out infinite alternate;
      display:flex;align-items:center;justify-content:center;
    `;
    // Painel
    const panel = document.createElement('div');
    panel.style = `
      background:rgba(18,43,70,0.92);
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

    // Animação de fundo
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

// Como usar no início do script:
// await showAnimatedPasswordPanel(); (deve ser usado dentro de uma função async!)
