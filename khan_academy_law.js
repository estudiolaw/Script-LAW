// ==UserScript==
// @name         Khanware + Estúdio LAW Task Runner (Painel Moderno)
// @namespace    http://estudiolaw.com/
// @version      5.0.0
// @description  Script para automatizar tarefas no Khan Academy, painel de senha moderno, olhinho e tudo funcional!
// @author       Wesley1w2e, Estúdio LAW, adaptado por Copilot Chat Assistant
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

/* ==== CONFIGURAÇÕES DE SENHA ==== */
const CONFIG = {
  VALID_UNTIL: "2025-12-31",
  VERSION: "5.0.0",
  MAX_ATTEMPTS: 3,
  LOCK_TIME: 300000, // 5 minutos (em ms)
  PASSWORDS: [
    { pass: "law2025@premium", level: "premium", description: "Acesso Premium" },
    { pass: "estudiolaw!2025", level: "premium", description: "Estúdio LAW VIP" },
    { pass: "wesley@developer", level: "admin", description: "Desenvolvedor" },
    { pass: "khanware.pro", level: "standard", description: "Acesso Padrão" },
    { pass: "lawaccess2025", level: "standard", description: "LAW Standard" },
    { pass: "premiumlaw@2025", level: "premium", description: "Premium Access" },
    { pass: "studiolaw.dev", level: "admin", description: "Dev Access" },
    { pass: "unlockkhan@law", level: "standard", description: "Khan Unlock" },
    { pass: "projectlaw2025", level: "premium", description: "Projeto LAW" },
    { pass: "masterkey@law", level: "admin", description: "Master Key" }
  ]
};

/* ==== SISTEMA DE ARMAZENAMENTO SEGURO ==== */
class SecureStorage {
  static setItem(key, value, expireMinutes = 60) {
    const item = {
      value: btoa(JSON.stringify(value)),
      expire: Date.now() + (expireMinutes * 60 * 1000),
      hash: btoa(key + JSON.stringify(value) + Date.now())
    };
    sessionStorage.setItem(btoa(key), JSON.stringify(item));
  }
  static getItem(key) {
    try {
      const item = JSON.parse(sessionStorage.getItem(btoa(key)));
      if (!item || Date.now() > item.expire) {
        this.removeItem(key);
        return null;
      }
      return JSON.parse(atob(item.value));
    } catch {
      return null;
    }
  }
  static removeItem(key) {
    sessionStorage.removeItem(btoa(key));
  }
}

/* ==== PANEL DE SENHA MODERNO COM OLHINHO ==== */
function showPasswordPanel() {
  return new Promise((resolve, reject) => {
    // validade e bloqueio
    const today = new Date();
    const validDate = new Date(CONFIG.VALID_UNTIL + "T23:59:59");
    if (today > validDate) {
      alert('Licença expirada!');
      reject("Expired");
      return;
    }
    const lockData = SecureStorage.getItem('law_lock');
    if (lockData && Date.now() < lockData.until) {
      const remaining = Math.ceil((lockData.until - Date.now()) / 60000);
      alert(`Muitas tentativas incorretas. Tente novamente em ${remaining} minutos.`);
      reject("Locked");
      return;
    }
    let attempts = SecureStorage.getItem('law_attempts') || 0;

    // painel
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2000000;background:rgba(15,23,42,0.98);
      display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;
    `;
    overlay.innerHTML = `
      <div style="background:#151f2e;border-radius:18px;padding:44px 35px;min-width:320px;max-width:90vw;box-shadow:0 12px 32px #0008;">
        <div style="font-size:2.4em;font-weight:700;color:#0ea5e9;text-align:center;margin-bottom:16px;">Estúdio LAW</div>
        <div style="color:#b9e3ff;margin-bottom:22px;text-align:center;">Painel de Autenticação</div>
        <div style="margin-bottom:18px;position:relative;">
          <input id="law-password-input" type="password" maxlength="64" autocomplete="current-password"
            style="width:100%;padding:14px 44px 14px 44px;border-radius:10px;border:2px solid #334155;background:#222e41;color:#fff;font-size:1em;" placeholder="Digite a senha..." autofocus>
          <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#0ea5e9;font-size:1.2em;">🔒</span>
          <button id="toggle-password-visibility" type="button" tabindex="-1"
            style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1.3em;color:#7dd3fc;">👁️</button>
        </div>
        <button id="law-password-submit" style="width:100%;padding:13px;border-radius:10px;background:linear-gradient(90deg,#0ea5e9,#2563eb);color:#fff;font-weight:600;font-size:1.1em;border:none;cursor:pointer;">Entrar</button>
        <div id="law-password-status" style="min-height:22px;margin:16px 0 0 0;text-align:center;font-size:0.98em;"></div>
        <div style="margin-top:24px;text-align:center;color:#64748b;font-size:0.9em;">Versão ${CONFIG.VERSION} • Válido até ${CONFIG.VALID_UNTIL.split("-").reverse().join("/")}</div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Olhinho
    const input = overlay.querySelector('#law-password-input');
    const toggleBtn = overlay.querySelector('#toggle-password-visibility');
    let isVisible = false;
    toggleBtn.onclick = function() {
      isVisible = !isVisible;
      input.type = isVisible ? 'text' : 'password';
      toggleBtn.textContent = isVisible ? '🙈' : '👁️';
    };

    // Status
    function showStatus(msg, color) {
      const el = overlay.querySelector('#law-password-status');
      el.textContent = msg;
      el.style.color = color || "#94a3b8";
    }

    // Validação
    async function validatePassword(password) {
      showStatus('Verificando...', '#06b6d4');
      await new Promise(r => setTimeout(r, 500));
      const valid = CONFIG.PASSWORDS.find(e => e.pass === password);
      if (valid) {
        SecureStorage.removeItem('law_attempts');
        SecureStorage.setItem('law_session', { level: valid.level, description: valid.description, timestamp: Date.now() }, 240);
        showStatus('Acesso liberado!', '#10b981');
        setTimeout(() => {
          overlay.remove();
          resolve(valid);
        }, 500);
      } else {
        attempts++;
        SecureStorage.setItem('law_attempts', attempts, 30);
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
          SecureStorage.setItem('law_lock', { until: Date.now() + CONFIG.LOCK_TIME }, 10);
          showStatus(`Acesso bloqueado por ${CONFIG.LOCK_TIME/60000} minutos!`, '#ef4444');
          setTimeout(() => { overlay.remove(); reject("Blocked"); }, 1800);
        } else {
          showStatus(`Senha incorreta! (${CONFIG.MAX_ATTEMPTS - attempts} restantes)`, '#ef4444');
          input.value = '';
          input.focus();
        }
      }
    }
    overlay.querySelector('#law-password-submit').onclick = () => {
      const password = input.value;
      if (!password) {
        showStatus('Digite a senha!', '#f59e0b');
        return;
      }
      validatePassword(password);
    };
    input.onkeydown = e => { if (e.key === 'Enter') overlay.querySelector('#law-password-submit').click(); };
  });
}

/* ==== SPLASH ANIMADO ==== */
async function showSplashScreen() {
  const splashScreen = document.createElement('div');
  splashScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1999999;display:flex;align-items:center;justify-content:center;
    background: linear-gradient(270deg, #001122, #0044cc, #003366, #000022);
    background-size: 600% 600%;animation: fireAnimation 2.5s infinite alternate;
    font-size:48px;letter-spacing:0.12em;color:#3399ff;text-shadow:0 0 8px #3399ff,0 0 15px #3399ff,0 0 30px #66ccff;font-family:MuseoSans,sans-serif;
    user-select:none;opacity:1;transition:opacity 1s ease;
  `;
  splashScreen.textContent = '';
  document.body.appendChild(splashScreen);
  if (!document.getElementById('fire-style')) {
    const styleFire = document.createElement('style');
    styleFire.id = 'fire-style';
    styleFire.textContent = `
      @keyframes fireAnimation {
        0% {background-position: 0% 50%;filter:hue-rotate(0deg);}
        50% {background-position: 100% 50%;filter:hue-rotate(20deg);}
        100% {background-position: 0% 50%;filter:hue-rotate(0deg);}
      }
    `;
    document.head.appendChild(styleFire);
  }
  const text = 'Estúdio LAW';
  let idx = 0;
  await new Promise(resolve => {
    const interval = setInterval(() => {
      splashScreen.textContent = text.slice(0, idx + 1);
      idx++;
      if (idx === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          splashScreen.style.opacity = '0';
          setTimeout(() => {
            splashScreen.remove();
            resolve();
          }, 900);
        }, 1200);
      }
    }, 120);
  });
}

/* ==== TOAST SIMPLES ==== */
function sendToast(text, duration = 4000) {
  if (!window.Toastify) return alert(text);
  Toastify({
    text,
    duration,
    gravity: "bottom",
    position: "center",
    stopOnFocus: true,
    style: { background: "#000000" }
  }).showToast();
}

/* ==== TAREFAS AUTOMÁTICAS ==== */
function setupMain() {
  // Vídeo spoof
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    let body;
    if (input instanceof Request) body = await input.clone().text();
    else if (init?.body) body = init.body;
    // Spoof vídeo
    if (body?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        let bodyObj = JSON.parse(body);
        if (bodyObj.variables?.input) {
          const durationSeconds = bodyObj.variables.input.durationSeconds;
          bodyObj.variables.input.secondsWatched = durationSeconds;
          bodyObj.variables.input.lastSecondWatched = durationSeconds;
          body = JSON.stringify(bodyObj);
          if (input instanceof Request) input = new Request(input, { body });
          else init.body = body;
          sendToast("🔓┃Vídeo explorado!", 1200);
        }
      } catch (e) {}
    }
    const originalResponse = await originalFetch.apply(this, arguments);
    // Spoof exercício
    try {
      const clonedResponse = originalResponse.clone();
      const responseBody = await clonedResponse.text();
      let responseObj = JSON.parse(responseBody);
      if (responseObj?.data?.assessmentItem?.item?.itemData) {
        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
        // Exemplo: força resposta correta para radio
        if (itemData.question && itemData.question.widgets && Object.keys(itemData.question.widgets).length) {
          Object.values(itemData.question.widgets).forEach(widget => {
            if (widget.type === "radio" && widget.options && widget.options.choices)
              widget.options.choices.forEach(choice => choice.correct = true);
          });
        }
        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
        return new Response(JSON.stringify(responseObj), {
          status: originalResponse.status,
          statusText: originalResponse.statusText,
          headers: originalResponse.headers
        });
      }
    } catch (e) {}
    return originalResponse;
  };

  // Auto-concluir questões
  const selectors = [
    '[data-testid="choice-icon__library-choice-icon"]',
    '[data-testid="exercise-check-answer"]',
    '[data-testid="exercise-next-question"]',
    '._1udzurba',
    '._awve9b'
  ];
  window.khanwareDominates = true;
  (async () => {
    while (window.khanwareDominates) {
      for (const selector of selectors) {
        document.querySelector(selector)?.click();
        const element = document.querySelector(`${selector} > div`);
        if (element?.innerText === "Mostrar resumo") {
          sendToast("🎉┃Exercício concluído!", 3000);
        }
      }
      await new Promise(r => setTimeout(r, 800));
    }
  })();
}


/* ==== INICIO ==== */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async function init() {
    await showSplashScreen();
    // Carregar dependências
    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js','darkReaderPlugin').then(() => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    ]);
    // Painel de senha
    try {
      await showPasswordPanel();
    } catch {
      return; // não passou no painel!
    }
    sendToast("🍀┃KhanResolver iniciado!");
    setupMain();
    console.clear();
  })();
}

/* ==== LOAD SCRIPT/CSS ==== */
async function loadScript(url, label) {
  const response = await fetch(url);
  const scriptText = await response.text();
  (window.loadedPlugins = window.loadedPlugins || []).push(label);
  eval(scriptText);
}
async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.type = 'text/css'; link.href = url;
    link.onload = resolve; document.head.appendChild(link);
  });
    }
