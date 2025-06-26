(() => {
  const ver = "Estúdio LAW V1.0.0";
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

  const splashScreen = document.createElement('splashScreen');
  let loadedPlugins = [];

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ----------- Estúdio LAW Splash Animada ----------------

  async function showEstudioLawSplash() {
    splashScreen.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
      background-size: 400% 400%;
      animation: backgroundFlow 10s ease infinite;
      user-select: none;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      opacity: 0;
      transition: opacity 0.5s ease;
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
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(splashScreen);
    // Forçar o fade in
    await delay(10);
    splashScreen.style.opacity = '1';
  }

  async function hideEstudioLawSplash() {
    splashScreen.style.opacity = '0';
    await delay(1000);
    splashScreen.remove();
  }

  // ----------- Funções auxiliares ----------------

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
    // Aqui você pode colocar suas funções/auto answer etc
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

    await showEstudioLawSplash();
    await fetchUserProfile();

    sendToast("✅ LAW Injetado com sucesso!");
    await delay(400);
    sendToast(`👤 Bem-vindo(a) ${user.nickname}`);
    if (device.apple) {
      sendToast("🍏 Que tal um Samsung?");
    }

    await setupPlugins();

    await delay(1000);
    await hideEstudioLawSplash();

    console.clear();
    loadedPlugins.forEach(p => sendToast(`🔧 Plugin carregado: ${p}`, 2000));
  }

  initLAW();

})();
