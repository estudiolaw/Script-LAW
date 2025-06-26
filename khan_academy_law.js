// Painel de senha Estúdio LAW PRO (senha e validade individuais, sem mostrar a data para o usuário!)

// Lista de senhas e suas datas de expiração (por senha)
const PASSWORDS = [
  { senha: "law2025@1",  validade: "2025-12-31" },
  { senha: "khanlaw!2",  validade: "2025-11-01" },
  { senha: "stud1oLAW",  validade: "2025-10-15" },
  { senha: "wesleyx2025",validade: "2025-12-31" },
  { senha: "projetoblue",validade: "2025-08-01" },
  { senha: "lawaccess23",validade: "2025-09-30" },
  { senha: "segredoLAW", validade: "2025-07-20" },
  { senha: "unlockkhan", validade: "2025-12-15" },
  { senha: "estudiopass",validade: "2025-12-31" },
  { senha: "lawpremium", validade: "2025-12-31" }
];

function showAnimatedPasswordPanel() {
  return new Promise((resolve, reject) => {
    // Overlay e painel
    const overlay = document.createElement('div');
    overlay.id = "estudiolaw-password-overlay";
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
      background:linear-gradient(-45deg,#1e3c72,#2a5298,#0f2027,#232526,#1e3c72);
      background-size:400% 400%;animation:lawBgFlow 7s ease-in-out infinite alternate;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.6s;
    `;
    const panel = document.createElement('div');
    panel.style = `
      background:rgba(18,43,70,0.93);
      box-shadow: 0 8px 40px 0 #000a,0 0 0 2px #00aaff44;
      border-radius: 22px;
      padding: 46px 38px 30px 38px;
      text-align:center;
      min-width:340px;max-width:90vw;
      font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
      animation: fadeSlideIn 1.1s cubic-bezier(.4,0,.2,1);
      backdrop-filter: blur(6px);
      border: 1.8px solid #00aaff88;
      box-shadow: 0 0 0 8px #00aaff11;
    `;
    panel.innerHTML = `
      <div style="font-size:2.2em;font-weight:bold;color:#fff;text-shadow:0 0 10px #00aaff80;">
        Estúdio <span style="color:#00aaff;">LAW</span>
      </div>
      <div style="margin:22px 0 10px 0;color:#bbd;letter-spacing:0.02em;font-size:1.12em;">
        Digite sua senha para acessar
      </div>
      <input id="estudiolaw-passinput" type="password" maxlength="64"
        style="width:90%;padding:13px 14px;font-size:1.15em;border-radius:8px;border:1.4px solid #00aaff;outline:none;margin-bottom:18px;box-shadow:0 0 0 2px #00aaff22;transition:.2s all;" autofocus autocomplete="current-password" />
      <br>
      <button id="estudiolaw-passok" style="
        background:linear-gradient(90deg,#00aaff,#0077cc);color:#fff;font-weight:bold;
        border:none;border-radius:7px;padding:12px 40px;font-size:1.12em;cursor:pointer;box-shadow:0 2px 8px #00aaff44;
        transition:filter .15s,box-shadow .15s;
      ">Acessar</button>
      <div id="estudiolaw-pass-err" style="color:#ff6a6a;margin:10px 0 0 0;font-size:1em;min-height:22px"></div>
      <div style="margin-top:24px;font-size:0.92em;color:#59b;opacity:0.7;letter-spacing:0.01em;">
        Feito por Wesley • Estúdio LAW
      </div>
    `;
    overlay.appendChild(panel);

    // Animações e estilos
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
          from {opacity:0;transform:translateY(50px);}
          to {opacity:1;transform:translateY(0);}
        }
        #estudiolaw-password-overlay input:focus {
          border-color: #00ccff;
          box-shadow: 0 0 12px #00aaff55;
        }
        #estudiolaw-password-overlay button:hover {
          filter: brightness(1.09) saturate(1.13);
          box-shadow:0 2px 14px #00ccff55;
        }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);

    function cleanup() { overlay.remove(); }

    // Lógica de senha + validade individual
    document.getElementById("estudiolaw-passok").onclick = () => {
      const pass = document.getElementById("estudiolaw-passinput").value;
      const senhaObj = PASSWORDS.find(obj => obj.senha === pass);
      if (senhaObj) {
        const hoje = new Date();
        const validade = new Date(senhaObj.validade + "T23:59:59");
        if (hoje <= validade) {
          cleanup();
          resolve();
        } else {
          document.getElementById("estudiolaw-pass-err").textContent = "Senha expirada!";
        }
      } else {
        document.getElementById("estudiolaw-pass-err").textContent = "Senha incorreta!";
      }
    };
    document.getElementById("estudiolaw-passinput").onkeydown = (e) => {
      if (e.key === "Enter") document.getElementById("estudiolaw-passok").click();
    };
  });
}

// Como usar: 
// Basta chamar `await showAnimatedPasswordPanel();` antes de tudo.
// Não mostra a data de validade para o usuário!
