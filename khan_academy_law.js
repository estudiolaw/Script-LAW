(async () => {
  // Versão e repo base do Khanware
  const ver = "V3.1.1";
  let isDev = false;
  const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

  // Detecta dispositivo Apple e mobile
  let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
  };

  // Usuário (vai preencher depois via API)
  let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
  };

  // Toastify CSS e biblioteca
  async function loadCss(url) {
    return new Promise(resolve => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }

  async function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Splash Screen Estúdio LAW - Azul Dark com animação fade+slide
  const splashScreen = document.createElement('div');
  splashScreen.id = "law-splash";
  splashScreen.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 999999; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
    background-size: 400% 400%;
    animation: backgroundFlow 10s ease infinite;
    user-select: none;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    opacity: 0; transition: opacity 0.8s ease;
  `;
  splashScreen.innerHTML = `
    <div style="
      font-size: 3em; font-weight: bold; color: #fff;
      text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
      animation: glowText 2s ease-in-out infinite alternate,
                 fadeSlideIn 1.5s ease forwards;
      opacity: 0; transform: translateY(30px);
    ">
      Estúdio <span style="color:#00aaff;">LAW</span>
    </div>
  `;

  // Animações CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes backgroundFlow {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }
    @keyframes glowText {
      from {text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;}
      to {text-shadow: 0 0 20px #00ccff, 0 0 30px #00aaff;}
    }
    @keyframes fadeSlideIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(splashScreen);

  // Fade in splash
  await new Promise(r => setTimeout(r, 50));
  splashScreen.style.opacity = '1';
  splashScreen.querySelector('div').style.opacity = '1';
  splashScreen.querySelector('div').style.transform = 'translateY(0)';

  // Segurança básica
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key))) {
      e.preventDefault();
    }
  });

  // Espera 3 segundos na splash
  await new Promise(r => setTimeout(r, 3000));

  // Remove splash com fade out
  splashScreen.style.opacity = '0';
  await new Promise(r => setTimeout(r, 900));
  splashScreen.remove();

  // Carrega Toastify para toasts
  await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/toastify-js');

  // Função toast simples
  function sendToast(text, duration=4000, gravity='bottom') {
    Toastify({
      text,
      duration,
      gravity,
      position: "center",
      style: { background: "#000000" },
      stopOnFocus: true
    }).showToast();
  }

  // Aviso inicial
  sendToast("🌿 Khanware LAW Edition Injetado com sucesso!");

  // Pega dados do usuário Khan Academy
  try {
    const res = await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
        "x-ka-fkey": "1",
      },
      credentials: "include",
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
      }),
    });

    const data = await res.json();
    if (data?.data?.user) {
      user.nickname = data.data.user.nickname || "Usuário";
      user.username = data.data.user.username || "Username";
      user.UID = data.data.user.id?.slice(-5) || 0;
    }
  } catch(e) {
    console.warn("Falha ao buscar perfil:", e);
  }

  sendToast(`⭐ Bem vindo(a), ${user.nickname}!`);

  // Função que responde automaticamente questões no Khan Academy (autoAnswer)
  async function autoAnswer() {
    // Espera o DOM estar pronto e pergunta aparecer
    const waitForQuestion = () => new Promise(resolve => {
      const observer = new MutationObserver(mutations => {
        const q = document.querySelector('.q-text, .question-text');
        if (q) {
          observer.disconnect();
          resolve(q);
        }
      });
      observer.observe(document.body, {childList:true, subtree:true});
      // Timeout fallback
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 15000);
    });

    // Aguarda aparecer pergunta
    const question = await waitForQuestion();
    if (!question) return;

    // Aguarda carregar alternativas
    const waitForAnswers = () => new Promise(resolve => {
      const observer = new MutationObserver(() => {
        const answers = document.querySelectorAll('[data-test="answer-text"], .answer-text');
        if (answers.length > 0) {
          observer.disconnect();
          resolve(answers);
        }
      });
      observer.observe(document.body, {childList:true, subtree:true});
      setTimeout(() => {
        observer.disconnect();
        resolve([]);
      }, 10000);
    });

    const answers = await waitForAnswers();
    if (answers.length === 0) return;

    // Lógica para marcar a resposta correta automaticamente:
    // A Khan Academy geralmente marca o botão da resposta certa com 'correct' na classe, ou tem um atributo data-correct
    // Vamos buscar por algo assim e destacar visualmente (mas sem clicar pra que o aluno clique)

    // Busca o botão pai da alternativa correta
    let correctButton = null;

    answers.forEach(answer => {
      // Pode haver atributo 'data-correct' ou classe com 'correct'
      if (answer.closest('button[data-correct="true"], button.correct, button[aria-pressed="true"]')) {
        correctButton = answer.closest('button');
      }
      // Se o texto tiver 'Resposta Correta' ou similar (fallback)
      if (!correctButton && /correta/i.test(answer.textContent)) {
        correctButton = answer.closest('button');
      }
    });

    if (!correctButton) {
      // Tentativa alternativa:
      // Em quizzes do Khan Academy, o botão da resposta certa pode ter aria-pressed=true ou 'selected' em classes
      const allButtons = document.querySelectorAll('button');
      allButtons.forEach(btn => {
        if (btn.getAttribute('aria-pressed') === 'true' || btn.classList.contains('correct')) {
          correctButton = btn;
        }
      });
    }

    // Se achou botão correto, destaque para o aluno clicar (não clicar automático para computar no Khan Academy)
    if (correctButton) {
      // Adiciona borda e sombra azul para destacar
      correctButton.style.outline = "3px solid #00aaff";
      correctButton.style.boxShadow = "0 0 10px #00aaff";

      sendToast("💡 Resposta correta destacada. Clique para responder!");

      // Pode repetir após X segundos (se quiser automatizar isso)
      setTimeout(autoAnswer, 5000); // verifica de novo para próxima pergunta
    } else {
      // Se não achou botão, tenta de novo em 5s
      setTimeout(autoAnswer, 5000);
    }
  }

  // Inicializa a auto resposta se ativada
  if (window.features.autoAnswer === undefined) window.features.autoAnswer = true;

  if (window.features.autoAnswer) {
    autoAnswer();
  }

  // Carregamento dos scripts visuais do Khanware
  async function setupMenu() {
    await loadScript(repoPath+'visuals/mainMenu.js');
    await loadScript(repoPath+'visuals/statusPanel.js');
    await loadScript(repoPath+'visuals/widgetBot.js');
    if (isDev) await loadScript(repoPath+'visuals/devTab.js');
  }

  async function setupMain() {
    await loadScript(repoPath+'functions/questionSpoof.js');
    await loadScript(repoPath+'functions/videoSpoof.js');
    await loadScript(repoPath+'functions/minuteFarm.js');
    await loadScript(repoPath+'functions/spoofUser.js');
    await loadScript(repoPath+'functions/answerRevealer.js');
    await loadScript(repoPath+'functions/rgbLogo.js');
    await loadScript(repoPath+'functions/customBanner.js');
    await loadScript(repoPath+'functions/autoAnswer.js');
  }

  // Setup completo
  await setupMenu();
  await setupMain();

  console.clear();
  console.log(`Khanware LAW Edition v${ver} - AutoAnswer ativo e splash animada OK!`);

})();
