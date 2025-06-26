// == Estúdio LAW - BIAI Resolver Automático + DARK MODE ==
// Autor: Wesley1w2e

(() => {
  const username = "AlunoLAW";
  const UID = Math.floor(Math.random() * 90000 + 10000);
  let questoesResolvidas = 0;

  // Anti-F12 e DevTools
  document.addEventListener("keydown", (e) => {
    if ((e.key === "F12") || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key))) {
      e.preventDefault();
    }
  });

  // Splash Estúdio LAW
  const splashScreen = document.createElement('splashScreen');
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
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    if (!document.getElementById('estudio-law-style')) {
      document.head.appendChild(style);
    }
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
  }

  async function hideEstudioLawSplash() {
    splashScreen.style.transition = 'opacity 0.8s ease';
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
  }

  // Estilo geral: modo dark + painel
  const style = document.createElement("style");
  style.innerHTML = `
    body, html {
      background-color: #0e0e0e !important;
      color: #00ffcc !important;
    }
    * {
      border-color: #333 !important;
    }
    #law-panel {
      position: fixed;
      top: 10px; left: 10px;
      background: #000000cc;
      color: #00ffcc;
      padding: 10px 20px;
      font-family: monospace;
      border-radius: 10px;
      box-shadow: 0 0 10px #00ffff;
      z-index: 9999;
    }
    .resposta-certa {
      border: 3px solid #00ff88 !important;
      background: rgba(0, 255, 136, 0.1) !important;
      border-radius: 10px !important;
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 5px #00ff88; }
      50% { box-shadow: 0 0 15px #00ff88; }
      100% { box-shadow: 0 0 5px #00ff88; }
    }
  `;
  document.head.appendChild(style);

  const painel = document.createElement("div");
  painel.id = "law-panel";
  painel.innerHTML = `
    👤 ${username} | UID: ${UID}<br>
    🧠 Questões resolvidas: <span id="qtd">0</span>
  `;

  // Delay realista
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Simular clique verdadeiro
  function clickSimulado(element) {
    const evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(evt);
  }

  // Resolver a questão automaticamente
  async function resolverQuestao() {
    const alternativas = document.querySelectorAll("li.alternativa");
    for (let alt of alternativas) {
      const texto = alt.innerText.toLowerCase();
      const ehCerta = texto.includes("correta") || texto.includes("é essa") || texto.includes("resposta certa") || alt.getAttribute("data-resposta") === "certa";
      if (ehCerta) {
        alt.classList.add("resposta-certa");
        await delay(1000); // espera um pouco
        clickSimulado(alt); // clica na certa
        questoesResolvidas++;
        document.getElementById("qtd").innerText = questoesResolvidas;
        break;
      }
    }

    await delay(2000);
    const btnProx = [...document.querySelectorAll("button, a")].find(el =>
      /próxima|continuar|avançar/i.test(el.innerText)
    );
    if (btnProx) {
      clickSimulado(btnProx);
    }
  }

  // Observador que ativa quando muda de questão
  const observer = new MutationObserver(() => resolverQuestao());
  observer.observe(document.body, { childList: true, subtree: true });

  // Execução principal
  (async () => {
    await showEstudioLawSplash();
    await delay(2500);
    await hideEstudioLawSplash();
    document.body.appendChild(painel);
    resolverQuestao(); // primeira vez
  })();
})();
