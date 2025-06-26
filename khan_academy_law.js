(async function() {
  const VALID_UNTIL = "2025-12-31";
  const PASSWORDS = [
    "law2025@1", "khanlaw!2", "stud1oLAW", "wesleyx2025", "projetoblue",
    "lawaccess23", "segredoLAW", "unlockkhan", "estudiopass", "lawpremium"
  ];

  // Função delay útil
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Painel de senha animado
  function showAnimatedPasswordPanel() {
    return new Promise((resolve, reject) => {
      const today = new Date();
      const validDate = new Date(VALID_UNTIL + "T23:59:59");
      if (today > validDate) {
        alert("Acesso expirado! Procure o Estúdio LAW.");
        reject("Expirado");
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = "estudiolaw-password-overlay";
      overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000000;
        background:linear-gradient(-45deg,#1e3c72,#2a5298,#0f2027,#232526,#1e3c72);
        background-size:400% 400%;animation:lawBgFlow 7s ease-in-out infinite alternate;
        display:flex;align-items:center;justify-content:center;
      `;

      const panel = document.createElement('div');
      panel.style = `
        background:rgba(18,43,70,0.93);
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

  // Splash animado do Estúdio LAW
  const splashScreen = document.createElement('div');

  async function showEstudioLawSplash() {
    splashScreen.style.cssText = `
      position:fixed;
      top:0; left:0; width:100%; height:100%;
      z-index:9999;
      display:flex;
      align-items:center;
      justify-content:center;
      background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
      background-size: 400% 400%;
      animation: backgroundFlow 10s ease infinite;
      user-select:none;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      opacity: 1;
      transition: opacity 0.8s ease;
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

    // forçar animação fadeSlideIn (opacity e translateY)
    setTimeout(() => {
      const text = splashScreen.querySelector("#estudio-law-text");
      if(text) {
        text.style.opacity = '1';
        text.style.transform = 'translateY(0)';
      }
    }, 10);
  }

  async function hideEstudioLawSplash() {
    splashScreen.style.opacity = '0';
    await delay(1000);
    splashScreen.remove();
  }

  // Função para carregar scripts externos e CSS
  async function loadScript(url, label) {
    const response = await fetch(url);
    const scriptText = await response.text();
    eval(scriptText);
  }

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

  // Função para enviar toast (toastify)
  function sendToast(text, duration = 3000) {
    Toastify({
      text,
      duration,
      gravity: "bottom",
      position: "center",
      stopOnFocus: true,
      style: { background: "#000000" }
    }).showToast();
  }

  // Executa painel de senha
  await showAnimatedPasswordPanel();

  // Se acertar a senha, mostra toast de boas-vindas
  sendToast("🎉 Bem-vindo ao Estúdio LAW!", 3500);

  // Espera o toast desaparecer
  await delay(3500);

  // Mostra a abertura animada Estúdio LAW
  await showEstudioLawSplash();

  // Mantém a splash 3 segundos (tempo que quiser)
  await delay(3000);

  await hideEstudioLawSplash();

  // === Começa script Khan Academy ===
  const scriptProtection = document.createElement('script');
  scriptProtection.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
  document.head.appendChild(scriptProtection);

  // Importa CSS e Toastify e DarkReader
  await Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js'),
    loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js'),
  ]);

  setupMain();

  function setupMain() {
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

            sendToast("🔓┃Vídeo explorado.", 1000);
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

            itemData.question.content = " " + `[[☃ radio 1]]`;
            itemData.question.widgets = {
              "radio 1": {
                type: "radio",
                options: {
                  choices: [
                    { content: "Wesley o Brabo", correct: true },
                    { content: "Opção errada 1", correct: false }
                  ]
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

    (async () => {
      const selectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`,
        `[data-testid="exercise-next-question"]`,
        `._1udzurba`,
        `._awve9b`
      ];

      window.khanwareDominates = true;

      while (window.khanwareDominates) {
        for (const selector of selectors) {
          document.querySelector(selector)?.click();

          const element = document.querySelector(`${selector} > div`);
          if (element?.innerText === "Mostrar resumo") {
            sendToast("🎉┃Exercício concluído!", 3000);
          }
        }
        await delay(800);
      }
    })();
  }

  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    window.location.href = "https://pt.khanacademy.org/";
  }
})();
