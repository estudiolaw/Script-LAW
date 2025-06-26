(async () => {
  // --- Lista de senhas válidas e vencimento ---
  const validPasswords = [
    { senha: '1BMIDIAS', vencimento: '2026-01-01' },
    { senha: '270425', vencimento: '2025-12-31' },
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
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999999;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: white;
      animation: fadeIn 1s ease-in-out;
      overflow: hidden;
    `;

    overlay.innerHTML = `
      <div style="background: linear-gradient(145deg, #0a1f2c, #004e8e); padding: 40px 50px; border-radius: 20px; box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3); text-align: center; width: 380px; animation: zoomIn 0.5s ease-in-out;">
        <h2 style="margin-bottom: 30px; font-weight: 700; color: #fff;">🔐 Acesso Restrito</h2>
        <div style="position: relative; margin-bottom: 30px;">
          <input id="law-password-input" type="password" placeholder="Digite a senha" style="width: 100%; padding: 14px 20px; font-size: 1.1em; border-radius: 10px; border: 2px solid #fff; outline: none; color: #fff; background: rgba(255, 255, 255, 0.2); transition: border-color 0.3s ease;">
          <span id="toggle-eye" style="position: absolute; right: 10px; top: 10px; font-size: 1.5em; cursor: pointer; color: #fff;">👁️</span>
        </div>
        <button id="law-password-btn" style="width: 100%; padding: 14px 0; background: #00bcd4; border: none; border-radius: 10px; font-size: 1.2em; color: white; cursor: pointer; font-weight: 600; transition: background 0.3s ease; margin-bottom: 20px;">Entrar</button>
        <p id="law-password-msg" style="margin-top: 15px; color: #ff5555; font-weight: 600;"></p>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  // --- Valida senha ---
  function validatePassword(input) {
    const now = new Date();
    const userSenha = input.trim();
    
    for (const obj of validPasswords) {
      if (obj.senha === userSenha) {
        const expiry = new Date(obj.vencimento + 'T23:59:59');
        if (now <= expiry) {
          return true;
        } else {
          return 'expired';
        }
      }
    }
    return false;
  }

  // --- Cria tela comemoração ---
  function createCelebration() {
    const celebration = document.createElement('div');
    celebration.id = 'law-celebration';
    celebration.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0, 0, 0, 0.6);
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

    return celebration;
  }

  // --- Bloqueia scroll e uso da página ---
  function blockUse() {
    document.body.style.overflow = 'hidden';
  }
  function unblockUse() {
    document.body.style.overflow = '';
  }

  // --- Efeito de fogos de artifício ---
  function addFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.id = 'fireworks-container';
    fireworksContainer.style.position = 'fixed';
    fireworksContainer.style.top = '0';
    fireworksContainer.style.left = '0';
    fireworksContainer.style.width = '100vw';
    fireworksContainer.style.height = '100vh';
    fireworksContainer.style.pointerEvents = 'none';
    document.body.appendChild(fireworksContainer);

    for (let i = 0; i < 20; i++) {
      const firework = document.createElement('div');
      firework.classList.add('firework');
      firework.style.position = 'absolute';
      firework.style.width = '10px';
      firework.style.height = '10px';
      firework.style.borderRadius = '50%';
      firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      firework.style.animation = `fireworkAnim ${Math.random() * 4 + 2}s linear infinite`;
      firework.style.top = `${Math.random() * 100}vh`;
      firework.style.left = `${Math.random() * 100}vw`;
      fireworksContainer.appendChild(firework);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fireworkAnim {
        0% { transform: scale(0) translateY(0); opacity: 1; }
        100% { transform: scale(3) translateY(-150vh); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // --- Validação da senha e controle do overlay ---
  const overlay = createPasswordOverlay();
  const input = overlay.querySelector('#law-password-input');
  const btn = overlay.querySelector('#law-password-btn');
  const msg = overlay.querySelector('#law-password-msg');
  const eyeIcon = overlay.querySelector('#toggle-eye');

  blockUse();

  // Função para alternar visibilidade da senha
  eyeIcon.addEventListener('click', () => {
    if (input.type === 'password') {
      input.type = 'text';
      eyeIcon.textContent = '🙈'; // Emoji de "olho fechado"
    } else {
      input.type = 'password';
      eyeIcon.textContent = '👁️'; // Emoji de "olho aberto"
    }
  });

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

    // Depois que liberar acesso, para os fogos de artifício
    document.getElementById('fireworks-container').remove();

    // Inicia o script principal
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
    const protectionScriptUrl = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
    const scriptElem = document.createElement('script');
    scriptElem.src = protectionScriptUrl;
    document.head.appendChild(scriptElem);

    let
