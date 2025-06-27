// ==UserScript==
// @name         Khanware + Estúdio LAW | Painel Realista + Expiração
// @namespace    http://estudiolaw.com/
// @version      3.2.0-LAW
// @description  Painel realista com senha, hora de expiração, olhinho e integração Khanware (Desenvolvido por Wesley)
// @author       Estúdio LAW (Wesley)
// @match        https://www.khanacademy.org/*
// @match        https://pt.khanacademy.org/*
// @icon         https://estudiolaw.com/favicon.ico
// @grant        none
// ==/UserScript==

// CONFIGURAÇÃO
const SENHAS = [
  "law2025@premium",
  "estudiolaw!2025",
  "wesley@developer",
  "khanware.pro"
];
const MAX_TENTATIVAS = 3;
const BLOQUEIO_MINUTOS = 5;
// DATA E HORA LIMITE (UTC). Exemplo: "2025-12-31 23:59"
const DATA_EXPIRA = "2025-12-31 23:59";

// Função para verificar expiração (com hora!)
function isExpirado() {
  const agora = new Date();
  const [d, h] = DATA_EXPIRA.split(" ");
  const [ano, mes, dia] = d.split("-").map(Number);
  const [hora, min] = h.split(":").map(Number);
  const exp = new Date(Date.UTC(ano, mes - 1, dia, hora, min));
  return agora.getTime() >= exp.getTime();
}

// Função: PAINEL de senha moderno e realista
function showPainelSenhaLAW() {
  return new Promise((resolve, reject) => {
    // BLOQUEIO POR TENTATIVA ERRADA
    const lockKey = "law_bloq";
    if (localStorage.getItem(lockKey)) {
      const unlock = parseInt(localStorage.getItem(lockKey));
      const falta = Math.ceil((unlock - Date.now())/60000);
      if (Date.now() < unlock) {
        alert(`Acesso bloqueado!\n\nVocê tentou muitas vezes.\nTente novamente em ${falta} minuto(s).`);
        reject("lock");
        return;
      } else {
        localStorage.removeItem(lockKey);
        localStorage.removeItem('law_tentativas');
      }
    }

    // VERIFICAR EXPIRAÇÃO
    if (isExpirado()) {
      document.body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#111827;color:#eee;">
      <h1 style="font-size:2.5em;color:#0894ff;text-shadow:0 0 30px #0894ff52;">Estúdio LAW</h1>
      <p style="font-size:1.3em;">⏰ Acesso expirado<br>Validade: <b>${DATA_EXPIRA.replace(" ","&nbsp;")}</b> (UTC)</p>
      <p style="color:#f43f5e;margin-top:20px;">Contate o suporte para renovar sua licença.</p>
      </div>`;
      reject("expirado");
      return;
    }

    // CRIAR PAINEL
    const overlay = document.createElement('div');
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;
      background:radial-gradient(ellipse at 50% 30%, #11203b 70%, #0a1629 100%);
      display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;
      animation:fadeLawIn 0.8s;
    `;
    overlay.innerHTML = `
      <div id="painel-law-main" style="
        background:rgba(19,29,49,0.98);border-radius:22px;box-shadow:0 18px 60px #0894ff33;
        padding:46px 38px;min-width:340px;max-width:95vw;display:flex;flex-direction:column;align-items:center;position:relative;
        border: 1.5px solid #0894ff37;animation:panelLawPop 0.8s;
      ">
        <div style="font-size:2.3em;font-weight:700;color:#0894ff;text-shadow:0 0 20px #0894ff82;margin-bottom:10px;letter-spacing:0.05em;">
          Estúdio <span style="color:#FFF;">LAW</span>
        </div>
        <div style="color:#b9e3ff;margin-bottom:18px;text-align:center;font-size:1.13em;">Acesso Premium<br><span style="font-size:0.86em;color:#57c3ff;">Desenvolvido por Wesley</span></div>
        <div style="margin-bottom:22px;position:relative;width:100%;max-width:350px;">
          <input id="law-senha" type="password" maxlength="64" autocomplete="current-password"
            style="width:100%;padding:17px 52px 17px 48px;border-radius:13px;border:2px solid #274472;
              background:#192a48;color:#fff;font-size:1.12em;outline:none;box-shadow:0 4px 14px #0894ff10;"
            placeholder="Digite sua senha..." autofocus>
          <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#60aaff;font-size:1.25em;">🔒</span>
          <button id="olho-law" type="button" tabindex="-1"
            style="position:absolute;right:13px;top:50%;transform:translateY(-50%);
            background:none;border:none;cursor:pointer;font-size:1.18em;color:#60aaff;">👁️</button>
        </div>
        <button id="entrar-law" style="width:100%;padding:15px 0;border-radius:11px;background:linear-gradient(93deg,#0894ff,#1a6ffb 98%);
          color:#fff;font-weight:600;font-size:1.15em;border:none;cursor:pointer;box-shadow:0 4px 16px #0ea5e930;letter-spacing:0.06em;">
          Entrar
        </button>
        <div id="status-law" style="height:28px;margin:16px 0 0 0;text-align:center;font-size:1.01em;"></div>
        <div style="margin-top:28px;text-align:center;color:#64748b;font-size:0.99em;">
          Validade: ${DATA_EXPIRA.replace(" ","&nbsp;")} UTC<br>Versão 3.2.0 • Estúdio LAW
        </div>
      </div>
    `;
    // Animação
    if (!document.getElementById('law-painel-style')) {
      const style = document.createElement('style');
      style.id = 'law-painel-style';
      style.innerHTML = `
        @keyframes fadeLawIn {from{opacity:0} to{opacity:1}}
        @keyframes panelLawPop {0%{opacity:0;transform:scale(0.85);}70%{opacity:1;transform:scale(1.05);}100%{opacity:1;transform:scale(1);}}
        @keyframes shakePanelLaw {0%,100%{transform:translateX(0);}25%{transform:translateX(-8px);}75%{transform:translateX(8px);}}
        #painel-law-main:focus-within { box-shadow: 0 0 0 3px #0894ff44; }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);

    // Funções do painel
    const input = overlay.querySelector('#law-senha');
    const olho = overlay.querySelector('#olho-law');
    let visivel = false;
    olho.onclick = () => {
      visivel = !visivel;
      input.type = visivel ? 'text' : 'password';
      olho.textContent = visivel ? '🙈' : '👁️';
    };

    let tent = parseInt(localStorage.getItem('law_tentativas')) || 0;
    function status(msg, cor) {
      const el = overlay.querySelector('#status-law');
      el.textContent = msg;
      el.style.color = cor||"#b9e3ff";
    }
    async function validarSenha(senha) {
      status('Verificando...', '#38bdf8');
      await new Promise(r => setTimeout(r, 350));
      if (SENHAS.includes(senha)) {
        localStorage.removeItem('law_tentativas');
        status('Acesso liberado!', '#22c55e');
        setTimeout(()=>{overlay.remove();resolve();}, 700);
      } else {
        tent++;
        localStorage.setItem('law_tentativas', tent);
        if (tent >= MAX_TENTATIVAS) {
          localStorage.setItem(lockKey, Date.now()+(BLOQUEIO_MINUTOS*60000));
          status(`Acesso bloqueado (${BLOQUEIO_MINUTOS} min)!`, '#ef4444');
          overlay.querySelector('#painel-law-main').style.animation = 'shakePanelLaw 0.35s';
          setTimeout(()=>{overlay.remove();reject("bloqueado");}, 1400);
        } else {
          status(`Senha incorreta! (${MAX_TENTATIVAS-tent} restantes)`, '#ef4444');
          overlay.querySelector('#painel-law-main').style.animation = 'shakePanelLaw 0.35s';
          setTimeout(()=>overlay.querySelector('#painel-law-main').style.animation='',350);
          input.value = '';
          input.focus();
        }
      }
    }
    overlay.querySelector('#entrar-law').onclick = ()=> {
      if (!input.value) { status('Digite a senha!', '#f59e0b'); return; }
      validarSenha(input.value);
    };
    input.onkeydown = e => { if (e.key === 'Enter') overlay.querySelector('#entrar-law').click(); };
  });
}

/* ====== Comemoração ====== */
function showCelebrationLAW() {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;
      background:rgba(10,20,40,0.98);display:flex;align-items:center;justify-content:center;animation:fadeLawIn 0.7s;
    `;
    overlay.innerHTML = `
      <div style="background:rgba(22,31,47,0.99);border-radius:22px;padding:50px 38px;min-width:340px;max-width:95vw;display:flex;flex-direction:column;align-items:center;animation:panelLawPop 0.8s;">
        <div style="font-size:4.3em;line-height:1;">🎉</div>
        <div style="font-size:2.1em;font-weight:700;color:#0ea5e9;margin:16px 0 6px;">Bem-vindo!</div>
        <div style="color:#b9e3ff;font-size:1.21em;text-align:center;">Acesso concedido ao Khanware + Estúdio LAW!</div>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.8s';
      setTimeout(()=>{overlay.remove(); resolve();}, 900);
    }, 2100);
  });
}

/* ====== INTEGRAÇÃO: RODA O SCRIPT SÓ DEPOIS DO LOGIN ====== */
(async function(){
  if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌ Khanware Estúdio LAW\n\nExecute no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }
  await showEstudioLawSplash();
  await new Promise(r=>setTimeout(r, 1200));
  await hideEstudioLawSplash();
  await showPainelSenhaLAW();
  await showCelebrationLAW();

  // ========== SEU SCRIPT KHANWARE ORIGINAL AQUI ==========
  // Cole abaixo todo o script de tarefas (setupMenu, setupMain, etc)
  // Exemplo:
  // showSplashScreen();
  // loadScript(...);
  // setupMenu();
  // setupMain();
  // ... etc ...
})();
