// ==UserScript==
// @name         Khanware + Estúdio LAW Password Panel - VERSÃO MELHORADA
// @namespace    http://estudiolaw.com/
// @version      4.0.0-ESTUDIO-LAW-PREMIUM
// @description  Script Khanware com sistema de senha avançado, interface moderna e animações profissionais. Desenvolvido por Wesley/Estúdio LAW.
// @author       Wesley (Estúdio LAW), Niximkk
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

/* ==== CONFIGURAÇÕES DE SEGURANÇA E VALIDAÇÃO ==== */
const CONFIG = {
  VALID_UNTIL: "2025-12-31",
  VERSION: "4.0.0-PREMIUM",
  MAX_ATTEMPTS: 3,
  LOCK_TIME: 300000, // 5 minutos em ms
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
      hash: btoa(key + value + Date.now())
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

/* ==== MODAL DE ERRO ==== */
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

/* ==== PAINEL DE SENHA AVANÇADO ==== */
function showAdvancedPasswordPanel() {
  return new Promise((resolve, reject) => {
    // Verificar validade
    const today = new Date();
    const validDate = new Date(CONFIG.VALID_UNTIL + "T23:59:59");
    if (today > validDate) {
      showErrorModal("Acesso Expirado", "Licença expirada! Contate o Estúdio LAW para renovação.");
      reject("Expired");
      return;
    }

    // Verificar bloqueio por tentativas
    const lockData = SecureStorage.getItem('law_lock');
    if (lockData && Date.now() < lockData.until) {
      const remaining = Math.ceil((lockData.until - Date.now()) / 60000);
      showErrorModal("Acesso Bloqueado", `Muitas tentativas incorretas. Tente novamente em ${remaining} minutos.`);
      reject("Locked");
      return;
    }

    let attempts = SecureStorage.getItem('law_attempts') || 0;

    // Criar overlay principal
    const overlay = document.createElement('div');
    overlay.id = "law-password-overlay";
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2000000;
      background: linear-gradient(-45deg, #0a1a2e, #16213e, #0f1b2d, #1a2332, #0e1a2d);
      background-size: 400% 400%;
      animation: lawAdvancedBg 12s ease-in-out infinite;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    `;

    // Partículas de fundo
    const particles = document.createElement('div');
    particles.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #00aaff44, transparent),
        radial-gradient(2px 2px at 40px 70px, #0077cc44, transparent),
        radial-gradient(1px 1px at 90px 40px, #00ccff44, transparent);
      background-repeat: repeat;
      background-size: 100px 100px;
      animation: particleFloat 20s linear infinite;
      opacity: 0.6;
    `;
    overlay.appendChild(particles);

    // Painel principal
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
        <!-- Header -->
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
          <div style="
            color: #94a3b8; font-size: 1.1em; font-weight: 500;
            letter-spacing: 0.5px;
          ">
            Sistema de Autenticação Avançado
          </div>
        </div>

        <!-- Formulário -->
        <div style="margin: 30px 0;">
          <div style="
            color: #cbd5e1; margin-bottom: 15px; font-size: 1.05em;
            text-align: left; padding-left: 5px;
          ">
            Senha de Acesso:
          </div>
          
          <div style="position: relative; margin-bottom: 20px;">
            <input id="law-password-input" type="password" maxlength="64" 
              placeholder="Digite sua senha..."
              style="
                width: 100%; padding: 15px 20px 15px 50px;
                font-size: 1.1em; border: 2px solid #334155;
                border-radius: 12px; background: rgba(30, 41, 59, 0.8);
                color: #ffffff; outline: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
              " 
              autofocus autocomplete="current-password" />
            
            <div style="
              position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
              color: #64748b; font-size: 1.2em;
            ">🔐</div>
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

        <!-- Status -->
        <div id="law-password-status" style="
          min-height: 25px; margin: 20px 0;
          font-size: 0.95em; font-weight: 500;
        "></div>

        <!-- Info -->
        <div style="
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 25px; padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9em; color: #64748b;
        ">
          <div>Versão ${CONFIG.VERSION}</div>
          <div>Válido até ${CONFIG.VALID_UNTIL.split("-").reverse().join("/")}</div>
        </div>

        <div style="
          margin-top: 15px; font-size: 0.85em; color: #475569;
          opacity: 0.8;
        ">
          Desenvolvido por Wesley • Estúdio LAW
        </div>
      </div>
    `;

    // Adicionar estilos
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
        @keyframes particleFloat {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes panelEntrance {
          0% { opacity: 0; transform: translateY(50px) scale(0.9); filter: blur(10px);}
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px);}
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        #law-password-input:focus {
          border-color: #0ea5e9;
          box-shadow: 
            0 0 0 3px rgba(14, 165, 233, 0.2),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        #law-password-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
        }
        #law-password-submit:active {
          transform: translateY(0);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `;
      document.head.appendChild(styles);
    }

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Funções de controle
    function cleanup() {
      overlay.remove();
    }

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
        setTimeout(() => {
          panel.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
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
      await new Promise(resolve => setTimeout(resolve, 1200));
      const validPassword = CONFIG.PASSWORDS.find(p => p.pass === password);
      if (validPassword) {
        showStatus('✅ Acesso autorizado!', 'success');
        SecureStorage.removeItem('law_attempts');
        SecureStorage.setItem('law_session', {
          level: validPassword.level,
          description: validPassword.description,
          timestamp: Date.now()
        }, 240); // 4 horas
        setTimeout(() => {
          cleanup();
          resolve(validPassword);
        }, 1000);
      } else {
        attempts++;
        SecureStorage.setItem('law_attempts', attempts, 30); // 30 min
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
          SecureStorage.setItem('law_lock', { until: Date.now() + CONFIG.LOCK_TIME }, 10);
          showStatus(`❌ Acesso bloqueado por ${CONFIG.LOCK_TIME/60000} minutos!`, 'error');
          setTimeout(() => {
            cleanup();
            reject("Blocked");
          }, 3000);
        } else {
          showStatus(`❌ Senha incorreta! (${CONFIG.MAX_ATTEMPTS - attempts} tentativas restantes)`, 'error');
          setLoading(false);
          document.getElementById('law-password-input').value = '';
          document.getElementById('law-password-input').focus();
        }
      }
    }

    // Event listeners
    document.getElementById('law-password-submit').onclick = () => {
      const password = document.getElementById('law-password-input').value.trim();
      if (password) {
        validatePassword(password);
      } else {
        showStatus('Digite uma senha válida', 'warning');
      }
    };
    document.getElementById('law-password-input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        document.getElementById('law-password-submit').click();
      }
    };
  });
}

/* ==== CENA DE COMEMORAÇÃO ==== */
function showCelebrationScene(userLevel) {
  return new Promise((resolve) => {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 2000001; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', sans-serif; overflow: hidden;
    `;
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; overflow: hidden;
    `;
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]};
        left: ${Math.random() * 100}%;
        animation: confettiFall ${Math.random() * 3 + 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        transform: rotate(${Math.random() * 360}deg);
      `;
      confettiContainer.appendChild(confetti);
    }
    celebration.appendChild(confettiContainer);
    const content = document.createElement('div');
    content.style.cssText = `
      text-align: center; color: white; z-index: 1; position: relative;
      animation: celebrationBounce 1s ease-out;
    `;
    const levelEmojis = {'admin': '👑','premium': '⭐','standard': '🚀'};
    const levelNames = {'admin': 'Administrador','premium': 'Premium','standard': 'Padrão'};
    content.innerHTML = `
      <div style="font-size: 6em; margin-bottom: 20px; animation: bounce 2s infinite;">
        🎉
      </div>
      <div style="font-size: 3em; font-weight: bold; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
        Bem-vindo ao Estúdio LAW!
      </div>
      <div style="font-size: 1.8em; margin-bottom: 20px; opacity: 0.9;">
        ${levelEmojis[userLevel]} Acesso <strong>${levelNames[userLevel]}</strong> concedido!
      </div>
      <div style="font-size: 1.2em; opacity: 0.8; max-width: 600px; margin: 0 auto;">
        Você está pronto para usar todas as funcionalidades do Khanware!
      </div>
    `;
    celebration.appendChild(content);
    if (!document.getElementById('celebration-styles')) {
      const styles = document.createElement('style');
      styles.id = 'celebration-styles';
      styles.innerHTML = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
        @keyframes celebrationBounce {
          0% { opacity: 0; transform: scale(0.3) translateY(50px);}
          50% { transform: scale(1.05) translateY(-10px);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `;
      document.head.appendChild(styles);
    }
    document.body.appendChild(celebration);
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRvIBAABXQVZFZm10IBAAAAABAAEAVQAAAE8AAAACABAAZGltMAAAABAAAABCAEAAQ0JDAEEAAABBQAEAAQABAAAAAAAAAAAA');
      audio.play().catch(() => {});
    } catch {}
    setTimeout(() => {
      celebration.style.opacity = '0';
      celebration.style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        celebration.remove();
        resolve();
      }, 800);
    }, 3000);
  });
}

/* ==== SPLASH SCREEN ESTÚDIO LAW ==== */
function showEstudioLawSplash() {
  return new Promise((resolve) => {
    const splash = document.createElement('div');
    splash.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 2000002; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
      background-size: 400% 400%;
      animation: backgroundFlow 10s ease infinite;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      user-select: none;
    `;
    splash.innerHTML = `
      <div style="
        text-align: center;
        animation: splashFadeIn 2s ease forwards;
        opacity: 0;
      ">
        <div style="
          font-size: 4em; font-weight: bold; margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff, #00aaff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(0, 170, 255, 0.8);
          animation: glowPulse 3s ease-in-out infinite;
        ">
          Estúdio <span style="color: #00aaff;">LAW</span>
        </div>
        <div style="
          font-size: 1.3em; color: #94a3b8; margin-bottom: 30px;
          letter-spacing: 2px; text-transform: uppercase;
        ">
          Khanware Enhanced
        </div>
        <div style="
          width: 60px; height: 4px; background: linear-gradient(90deg, #00aaff, #0284c7);
          margin: 0 auto; border-radius: 2px;
          animation: loadingBar 2s ease-in-out infinite;
        "></div>
      </div>
    `;
    if (!document.getElementById('splash-styles')) {
      const styles = document.createElement('style');
      styles.id = 'splash-styles';
      styles.innerHTML = `
        @keyframes backgroundFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes splashFadeIn {
          to { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 30px rgba(0, 170, 255, 0.8);}
          50% { text-shadow: 0 0 50px rgba(0, 170, 255, 1), 0 0 80px rgba(0, 170, 255, 0.6);}
        }
        @keyframes loadingBar {
          0% { transform: scaleX(0);}
          50% { transform: scaleX(1);}
          100% { transform: scaleX(0);}
        }
      `;
      document.head.appendChild(styles);
    }
    document.body.appendChild(splash);
    setTimeout(() => {
      splash.style.transition = 'opacity 1s ease';
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.remove();
        resolve();
      }, 1000);
    }, 3000);
  });
}

/* ==== SCRIPT PRINCIPAL ==== */
(async function(){
  try {
    // 1. Mostrar painel de senha
    const userAccess = await showAdvancedPasswordPanel();
    // 2. Mostrar comemoração
    await showCelebrationScene(userAccess.level);
    // 3. Mostrar splash do Estúdio LAW
    await showEstudioLawSplash();

    // ... aqui segue o script original KHANWARE (exemplo):
    alert("Acesso liberado!\nBem-vindo ao Khanware + Estúdio LAW.\nNível: " + userAccess.description);

    // SEU SCRIPT DE USO PESSOAL PODE CONTINUAR AQUI...

  } catch (error) {
    // Tratamento de erro global
    if (typeof error === 'string') showErrorModal("Erro", error);
    else alert('Erro crítico ao inicializar o script!\n\n' + (error && error.message ? error.message : error));
  }
})();
