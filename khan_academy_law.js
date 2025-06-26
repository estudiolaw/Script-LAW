(() => {
  const ver = "V3.1.1";
  const isDev = false;
  const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

  // Detecta dispositivo móvel e Apple
  const device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
  };

  // Usuário - vai preencher depois
  let user = {
    username: "Username",
    nickname: "Nickname",
    UID: "00000"
  };

  let loadedPlugins = [];

  // Elementos DOM criados dinamicamente
  const splashScreen = document.createElement('div');

  // Configurações globais de features (pode alterar aqui)
  window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    customBanner: false,
    nextRecomendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false
  };
  window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: ""
  };

  // Bloqueia algumas teclas e clique direito para segurança básica
  function setupSecurity() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase()))
      ) e.preventDefault();
    });
  }

  // Estilo básico para splashScreen e animação fade
  function showSplashScreen() {
    splashScreen.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background-color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s ease;
      user-select: none;
      color: #72ff72;
      font-family: 'MuseoSans', sans-serif;
      font-size: 3rem;
      font-weight: 700;
      letter-spacing: 3px;
    `;
    splashScreen.innerHTML = `KHANWARE<span style="color:#fff;">.SPACE</span>`;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = "1", 10);
  }

  function hideSplashScreen() {
    splashScreen.style.opacity = "0";
    setTimeout(() => splashScreen.remove(), 600);
  }

  // Delay async padrão
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Carrega script externo via fetch + eval (cuidado com CORS)
  async function loadScript(url, label) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Falha ao carregar script: ${url}`);
      const code = await res.text();
      eval(code);
      loadedPlugins.push(label);
      console.log(`[Khanware] Plugin carregado: ${label}`);
    } catch (e) {
      console.error(e);
      sendToast(`Erro ao carregar plugin: ${label}`, 6000);
    }
  }

  // Carrega CSS externo via link
  async function loadCss(url) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  // Toast via Toastify
  function sendToast(text, duration = 4000, gravity = "bottom") {
    if (typeof Toastify !== "undefined") {
      Toastify({
        text,
        duration,
        gravity,
        position: "center",
        stopOnFocus: true,
        style: { background: "#000000" },
      }).showToast();
    } else {
      console.log("[Toast] " + text);
    }
  }

  // Busca dados do usuário Khan Academy
  async function fetchUserProfile() {
    try {
      const resp = await fetch(
        `https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            accept: "*/*",
            "content-type": "application/json",
            "x-ka-fkey": "1",
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
            `,
          }),
        }
      );
      const data = await resp.json();
      const u = data.data.user;
      if (u) {
        user.nickname = u.nickname || "Nickname";
        user.username = u.username || "Username";
        user.UID = u.id ? u.id.slice(-5) : "00000";
      }
    } catch (e) {
      console.error("[Khanware] Erro ao buscar perfil:", e);
      sendToast("❌ Falha ao buscar perfil do usuário.");
    }
  }

  // Configura menu e plugins visuais
  async function setupMenu() {
    await loadScript(repoPath + "visuals/mainMenu.js", "mainMenu");
    await loadScript(repoPath + "visuals/statusPanel.js", "statusPanel");
    await loadScript(repoPath + "visuals/widgetBot.js", "widgetBot");
    if (isDev) await loadScript(repoPath + "visuals/devTab.js", "devTab");
  }

  // Configura funções principais
  async function setupMain() {
    await loadScript(repoPath + "functions/questionSpoof.js", "questionSpoof");
    await loadScript(repoPath + "functions/videoSpoof.js", "videoSpoof");
    await loadScript(repoPath + "functions/minuteFarm.js", "minuteFarm");
    await loadScript(repoPath + "functions/spoofUser.js", "spoofUser");
    await loadScript(repoPath + "functions/answerRevealer.js", "answerRevealer");
    await loadScript(repoPath + "functions/rgbLogo.js", "rgbLogo");
    await loadScript(repoPath + "functions/customBanner.js", "customBanner");
    await loadScript(repoPath + "functions/autoAnswer.js", "autoAnswer");
  }

  // Inicia tudo
  async function init() {
    // Verifica URL do site
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
      alert(
        "❌ Khanware Falhou na Injeção!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"
      );
      window.location.href = "https://pt.khanacademy.org/";
      return;
    }

    setupSecurity();
    showSplashScreen();

    // Carregar dependências CSS e JS externas
    await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
    await loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "toastify");
    await loadScript(
      "https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js",
      "darkReader"
    );

    // Inicializa darkreader para modo escuro
    if (typeof DarkReader !== "undefined") {
      DarkReader.setFetchMethod(window.fetch);
      DarkReader.enable();
    }

    await loadScript(
      "https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js",
      "oneko"
    );
    // Ajusta o oneko pra ficar invisível por padrão
    const onekoEl = document.getElementById("oneko");
    if (onekoEl) {
      onekoEl.style.backgroundImage =
        "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
      onekoEl.style.display = "none";
    }

    // Busca dados do usuário para mostrar toast personalizado
    await fetchUserProfile();

    sendToast("🌿 Khanware injetado com sucesso!");
    await delay(500);
    sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
    if (device.apple) {
      await delay(500);
      sendToast(`🪽 Que tal comprar um Samsung?`);
    }

    // Carrega plugins e funções principais
    await setupMenu();
    await setupMain();

    hideSplashScreen();
    console.clear();
  }

  // Roda a inicialização
  init();
})();
