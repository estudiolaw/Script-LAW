(() => {
  const ver = "LAW V1.0.0";
  const isDev = false;

  const device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
  };

  let user = {
    username: "Username",
    nickname: "Nickname",
    UID: "00000"
  };

  const splashScreen = document.createElement('div');
  let loadedPlugins = [];

  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function showSplashScreen() {
    splashScreen.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: linear-gradient(to bottom right, #0f172a, #1e293b);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 1s ease;
      font-family: sans-serif;
      color: white;
      font-size: 2.5rem;
      letter-spacing: 2px;
    `;
    splashScreen.innerHTML = `🔥 ESTÚDIO <span style="color:#60a5fa">LAW</span>`;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 100);
  }

  async function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 800);
  }

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

  async function loadCss(url) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  function sendToast(text, duration = 3000) {
    if (typeof Toastify !== "undefined") {
      Toastify({
        text,
        duration,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        style: { background: "#1e293b", color: "#fff" },
      }).showToast();
    } else {
      alert(text);
    }
  }

  function setupSecurity() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
    });
  }

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

  async function setupPlugins() {
    // Suas funções vão aqui (preencha com lógica própria)
    function autoAnswer() {
      console.log("📘 Auto Khan ativado (placeholder)");
    }

    function showAnswers() {
      console.log("📘 Show Answers ativado (placeholder)");
    }

    autoAnswer();
    showAnswers();

    loadedPlugins.push("autoAnswer");
    loadedPlugins.push("showAnswers");
  }

  async function initLAW() {
    if (!location.hostname.includes("khanacademy.org")) {
      alert("⚠️ Este script só funciona no Khan Academy!");
      window.location.href = "https://pt.khanacademy.org/";
      return;
    }

    setupSecurity();
    await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
    await loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "Toastify");

    await showSplashScreen();
    await fetchUserProfile();

    sendToast("✅ LAW Injetado com sucesso!");
    await delay(400);
    sendToast(`👤 Bem-vindo(a)`);
    if (device.apple) {
      sendToast("🍏 Que tal um Samsung?");
    }

    await setupPlugins();
    await delay(500);
    hideSplashScreen();

    console.clear();
    loadedPlugins.forEach(p => sendToast(`🔧 Plugin carregado: ${p}`, 2000));
  }

  initLAW();
})();
