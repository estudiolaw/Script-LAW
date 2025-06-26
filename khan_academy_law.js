(async () => {
  // --- Lista de senhas válidas e vencimento ---
  const validPasswords = [
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '270425', vencimento: '2030-12-31' },
    { senha: 'dogmal', vencimento: '2030-01-01' },
    { senha: 'kng120120', vencimento: '2030-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },

  ];

  // --- Delay helper ---
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // --- Cria overlay senha ---
  function createPasswordOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'law-password-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: #0d1b3dcc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999999;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: white;
      user-select: none;
    `;

    overlay.innerHTML = `
      <div style="background: #112a61; padding: 30px 40px; border-radius: 12px; box-shadow: 0 0 15px #00aaffcc; text-align: center; max-width: 360px; width: 90vw;">
        <h2 style="margin-bottom: 20px; font-weight: 700;">🔐 Acesso Restrito</h2>
        <input id="law-password-input" type="password" placeholder="Digite a senha" style="width: 100%; padding: 12px 15px; font-size: 1.1em; border-radius: 8px; border: none; outline: none; margin-bottom: 15px;">
        <button id="law-password-btn" style="width: 100%; padding: 12px; background: #00aaff; border: none; border-radius: 8px; font-size: 1.2em; color: white; cursor: pointer; font-weight: 600; transition: background 0.3s;">Entrar</button>
        <p id="law-password-msg" style="margin-top: 15px; color: #ff5555; min-height: 24px; font-weight: 600;"></p>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  // --- Valida senha ---
  function validatePassword(input) {
    const now = new Date();
    const userSenha = input.trim();
    
    // Percorre a lista de senhas válidas
    for (const obj of validPasswords) {
      // Se encontrar uma senha que corresponde ao que foi digitado
      if (obj.senha === userSenha) {
        // Verifica se a senha não expirou
        const expiry = new Date(obj.vencimento + 'T23:59:59');
        if (now <= expiry) {
          return true; // Senha válida e não expirada
        } else {
          return 'expired'; // Senha expirada
        }
      }
    }
    
    // Se a senha não corresponder a nenhuma das válidas
    return false; // Senha inválida
  }

  // --- Cria tela comemoração ---
  function createCelebration() {
    const celebration = document.createElement('div');
    celebration.id = 'law-celebration';
    celebration.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: #0d1b3ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999999;
      flex-direction: column;
      color: #00aaff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      user-select: none;
    `;

    celebration.innerHTML = `
      <div style="font-size: 4em; font-weight: 900; text-shadow: 0 0 15px #00aaffaa;">🎉</div>
      <h1 style="margin: 20px 0 10px;">Acesso Liberado!</h1>
      <p style="font-size: 1.2em;">Bem-vindo ao Estúdio LAW!</p>
    `;

    document.body.appendChild(celebration);

    // Confetes emoji
    for (let i = 0; i < 30; i++) {
      const confete = document.createElement('div');
      confete.textContent = '🎊';
      confete.style.position = 'fixed';
      confete.style.fontSize = `${Math.floor(Math.random() * 24) + 16}px`;
      confete.style.left = `${Math.random() * window.innerWidth}px`;
      confete.style.top = `${-50 - Math.random() * 200}px`;
      confete.style.opacity = Math.random();
      confete.style.animation = `confeteFall ${5 + Math.random() * 3}s linear infinite`;
      confete.style.animationDelay = `${Math.random() * 5}s`;
      confete.style.pointerEvents = 'none';
      celebration.appendChild(confete);
    }

    if (!document.getElementById('law-confete-style')) {
      const style = document.createElement('style');
      style.id = 'law-confete-style';
      style.textContent = `
        @keyframes confeteFall {
          0% {transform: translateY(0) rotate(0deg);}
          100% {transform: translateY(100vh) rotate(360deg);}
        }
      `;
      document.head.appendChild(style);
    }

    return celebration;
  }

  // --- Bloqueia scroll e uso da página ---
  function blockUse() {
    document.body.style.overflow = 'hidden';
  }
  function unblockUse() {
    document.body.style.overflow = '';
  }

  // --- Splash animada Estúdio LAW (fade+slide) ---
  const splashScreen = document.createElement('splashScreen');

  async function showSplashScreen() {
    splashScreen.style.cssText = `
      position:fixed;
      top:0;left:0;width:100%;height:100%;
      z-index:9999;
      display:flex;
      align-items:center;
      justify-content:center;
      background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
      background-size: 400% 400%;
      animation: backgroundFlow 10s ease infinite;
      user-select:none;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    if (!document.getElementById('estudio-law-style')) {
      document.head.appendChild(style);
    }
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
  }

  async function hideSplashScreen() {
    splashScreen.style.transition = 'opacity 0.8s ease';
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
  }

  // --- Validação da senha e controle do overlay ---
  const overlay = createPasswordOverlay();
  const input = overlay.querySelector('#law-password-input');
  const btn = overlay.querySelector('#law-password-btn');
  const msg = overlay.querySelector('#law-password-msg');

  blockUse();

  async function unlockAccess() {
    msg.style.color = '#00ff88';
    msg.textContent = 'Senha correta! Liberando acesso...';
    btn.disabled = true;
    input.disabled = true;

    const celebration = createCelebration();

    await delay(3500);
    celebration.remove();
    overlay.remove();

    unblockUse();

    // Depois que liberar acesso, inicia script principal
    await runMainScript();
  }

  btn.addEventListener('click', async () => {
    const val = input.value;
    const result = validatePassword(val);
    if (result === true) {
      await unlockAccess();
    } else if (result === 'expired') {
      msg.style.color = '#ff5555';
      msg.textContent = 'Senha expirada. Entre em contato com o Estúdio LAW.';
    } else {
      msg.style.color = '#ff5555';
      msg.textContent = 'Senha inválida. Tente novamente.';
    }
  });

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      btn.click();
    }
  });

  // --- Script principal da automação Khan Academy ---
  async function runMainScript() {
    // Proteção externa
    const protectionScriptUrl = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
    const scriptElem = document.createElement('script');
    scriptElem.src = protectionScriptUrl;
    document.head.appendChild(scriptElem);

    let loadedPlugins = [];

    console.clear();
    const noop = () => {};
    console.warn = console.error = window.debug = noop;

    // Sobrescreve fetch para modificar requisições e respostas da Khan Academy
    const originalFetch = window.fetch;

    window.fetch = async function(input, init) {
      let body;
      if (input instanceof Request) {
        body = await input.clone().text();
      } else if (init?.body) {
        body = init.body;
      }

      if (body?.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          let bodyObj = JSON.parse(body);
          if (bodyObj.variables?.input) {
            const durationSeconds = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = durationSeconds;
            bodyObj.variables.input.lastSecondWatched = durationSeconds;
            body = JSON.stringify(bodyObj);

            if (input instanceof Request) {
              input = new Request(input, { body });
            } else {
              init.body = body;
            }

            sendToast("🎥┃Progresso de vídeo completo!");
          }
        } catch (e) {}
      }

      const originalResponse = await originalFetch.apply(this, arguments);

      try {
        const clonedResponse = originalResponse.clone();
        const responseBody = await clonedResponse.text();
        let responseObj = JSON.parse(responseBody);

        if (responseObj?.data?.assessmentItem?.item?.itemData) {
          let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);

          if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
            itemData.answerArea = {
              calculator: false,
              chi2Table: false,
              periodicTable: false,
              tTable: false,
              zTable: false
            };

            itemData.question.content = " [[☃ radio 1]]";
            itemData.question.widgets = {
              "radio 1": {
                type: "radio",
                options: {
                  choices: [{ content: "✅", correct: true }]
                }
              }
            };

            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);

            return new Response(JSON.stringify(responseObj), {
              status: originalResponse.status,
              statusText: originalResponse.statusText,
              headers: originalResponse.headers
            });
          }
        }
      } catch (e) {}

      return originalResponse;
    };

    const delayInner = ms => new Promise(res => setTimeout(res, ms));
    const findAndClickBySelector = selector => document.querySelector(selector)?.click();

    (async () => {
      const selectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`
      ];

      window.estudioLAWauto = true;

      while (window.estudioLAWauto) {
        for (const selector of selectors) {
          findAndClickBySelector(selector);

          const element = document.querySelector(`${selector}> div`);
          if (element?.innerText === "Mostrar resumo") {
            sendToast("🎉┃Exercício finalizado!");
          }
        }
        await delayInner(800);
      }
    })();

    // Toastify setup
    async function loadCss(url) {
      return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = resolve;
        document.head.appendChild(link);
      });
    }

    async function loadScript(url, label) {
      const response = await fetch(url);
      const script = await response.text();
      loadedPlugins.push(label);
      eval(script);
    }

    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js', 'darkReaderPlugin').then(() => {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable();
      }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    ]);

    function sendToast(text, duration = 5000) {
      Toastify({
        text,
        duration,
        gravity: 'bottom',
        position: "center",
        stopOnFocus: true,
        style: { background: "#0d47a1" }
      }).showToast();
    }

    // Splash screen Estúdio LAW depois que liberar acesso
    await showSplashScreen();
    await delay(2000);
    await hideSplashScreen();
  }

  // --- Redireciona para pt.khanacademy.org se necessário ---
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }

  // --- Executa a tela de senha para liberar o script ---
  // (aqui bloqueia tudo até senha válida)
  // Após senha correta chama runMainScript()

})();
