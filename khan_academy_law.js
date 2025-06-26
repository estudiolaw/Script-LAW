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
      display: flex; justify-content: center; align-items: center;
      z-index: 9999999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: white; animation: fadeIn 1s ease-in-out; overflow: hidden;
    `;

    overlay.innerHTML = `
      <div style="background: linear-gradient(145deg, #0a1f2c, #004e8e);
                  padding: 40px 50px; border-radius: 20px;
                  box-shadow: 0 0 30px rgba(0,0,0,0.3);
                  text-align: center; width: 380px;
                  animation: zoomIn 0.5s ease-in-out;">
        <h2 style="margin-bottom: 30px; font-weight: 700; color: #fff;">
          🔐 Acesso Restrito
        </h2>
        <div style="position: relative; margin-bottom: 30px;">
          <input id="law-password-input" type="password" placeholder="Digite a senha"
            style="width: 100%; padding: 14px 20px; font-size: 1.1em;
                   border-radius: 10px; border: 2px solid #fff;
                   outline: none; color: #fff; background: rgba(255,255,255,0.2);
                   transition: border-color 0.3s ease;">
          <span id="toggle-eye"
            style="position: absolute; right: 10px; top: 10px;
                   font-size: 1.5em; cursor: pointer; color: #fff;">
            👁️
          </span>
        </div>
        <button id="law-password-btn"
          style="width: 100%; padding: 14px 0; background: #00bcd4;
                 border: none; border-radius: 10px; font-size: 1.2em;
                 color: white; cursor: pointer; font-weight: 600;
                 transition: background 0.3s ease; margin-bottom: 10px;">
          Entrar
        </button>
        <p style="margin: 5px 0 20px; font-size: 0.9em; color: #ccc;">
          Feito por: Estúdio LAW
        </p>
        <p id="law-password-msg"
           style="margin-top: 5px; color: #ff5555; font-weight: 600;">
        </p>
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
        return now <= expiry ? true : 'expired';
      }
    }
    return false;
  }

  // --- Cria tela comemoração ---
  function createCelebration() {
    const celebration = document.createElement('div');
    celebration.id = 'law-celebration';
    celebration.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0,0,0,0.6); display: flex;
      justify-content: center; align-items: center;
      z-index: 99999999; flex-direction: column;
      color: #00aaff; font-family: 'Segoe UI', sans-serif;
    `;
    celebration.innerHTML = `
      <div style="font-size: 4em; font-weight: 900;
                  text-shadow: 0 0 15px #00aaffaa;">🎉</div>
      <h1 style="margin: 20px 0 10px;">Acesso Liberado!</h1>
      <p style="font-size: 1.2em;">Bem-vindo ao Estúdio LAW!</p>
    `;
    document.body.appendChild(celebration);
    return celebration;
  }

  // --- Bloqueia / desbloqueia scroll ---
  function blockUse() { document.body.style.overflow = 'hidden'; }
  function unblockUse() { document.body.style.overflow = ''; }

  // --- Fogos de artifício com explosões brancas ---
  function addFireworks() {
    const container = document.createElement('div');
    container.id = 'fireworks-container';
    Object.assign(container.style, {
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      pointerEvents: 'none', overflow: 'hidden',
      zIndex: 9999998
    });
    document.body.appendChild(container);

    for (let i = 0; i < 8; i++) {
      const fw = document.createElement('div');
      fw.classList.add('firework');
      Object.assign(fw.style, {
        position: 'absolute', width: '8px', height: '8px',
        background: 'white', borderRadius: '50%',
        top: `${20 + Math.random()*60}vh`,
        left: `${Math.random()*100}vw`,
        animation: `fireworkExplode ${2 + Math.random()*1.5}s ease-in-out infinite`
      });
      container.appendChild(fw);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fireworkExplode {
        0%   {transform: scale(0); opacity: 1;}
        30%  {transform: scale(3); opacity: 0.8;}
        60%  {opacity: 0.4;}
        100% {transform: scale(0); opacity: 0;}
      }
      @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
      @keyframes zoomIn { from {transform:scale(0.8);} to {transform:scale(1);} }
    `;
    document.head.appendChild(style);
  }

  // --- Monta o overlay ---
  const overlay = createPasswordOverlay();
  const input   = overlay.querySelector('#law-password-input');
  const btn     = overlay.querySelector('#law-password-btn');
  const msg     = overlay.querySelector('#law-password-msg');
  const eye     = overlay.querySelector('#toggle-eye');

  blockUse();
  addFireworks();

  // alterna visibilidade da senha
  eye.addEventListener('click', () => {
    if (input.type === 'password') {
      input.type = 'text'; eye.textContent = '🙈';
    } else {
      input.type = 'password'; eye.textContent = '👁️';
    }
  });

  // tenta liberar acesso
  btn.addEventListener('click', async () => {
    const result = validatePassword(input.value);
    if (result === true) {
      msg.style.color = '#00ff88';
      msg.textContent = 'Senha correta! Liberando acesso...';
      btn.disabled = input.disabled = true;

      const celebration = createCelebration();
      await delay(3500);
      celebration.remove();
      overlay.remove();
      unblockUse();
      document.getElementById('fireworks-container')?.remove();
      showEstudioLaw();
    } else if (result === 'expired') {
      msg.style.color = '#ff5555';
      msg.textContent = 'Senha expirada. Entre em contato com o Estúdio LAW.';
    } else {
      msg.style.color = '#ff5555';
      msg.textContent = 'Senha inválida. Tente novamente.';
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });

  // --- Painel "Estúdio LAW" pós-senha ---
  function showEstudioLaw() {
    const splash = document.createElement('div');
    Object.assign(splash.style, {
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d)',
      backgroundSize: '400% 400%', animation: 'backgroundFlow 10s ease infinite',
      zIndex: 9999997, fontFamily: 'Segoe UI, sans-serif'
    });
    splash.innerHTML = `
      <div style="
        font-size: 3em; font-weight: bold; color: #fff;
        text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
        animation: glowText 2s ease-in-out infinite alternate,
                   fadeSlideIn 1.5s ease forwards;
        opacity: 0; transform: translateY(30px);
      ">
        Estúdio <span style="color:#00aaff">LAW</span>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes backgroundFlow {
        0% {background-position:0% 50%;}
        50%{background-position:100% 50%;}
        100%{background-position:0% 50%;}
      }
      @keyframes glowText {
        from{text-shadow:0 0 10px #00aaff;} 
        to{text-shadow:0 0 30px #00ccff;}
      }
      @keyframes fadeSlideIn {
        to{opacity:1; transform:translateY(0);}
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(splash);
    setTimeout(()=> splash.style.opacity='1',10);
    setTimeout(()=>{
      splash.style.transition='opacity 0.8s';
      splash.style.opacity='0';
      setTimeout(()=> splash.remove(),1000);
    },2000);
  }

  // --- Redireciona se não for Khan Academy ---
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(location.href)) {
    location.href = "https://pt.khanacademy.org/";
  }
})();
