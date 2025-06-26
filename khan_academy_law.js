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
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0,0,0,0.8); display: flex;
      justify-content: center; align-items: center; overflow: hidden;
      z-index: 9999999; font-family: 'Segoe UI', sans-serif; color: #fff;
      animation: fadeIn 1s ease-in-out;
    `;
    overlay.innerHTML = `
      <div style="
        background: linear-gradient(145deg,#0a1f2c,#004e8e);
        padding:40px 50px;border-radius:20px;
        box-shadow:0 0 30px rgba(0,0,0,0.3);
        text-align:center;width:380px;
        animation: zoomIn 0.5s ease-in-out;
      ">
        <h2 style="margin-bottom:30px;font-weight:700;">🔐 Acesso Restrito</h2>
        <div style="position:relative;margin-bottom:30px;">
          <input id="law-password-input" type="password" placeholder="Digite a senha"
            style="
              width:100%;padding:14px 20px;font-size:1.1em;
              border-radius:10px;border:2px solid #fff;
              background:rgba(255,255,255,0.2);color:#fff;
              outline:none;transition:border-color .3s;
            ">
          <span id="toggle-eye" style="
            position:absolute;right:10px;top:10px;
            font-size:1.5em;cursor:pointer;
          ">👁️</span>
        </div>
        <button id="law-password-btn" style="
          width:100%;padding:14px 0;background:#00bcd4;
          border:none;border-radius:10px;font-size:1.2em;
          font-weight:600;cursor:pointer;transition:background .3s;
          margin-bottom:10px;
        ">Entrar</button>
        <p id="law-madeby" style="
          margin:5px 0 20px;font-size:.9em;
          animation: colorChange 2s infinite;
        ">Feito por: Estúdio LAW</p>
        <p id="law-password-msg" style="font-weight:600;height:1.2em;"></p>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  // --- Valida senha ---
  function validatePassword(input) {
    const now = new Date();
    for (const { senha, vencimento } of validPasswords) {
      if (senha === input.trim()) {
        return now <= new Date(vencimento + 'T23:59:59') ? true : 'expired';
      }
    }
    return false;
  }

  // --- Tela comemoração ---
  function createCelebration() {
    const c = document.createElement('div');
    c.id = 'law-celebration';
    c.style.cssText = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;
      background-color:rgba(0,0,0,0.6);display:flex;
      justify-content:center;align-items:center;flex-direction:column;
      color:#00aaff;font-family:'Segoe UI',sans-serif;z-index:99999999;
    `;
    c.innerHTML = `
      <div style="font-size:4em;font-weight:900;text-shadow:0 0 15px #00aaffaa;">🎉</div>
      <h1 style="margin:20px 0 10px;">Acesso Liberado!</h1>
      <p style="font-size:1.2em;">Bem-vindo ao Estúdio LAW!</p>
    `;
    document.body.appendChild(c);
    return c;
  }

  // --- Bloqueia / libera scroll ---
  function blockUse() { document.body.style.overflow = 'hidden'; }
  function unblockUse() { document.body.style.overflow = ''; }

  // --- Fogos de artifício realistas e multicolor ---
  function addFireworks() {
    const container = document.createElement('div');
    container.id = 'fireworks-container';
    Object.assign(container.style, {
      position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
      pointerEvents:'none',overflow:'hidden',zIndex:9999998
    });
    document.body.appendChild(container);

    // animações CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rocket {
        0% { transform: translateY(0); opacity:1; }
        90% { opacity:1; }
        100% { transform: translateY(-80vh); opacity:0; }
      }
      @keyframes spark {
        from { transform: scale(1); opacity:1; }
        to { transform: scale(0); opacity:0; }
      }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes zoomIn { from{transform:scale(0.8)} to{transform:scale(1)} }
      @keyframes colorChange {
        0%,100% { color: #fff }
        50% { color: #00bcd4 }
      }
    `;
    document.head.appendChild(style);

    let running = true;
    function launch() {
      if (!running) return;
      // foguete
      const rocket = document.createElement('div');
      const hue = Math.random()*360;
      Object.assign(rocket.style, {
        position:'absolute', bottom:0,
        left:`${10 + Math.random()*80}vw`,
        width:'3px', height:'15px',
        background:`hsl(${hue},100%,80%)`,
        borderRadius:'2px',
        animation:`rocket ${1.2 + Math.random()*0.8}s linear forwards`
      });
      container.appendChild(rocket);

      rocket.addEventListener('animationend', () => {
        // cria explosão
        const count = 15 + Math.floor(Math.random()*10);
        for (let i=0; i<count; i++) {
          const spark = document.createElement('div');
          const angle = Math.random()*Math.PI*2;
          const dist = 50 + Math.random()*50;
          Object.assign(spark.style, {
            position:'absolute',
            left: rocket.offsetLeft + 'px',
            top: (window.innerHeight - rocket.getBoundingClientRect().top) + 'px',
            width:'4px', height:'4px',
            background:`hsl(${hue},100%,80%)`,
            borderRadius:'50%',
            animation:`spark 0.8s ease-out forwards`
          });
          container.appendChild(spark);
          // movimenta
          let t=0;
          const vx = Math.cos(angle)*dist;
          const vy = Math.sin(angle)*dist;
          const mv = setInterval(() => {
            t += 16;
            spark.style.transform = `translate(${vx*t/800}px, ${-vy*t/800}px)`;
            if (t>=800) clearInterval(mv);
          },16);
          spark.addEventListener('animationend', () => spark.remove());
        }
        rocket.remove();
      });

      // próxima em atraso aleatório
      setTimeout(launch, 300 + Math.random()*700);
    }

    launch();
    return () => running = false;
  }

  // --- Monta overlay e lógica ---
  const overlay = createPasswordOverlay();
  const input   = overlay.querySelector('#law-password-input');
  const btn     = overlay.querySelector('#law-password-btn');
  const msg     = overlay.querySelector('#law-password-msg');
  const eye     = overlay.querySelector('#toggle-eye');
  const stopFW  = addFireworks();

  blockUse();

  eye.addEventListener('click', () => {
    if (input.type==='password') { input.type='text'; eye.textContent='🙈'; }
    else { input.type='password'; eye.textContent='👁️'; }
  });

  btn.addEventListener('click', async () => {
    const res = validatePassword(input.value);
    if (res===true) {
      msg.style.color='#0f0'; msg.textContent='Senha correta! Liberando...';
      btn.disabled=input.disabled=true;
      const c = createCelebration();
      await delay(3000);
      c.remove(); overlay.remove(); unblockUse();
      stopFW(); document.getElementById('fireworks-container')?.remove();
      showEstudioLaw();
    } else if (res==='expired') {
      msg.style.color='#f55'; msg.textContent='Senha expirada. Entre em contato com o Estúdio LAW.';
    } else {
      msg.style.color='#f55'; msg.textContent='Senha inválida. Tente novamente.';
    }
  });

  input.addEventListener('keydown', e => { if (e.key==='Enter') btn.click(); });

  // --- Painel "Estúdio LAW" pós-senha ---
  function showEstudioLaw() {
    const splash = document.createElement('div');
    Object.assign(splash.style, {
      position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
      display:'flex',justifyContent:'center',alignItems:'center',
      background:'linear-gradient(-45deg,#0f1c2e,#0a1a2f,#152842,#0a1b2d)',
      backgroundSize:'400% 400%',animation:'backgroundFlow 10s ease infinite',
      zIndex:9999997,fontFamily:'Segoe UI,sans-serif'
    });
    splash.innerHTML = `
      <div style="
        font-size:3em;font-weight:bold;color:#fff;
        text-shadow:0 0 10px #00aaff,0 0 20px #0077cc;
        animation:glowText 2s ease-in-out infinite alternate,
                   fadeSlideIn 1.5s ease forwards;
        opacity:0;transform:translateY(30px);
      ">
        Estúdio <span style="color:#00aaff">LAW</span>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes backgroundFlow {
        0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}
      }
      @keyframes glowText { from{text-shadow:0 0 10px #00aaff} to{text-shadow:0 0 30px #00ccff} }
      @keyframes fadeSlideIn { to{opacity:1;transform:translateY(0);} }
    `;
    document.head.appendChild(style);
    document.body.appendChild(splash);
    setTimeout(()=> splash.style.opacity='1',10);
    setTimeout(()=>{
      splash.style.transition='opacity .8s'; splash.style.opacity='0';
      setTimeout(()=> splash.remove(),1000);
    },2000);
  }

  // --- Redireciona se não for Khan Academy ---
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(location.href)) {
    location.href = "https://pt.khanacademy.org/";
  }
})();
