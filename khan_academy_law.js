// Estúdio LAW - Script Final com Login Hash + Token, Fogo, Sem Som e Automação Khan Academy (sem automação automática)
(async () => {
  // --- CONFIGURAÇÃO ---
  const FIREBASE_URL = 'https://estudiolaw-default-rtdb.firebaseio.com/logins.json';

  // --- ANTI DEVTOOLS AVANÇADO ---
  const detectDevTools = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = '<div style="color:red;font-size:2em;text-align:center;padding-top:20vh">DevTools detectado. Bloqueado.</div>';
      throw new Error('DevTools bloqueado');
    }
  };
  setInterval(detectDevTools, 1000);

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const sha256 = async msg => {
    const msgBuffer = new TextEncoder().encode(msg);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // --- TELA DE LOGIN COM SENHA ---
  const createLoginOverlay = () => {
    const el = document.createElement('div');
    el.id = 'law-login';
    el.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#001a33dd;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999999;font-family:sans-serif">
        <h2 style="margin-bottom:20px">🔒 Estúdio LAW - Acesso Seguro</h2>
        <input id="senha" type="password" placeholder="Digite a senha" style="padding:10px;width:250px;border:none;border-radius:8px;font-size:1.1em" />
        <button id="entrar" style="margin-top:10px;padding:10px 20px;background:#00aaff;color:white;border:none;border-radius:6px;cursor:pointer">Entrar</button>
        <p id="mensagem" style="margin-top:15px;font-weight:bold;color:#ff5555"></p>
      </div>
    `;
    document.body.appendChild(el);
    return el;
  };

  // --- TELA COMEMORAÇÃO E FOGO (SEM SOM) ---
  const showOpening = () => {
    const fogo = document.createElement('div');
    fogo.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;background:black url('https://media.giphy.com/media/iJHZHfTt7PHEc/giphy.gif') center/cover no-repeat;display:flex;align-items:center;justify-content:center">
        <h1 style="font-size:3em;color:#00ccff;text-shadow:0 0 20px #00aaff">🔥 Estúdio LAW 🔥</h1>
      </div>
    `;
    document.body.appendChild(fogo);
    setTimeout(() => fogo.remove(), 5000);
  };

  const showCelebration = () => {
    const c = document.createElement('div');
    c.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#001f3fcc;z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-size:2em">
        <div>🎉 Acesso Liberado!</div>
      </div>
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  };

  // --- VALIDAÇÃO DE SENHA ---
  const validar = async (senhaDigitada, lista) => {
    const hash = await sha256(senhaDigitada);
    const hoje = new Date();
    const dados = lista[hash];
    if (!dados) return false;
    if (new Date(dados.vencimento + 'T23:59:59') < hoje) return 'expirada';
    return dados.token;
  };

  const login = createLoginOverlay();
  const input = login.querySelector('#senha');
  const btn = login.querySelector('#entrar');
  const msg = login.querySelector('#mensagem');

  const listaSenhas = await fetch(FIREBASE_URL).then(r => r.json());

  btn.onclick = async () => {
    const s = input.value;
    const token = await validar(s, listaSenhas);
    if (token && token !== 'expirada') {
      login.remove();
      showCelebration();
      await delay(3000);
      showOpening();
      await delay(5000);
      iniciarAutomacao(token);
    } else if (token === 'expirada') {
      msg.textContent = 'Senha expirada. Solicite nova ao suporte';
    } else {
      msg.textContent = 'Senha inválida. Tente novamente';
    }
  };

  // --- SCRIPT DE AUTOMAÇÃO KHAN ACADEMY (auto click DESATIVADO) ---
  async function iniciarAutomacao(token) {
    console.log('Token validado:', token);

    const delayLoop = ms => new Promise(res => setTimeout(res, ms));
    const autoClick = () => {
      const selectors = [
        '[data-testid="choice-icon__library-choice-icon"]',
        '[data-testid="exercise-check-answer"]',
        '[data-testid="exercise-next-question"]',
        '._1udzurba',
        '._awve9b'
      ];
      selectors.forEach(sel => {
        const btn = document.querySelector(sel);
        if (btn) btn.click();
      });
    };

    const patchFetch = () => {
      const oldFetch = window.fetch;
      window.fetch = async (...args) => {
        if (args[1]?.body?.includes('updateUserVideoProgress')) {
          const body = JSON.parse(args[1].body);
          const d = body.variables.input.durationSeconds;
          body.variables.input.secondsWatched = d;
          body.variables.input.lastSecondWatched = d;
          args[1].body = JSON.stringify(body);
        }
        return oldFetch(...args);
      };
    };

    patchFetch();

    // Loop comentado para DESATIVAR automação automática
    /*
    while (true) {
      autoClick();
      await delayLoop(1000);
    }
    */
  }
})();
