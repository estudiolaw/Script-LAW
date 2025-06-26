(() => {
  const ver = "Estúdio LAW V1.1.0";
  const isDev = false;

  // ======= Configurações Senhas + Validade ===========
  // Senhas válidas e suas datas de expiração (aaaa-mm-dd)
  const validPasswords = [
    { pwd: "law1234", expires: "2025-12-31" },
    { pwd: "khanpass1", expires: "2025-11-30" },
    { pwd: "lawsecure2", expires: "2025-10-15" },
    { pwd: "autoanswer3", expires: "2025-09-30" },
    { pwd: "scriptfour", expires: "2025-12-01" },
    { pwd: "fivelaw55", expires: "2025-11-15" },
    { pwd: "sixthpass6", expires: "2025-12-20" },
    { pwd: "seventhmagic", expires: "2025-10-10" },
    { pwd: "eightlaw88", expires: "2025-12-05" },
    { pwd: "finalpass9", expires: "2025-11-22" },
  ];

  // ======= Variáveis globais =======
  let user = { username: "Username", nickname: "Nickname", UID: "00000" };
  let splashScreen = null;
  let isAuthorized = false;
  let loadedPlugins = [];

  const device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent),
  };

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ========= Criação e exibição da splash animada ===========
  async function showEstudioLawSplash() {
    splashScreen = document.createElement('div');
    splashScreen.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
      background-size: 400% 400%;
      animation: backgroundFlow 12s ease infinite;
      user-select: none;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      opacity: 0;
      transition: opacity 0.8s ease;
    `;

    splashScreen.innerHTML = `
      <div id="estudio-law-text" style="
        font-size: 4em;
        font-weight: 900;
        color: #ffffff;
        text-shadow: 0 0 15px #00aaff, 0 0 30px #0077cc;
        animation: glowText 2.5s ease-in-out infinite alternate,
                   fadeSlideIn 1.5s ease forwards;
        opacity: 0;
        transform: translateY(30px);
      ">
        Estúdio <span style="color:#00aaff;">LAW</span>
      </div>
    `;

    if (!document.getElementById('estudio-law-style')) {
      const style = document.createElement('style');
      style.id = 'estudio-law-style';
      style.textContent = `
        @keyframes backgroundFlow {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        @keyframes glowText {
          from { text-shadow: 0 0 15px #00aaff, 0 0 30px #0077cc; }
          to { text-shadow: 0 0 30px #00ccff, 0 0 45px #00aaff; }
        }
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(splashScreen);
    await delay(50);
    splashScreen.style.opacity = '1';
  }

  // ========= Ocultar splash =========
  async function hideEstudioLawSplash() {
    if (!splashScreen) return;
    splashScreen.style.opacity = '0';
    await delay(1000);
    splashScreen.remove();
    splashScreen = null;
  }

  // ========= Função para enviar toast com Toastify =========
  function sendToast(text, duration = 3500, gravity = 'bottom') {
    if (typeof Toastify !== "undefined") {
      Toastify({
        text,
        duration,
        gravity,
        position: "center",
        stopOnFocus: true,
        style: { background: "#1e293b", color: "#fff", fontWeight: "bold" },
      }).showToast();
    } else {
      alert(text);
    }
  }

  // ========= Bloqueio de clique direito e F12 =========
  function setupSecurity() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
        sendToast("🚫 Ferramentas de desenvolvedor bloqueadas", 2000);
      }
    });
  }

  // ========= Valida senha e data de expiração =========
  function validatePassword(inputPwd) {
    const now = new Date();
    for (const entry of validPasswords) {
      if (entry.pwd === inputPwd) {
        const expiry = new Date(entry.expires + "T23:59:59");
        if (now <= expiry) {
          return true;
        }
        return false; // Expirou
      }
    }
    return false; // Não encontrada
  }

  // ========= Tela de login por senha ==========
  async function showPasswordPrompt() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;

      const box = document.createElement('div');
      box.style.cssText = `
        background: #0a1a2f;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 0 15px #00aaff;
        width: 320px;
        color: white;
        text-align: center;
      `;

      box.innerHTML = `
        <h2 style="margin-bottom: 20px; font-weight: 900; color: #00aaff;">Estúdio LAW</h2>
        <p>Digite a senha para continuar:</p>
        <input id="law-password" type="password" style="width: 100%; padding: 10px; font-size: 1.1em; border-radius: 5px; border:none; margin-top: 12px;"/>
        <button id="law-password-btn" style="
          margin-top: 20px; padding: 10px 20px;
          background: #00aaff;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1.1em;
          color: #fff;
          cursor: pointer;
          transition: background 0.3s;
        ">Entrar</button>
        <p id="law-password-msg" style="color:#ff5555; margin-top: 15px; min-height: 18px;"></p>
      `;

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      function cleanUp() {
        document.body.removeChild(overlay);
      }

      const input = box.querySelector('#law-password');
      const btn = box.querySelector('#law-password-btn');
      const msg = box.querySelector('#law-password-msg');

      btn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) {
          msg.textContent = "Digite uma senha válida.";
          return;
        }
        if (!validatePassword(val)) {
          msg.textContent = "Senha inválida ou expirada.";
          input.value = "";
          return;
        }
        // Senha ok
        cleanUp();
        sendToast("🔓 Senha correta! Bem vindo ao Estúdio LAW.");
        resolve(true);
      });

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          btn.click();
        }
      });
    });
  }

  // ========= Busca o perfil do usuário no Khan Academy =========
  async function fetchUserProfile() {
    try {
      const resp = await fetch(`https://${location.hostname}/api/internal/graphql/getFullUserProfile`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-ka-fkey": "1"
        },
        body: JSON.stringify({
          operationName: "getFullUserProfile",
          variables: {},
          query: `
            query getFullUserProfile {
              user {
                id
                username
                nickname
              }
            }
          `
        })
      });
      const data = await resp.json();
      const u = data.data.user;
      user.username = u.username;
      user.nickname = u.nickname;
      user.UID = u.id.slice(-5);
    } catch (err) {
      console.error("Erro ao buscar perfil do usuário:", err);
    }
  }

  // ========= Função de automação de tarefas (auto resposta) =========
  async function autoAnswerTask() {
    if (!window.features?.autoAnswer) return;

    const choiceSelector = 'input[type="radio"], .perseus-radio-button-input';
    const nextBtnSelector = '[data-test="next-question-button"], button[aria-label*="Next"], button[aria-label*="Próxima"]';

    const choices = document.querySelectorAll(choiceSelector);
    if (choices.length === 0) return;

    // Tenta marcar a alternativa correta
    // Aqui vamos marcar a primeira alternativa (pode melhorar)
    for (const choice of choices) {
      if (!choice.checked) {
        choice.click();
        sendToast("✅ Resposta marcada automaticamente", 1500);
        break;
      }
    }

    // Tenta clicar em "Próxima questão"
    const nextBtn = document.querySelector(nextBtnSelector);
    if (nextBtn) {
      await delay(1200);
      nextBtn.click();
      sendToast("➡️ Avançando para a próxima questão...", 1500);
    }
  }

  // ========= Loop principal dos plugins =========
  async function pluginLoop() {
    while (window.features?.autoAnswer) {
      try {
        await autoAnswerTask();
      } catch(e) {
        console.warn("Erro na automação:", e);
      }
      await delay(2000);
    }
  }

  // ========= Função para carregar scripts externos =========
  async function loadScript(url, label = "plugin") {
    try {
      const res = await fetch(url);
      const code = await res.text();
      eval(code);
      loadedPlugins.push(label);
    } catch (e) {
      console.warn(`Erro ao carregar ${label}:`, e);
    }
  }

  // ========= Função para carregar CSS =========
  async function loadCss(url) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  // ========= Configura recursos globais =========
  window.features = {
    autoAnswer: true, // Ativa auto resposta
  };

  // ========= Função principal de inicialização =========
  async function initLAW() {
    if (!location.hostname.includes("khanacademy.org")) {
      alert("⚠️ Este script só funciona no Khan Academy!");
      window.location.href = "https://pt.khanacademy.org/";
      return;
    }

    setupSecurity();
    await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
    await loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "Toastify");

    await showEstudioLawSplash();
    await showPasswordPrompt();

    if (!isAuthorized) isAuthorized = true;

    await fetchUserProfile();

    sendToast("✅ LAW Injetado com sucesso!");
    await delay(500);
    sendToast(`👤 Bem-vindo(a), ${user.nickname}`);
    if (device.apple) {
      sendToast("🍏 Que tal um Samsung?");
    }

    pluginLoop();

    await delay(1000);
    await hideEstudioLawSplash();

    console.clear();
    loadedPlugins.forEach(p => sendToast(`🔧 Plugin carregado: ${p}`, 2000));
  }

  // ========= Rodar script =========
  initLAW();

})();
