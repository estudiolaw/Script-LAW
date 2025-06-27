// ==UserScript==
// @name         Khanware + Estúdio LAW Password Panel - OLHINHO E FUNCIONAL
// @namespace    http://estudiolaw.com/
// @version      4.0.2-ESTUDIO-LAW-PREMIUM
// @description  Painel de senha com olhinho, senhas conferidas, bugs corrigidos. Pronto para usar ou publicar no GitHub.
// @author       Wesley (Estúdio LAW), Niximkk, Ajustado por Copilot Chat Assistant
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

const CONFIG = {
  VALID_UNTIL: "2025-12-31",
  VERSION: "4.0.2-PREMIUM",
  MAX_ATTEMPTS: 3,
  LOCK_TIME: 300000, // 5 minutos
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

function showErrorModal(title, message) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 2000003; display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px);
    font-family: 'Segoe UI', sans-serif;
  `;
  modal.innerHTML = `
    <div style="
      background: #1e293b; border-radius: 15px; padding: 30px;
      max-width: 400px; text-align: center;
      border: 2px solid #ef4444;
      box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3);
    ">
      <div style="font-size: 3em; margin-bottom: 20px;">❌</div>
      <div style="font-size: 1.5em; font-weight: bold; color: #ef4444; margin-bottom: 15px;">
        ${title}
      </div>
      <div style="color: #cbd5e1; margin-bottom: 25px; line-height: 1.5;">
        ${message}
      </div>
      <button onclick="this.closest('div').parentElement.remove()" style="
        background: #ef4444; color: white; border: none; border-radius: 8px;
        padding: 12px 25px; font-size: 1.1em; cursor: pointer;
        transition: background 0.3s ease;
      " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
        Fechar
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

// Painel de senha com olhinho e bugfix
function showAdvancedPasswordPanel() {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const validDate = new Date(CONFIG.VALID_UNTIL + "T23:59:59");
    if (today > validDate) {
      showErrorModal("Acesso Expirado", "Licença expirada! Contate o Estúdio LAW para renovação.");
      reject("Expired");
      return;
    }
    const lockData = SecureStorage.getItem('law_lock');
    if (lockData && Date.now() < lockData.until) {
      const remaining = Math.ceil((lockData.until - Date.now()) / 60000);
      showErrorModal("Acesso Bloqueado", `Muitas tentativas incorretas. Tente novamente em ${remaining} minutos.`);
      reject("Locked");
      return;
    }
    let attempts = SecureStorage.getItem('law_attempts') || 0;

    const overlay = document.createElement('div');
    overlay.id = "law-password-overlay";
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2000000;
      background: linear-gradient(-45deg, #0a1a2e, #16213e, #0f1b2d, #1a2332, #0e1a2d);
      background-size: 400% 400%; animation: lawAdvancedBg 12s ease-in-out infinite;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
      background: rgba(15, 25, 40, 0.95);
      backdrop-filter: blur(20px);
      border: 2px solid #00aaff55;
      border-radius: 20px;
      padding: 45px 40px;
      text-align: center;
      min-width: 420px; max-width: 90vw;
      box-shadow: 
        0 20px 60px rgba(0, 170, 255, 0.3),
        0 0 0 1px rgba(0, 170, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      animation: panelEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    `;

    panel.innerHTML = `
      <div style="position: relative;">
        <div style="margin-bottom: 30px;">
          <div style="
            font-size: 2.8em; font-weight: 700; 
            background: linear-gradient(135deg, #ffffff, #00aaff);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(0, 170, 255, 0.5);
            margin-bottom: 8px;
          ">
            Estúdio <span style="color: #00aaff;">LAW</span>
          </div>
          <div style="color: #94a3b8; font-size: 1.1em; font-weight: 500; letter-spacing: 0.5px;">
            Sistema de Autenticação Avançado
          </div>
        </div>
        <div style="margin: 30px 0;">
          <div style="color: #cbd5e1; margin-bottom: 15px; font-size: 1.05em; text-align: left; padding-left: 5px;">
            Senha de Acesso:
          </div>
          <div style="position: relative; margin-bottom: 20px;">
            <input id="law-password-input" type="password" maxlength="64" 
              placeholder="Digite sua senha..." autocomplete="current-password"
              style="width: 100%; padding: 15px 50px 15px 50px; font-size: 1.1em; border: 2px solid #334155;
                border-radius: 12px; background: rgba(30, 41, 59, 0.8);
                color: #ffffff; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);" autofocus />
            <div style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
              color: #64748b; font-size: 1.2em;">🔐</div>
            <button id="toggle-password-visibility" type="button"
              style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                background: none; border: none; cursor: pointer; color: #64748b; font-size: 1.3em; outline: none;"
              title="Mostrar/ocultar senha" tabindex="-1">👁️</button>
          </div>
          <button id="law-password-submit" style="
            width: 100%; padding: 15px;
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            border: none; border-radius: 12px;
            color: white; font-size: 1.15em; font-weight: 600;
            cursor: pointer; transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
            position: relative; overflow: hidden;
          ">
            <span id="button-text">Autenticar Acesso</span>
            <div id="button-loader" style="
              display: none; position: absolute; top: 50%; left: 50%;
              transform: translate(-50%, -50%);
            ">
              <div style="
                width: 20px; height: 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%; animation: spin 1s linear infinite;
              "></div>
            </div>
          </button>
        </div>
        <div id="law-password-status" style="
          min-height: 25px; margin: 20px 0;
          font-size: 0.95em; font-weight: 500;
        "></div>
        <div style="
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 25px; padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9em; color: #64748b;
        ">
          <div>Versão ${CONFIG.VERSION}</div>
          <div>Válido até ${CONFIG.VALID_UNTIL.split("-").reverse().join("/")}</div>
        </div>
        <div style="margin-top: 15px; font-size: 0.85em; color: #475569; opacity: 0.8;">
          Desenvolvido por Wesley • Estúdio LAW
        </div>
      </div>
    `;

    if (!document.getElementById('law-advanced-styles')) {
      const styles = document.createElement('style');
      styles.id = 'law-advanced-styles';
      styles.innerHTML = `
        @keyframes lawAdvancedBg {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 0% 100%; }
          75% { background-position: 100% 0%; }
        }
        @keyframes panelEntrance {
          0% { opacity: 0; transform: translateY(50px) scale(0.9); filter: blur(10px);}
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0);}
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        #law-password-input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2),
            inset 0 2px 4px rgba(0,0,0,0.3);
        }
        #law-password-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,165,233,0.5);
        }
        #law-password-submit:active {
          transform: translateY(0);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0);}
          25% { transform: translateX(-10px);}
          75% { transform: translateX(10px);}
        }
      `;
      document.head.appendChild(styles);
    }

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function cleanup() { overlay.remove(); }
    function showStatus(message, type = 'info') {
      const statusEl = document.getElementById('law-password-status');
      const colors = {
        error: '#ef4444',
        success: '#10b981',
        info: '#06b6d4',
        warning: '#f59e0b'
      };
      statusEl.style.color = colors[type];
      statusEl.textContent = message;
      if (type === 'error') {
        panel.style.animation = 'none';
        setTimeout(() => { panel.style.animation = 'shake 0.5s ease-in-out'; }, 10);
      }
    }
    function setLoading(loading) {
      const button = document.getElementById('law-password-submit');
      const buttonText = document.getElementById('button-text');
      const buttonLoader = document.getElementById('button-loader');
      if (loading) {
        button.disabled = true;
        button.style.opacity = '0.8';
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'block';
      } else {
        button.disabled = false;
        button.style.opacity = '1';
        buttonText.style.display = 'block';
        buttonLoader.style.display = 'none';
      }
    }
    async function validatePassword(password) {
      setLoading(true);
      showStatus('Verificando credenciais...', 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
      // Conferência exata, sem trim
      const validPassword = CONFIG.PASSWORDS.find(p => p.pass === password);
      if (validPassword) {
        showStatus('✅ Acesso autorizado!', 'success');
        SecureStorage.removeItem('law_attempts');
        SecureStorage.setItem('law_session', {
          level: validPassword.level,
          description: validPassword.description,
          timestamp: Date.now()
        }, 240);
        setTimeout(() => {
          cleanup();
          resolve(validPassword);
        }, 900);
      } else {
        attempts++;
        SecureStorage.setItem('law_attempts', attempts, 30);
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
          SecureStorage.setItem('law_lock', { until: Date.now() + CONFIG.LOCK_TIME }, 10);
          showStatus(`❌ Acesso bloqueado por ${CONFIG.LOCK_TIME/60000} minutos!`, 'error');
          setTimeout(() => {
            cleanup();
            reject("Blocked");
          }, 2500);
        } else {
          showStatus(`❌ Senha incorreta! (${CONFIG.MAX_ATTEMPTS - attempts} tentativas restantes)`, 'error');
          setLoading(false);
          document.getElementById('law-password-input').value = '';
          document.getElementById('law-password-input').focus();
        }
      }
    }

    // Olhinho: mostrar/ocultar senha
    const input = panel.querySelector('#law-password-input');
    const toggleBtn = panel.querySelector('#toggle-password-visibility');
    let isVisible = false;
    toggleBtn.onclick = function() {
      isVisible = !isVisible;
      input.type = isVisible ? 'text' : 'password';
      toggleBtn.textContent = isVisible ? '🙈' : '👁️';
    };
    panel.querySelector('#law-password-submit').onclick = () => {
      const password = input.value;
      if (password) {
        validatePassword(password);
      } else {
        showStatus('Digite uma senha válida', 'warning');
      }
    };
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        panel.querySelector('#law-password-submit').click();
      }
    };
  });
}

// ===== EXEMPLO DE USO: painel some e segue seu código
(async function(){
  try {
    const userAccess = await showAdvancedPasswordPanel();
    alert("Acesso liberado!\nBem-vindo ao Khanware + Estúdio LAW.\nNível: " + userAccess.description);
    // Aqui você pode continuar seu código customizado...
    // Exemplo: window.location.reload();
  } catch (error) {
    if (typeof error === 'string') showErrorModal("Erro", error);
    else alert('Erro crítico ao inicializar o script!\n\n' + (error && error.message ? error.message : error));
  }
})();

// ===== SENHAS QUE FUNCIONAM =====
// law2025@premium
// estudiolaw!2025
// wesley@developer
// khanware.pro
// lawaccess2025
// premiumlaw@2025
// studiolaw.dev
// unlockkhan@law
// projectlaw2025
// masterkey@law
