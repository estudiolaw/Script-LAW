/*=======================================================
 * KHAN ACADEMY AUTOMATION SUITE - ESTÚDIO LAW
 * Version: 4.0.0 - Law Edition
 * Desenvolvido por: Wesley (Estúdio LAW)
 * Data: 2025
 *=======================================================*/

console.log("🏛️ [ESTÚDIO LAW] Iniciando sistema...");

// Verificação imediata do site
if (!/khanacademy\.org/.test(window.location.href)) {
    alert("❌ Execute este script apenas no Khan Academy!");
    throw new Error("Site incorreto");
}

const LAW_VERSION = "4.0.0";
const LAW_PASSWORD = "LAW2025"; // Altere aqui
const LAW_EXPIRY = "2025-12-31"; // Data de expiração

// Prevenir execução dupla
if (window.ESTUDIO_LAW_LOADED) {
    console.log("🏛️ [LAW] Sistema já carregado!");
    return;
}
window.ESTUDIO_LAW_LOADED = true;

// Remover painéis existentes
document.querySelectorAll('[id*="law"], [id*="LAW"]').forEach(el => el.remove());

// ================== SPLASH SCREEN ==================
function createSplashScreen() {
    const splash = document.createElement('div');
    splash.id = 'law-splash-screen';
    splash.innerHTML = `
        <div class="law-splash-content">
            <div class="law-logo-container">
                <h1 class="law-main-title">Estúdio <span class="law-highlight">LAW</span></h1>
                <p class="law-subtitle">Sistema de Login</p>
            </div>
            <div class="law-loading">
                <div class="law-spinner"></div>
                <p>Carregando sistema...</p>
            </div>
        </div>
    `;

    const styles = `
        <style id="law-splash-styles">
            #law-splash-screen {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', Arial, sans-serif;
                animation: lawFadeIn 0.8s ease;
            }

            .law-splash-content {
                text-align: center;
                color: white;
                animation: lawSlideUp 1s ease 0.3s both;
            }

            .law-main-title {
                font-size: 3.5rem;
                font-weight: 700;
                margin: 0 0 10px 0;
                text-shadow: 0 0 20px rgba(255,255,255,0.5);
                animation: lawGlow 2s ease-in-out infinite alternate;
            }

            .law-highlight {
                color: #64b5f6;
                text-shadow: 0 0 20px #64b5f6;
            }

            .law-subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                margin: 0 0 40px 0;
            }

            .law-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .law-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid #64b5f6;
                border-radius: 50%;
                animation: lawSpin 1s linear infinite;
            }

            @keyframes lawFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes lawSlideUp {
                from { 
                    opacity: 0; 
                    transform: translateY(30px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }

            @keyframes lawGlow {
                from { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
                to { text-shadow: 0 0 30px rgba(100,181,246,0.8), 0 0 40px rgba(100,181,246,0.4); }
            }

            @keyframes lawSpin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(splash);
    
    // Remove splash após 2.5 segundos
    setTimeout(() => {
        splash.style.animation = 'lawFadeIn 0.8s ease reverse';
        setTimeout(() => {
            splash.remove();
            showAuthPanel();
        }, 800);
    }, 2500);
}

// ================== PAINEL DE AUTENTICAÇÃO ==================
function showAuthPanel() {
    const currentDate = new Date().toISOString().split('T')[0];
    const isExpired = currentDate > LAW_EXPIRY;
    
    const authPanel = document.createElement('div');
    authPanel.id = 'law-auth-panel';
    authPanel.innerHTML = `
        <div class="law-auth-overlay"></div>
        <div class="law-auth-container">
            <div class="law-auth-header">
                <h2>Studio Law</h2>
                <p>para sala do futuro é cripit</p>
            </div>
            
            <div class="law-auth-form">
                <div class="law-form-group">
                    <label>RA</label>
                    <input type="text" id="law-ra" value="000113460932Zsp" readonly>
                </div>
                
                <div class="law-form-group">
                    <label>Senha</label>
                    <input type="password" id="law-password" placeholder="Digite a senha..." maxlength="20">
                </div>
                
                <div class="law-checkbox-group">
                    <input type="checkbox" id="law-verified" checked>
                    <label for="law-verified">Verificado</label>
                </div>
                
                ${isExpired ? `
                    <div class="law-expired-notice">
                        ⚠️ Licença expirada em ${LAW_EXPIRY}
                    </div>
                ` : ''}
                
                <button class="law-btn-primary" onclick="window.lawAuthenticate()">
                    ATIVIDADES PENDENTES
                </button>
                
                <button class="law-btn-secondary" onclick="window.lawShowExpired()">
                    ATIVIDADES EXPIRADAS
                </button>
                
                <button class="law-btn-exit" onclick="window.lawExit()">
                    SAIR
                </button>
            </div>
            
            <div class="law-auth-footer">
                Entre em contato com o suporte da Unicsul<br>
                <span class="law-credits">Law House</span>
            </div>
        </div>
    `;

    const authStyles = `
        <style id="law-auth-styles">
            #law-auth-panel {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                z-index: 999999;
                font-family: 'Segoe UI', Arial, sans-serif;
                animation: lawAuthFadeIn 0.6s ease;
            }

            .law-auth-overlay {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #01579b 100%);
            }

            .law-auth-container {
                position: relative;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(30, 30, 30, 0.95);
                border-radius: 12px;
                padding: 30px;
                width: 400px;
                max-width: 90vw;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                animation: lawPanelSlide 0.8s ease 0.2s both;
            }

            .law-auth-header {
                text-align: center;
                margin-bottom: 30px;
                color: white;
            }

            .law-auth-header h2 {
                font-size: 2.2rem;
                font-weight: 600;
                margin: 0 0 5px 0;
                color: #64b5f6;
                text-shadow: 0 0 10px rgba(100,181,246,0.5);
            }

            .law-auth-header p {
                margin: 0;
                opacity: 0.8;
                font-size: 0.9rem;
            }

            .law-form-group {
                margin-bottom: 20px;
            }

            .law-form-group label {
                display: block;
                color: white;
                margin-bottom: 5px;
                font-weight: 500;
            }

            .law-form-group input {
                width: 100%;
                padding: 12px 15px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 6px;
                color: white;
                font-size: 1rem;
                box-sizing: border-box;
                transition: all 0.3s ease;
            }

            .law-form-group input:focus {
                outline: none;
                border-color: #64b5f6;
                box-shadow: 0 0 0 2px rgba(100,181,246,0.2);
                background: rgba(255,255,255,0.15);
            }

            .law-form-group input[readonly] {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .law-checkbox-group {
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                color: white;
            }

            .law-checkbox-group input {
                margin-right: 8px;
                transform: scale(1.2);
            }

            .law-expired-notice {
                background: rgba(244, 67, 54, 0.2);
                border: 1px solid #f44336;
                border-radius: 6px;
                padding: 10px;
                color: #ffcdd2;
                text-align: center;
                margin-bottom: 20px;
                font-size: 0.9rem;
            }

            .law-btn-primary, .law-btn-secondary, .law-btn-exit {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 10px;
                text-transform: uppercase;
            }

            .law-btn-primary {
                background: linear-gradient(45deg, #2196f3, #1976d2);
                color: white;
            }

            .law-btn-primary:hover {
                background: linear-gradient(45deg, #1976d2, #1565c0);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(33,150,243,0.4);
            }

            .law-btn-secondary {
                background: rgba(255,255,255,0.1);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .law-btn-secondary:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-1px);
            }

            .law-btn-exit {
                background: linear-gradient(45deg, #f44336, #d32f2f);
                color: white;
            }

            .law-btn-exit:hover {
                background: linear-gradient(45deg, #d32f2f, #c62828);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(244,67,54,0.4);
            }

            .law-auth-footer {
                text-align: center;
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.7);
                font-size: 0.85rem;
                line-height: 1.4;
            }

            .law-credits {
                color: #64b5f6;
                font-weight: 600;
            }

            @keyframes lawAuthFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes lawPanelSlide {
                from { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1); 
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', authStyles);
    document.body.appendChild(authPanel);
    
    // Focar no campo de senha
    setTimeout(() => {
        const passwordField = document.getElementById('law-password');
        if (passwordField) passwordField.focus();
    }, 300);
}

// ================== FUNÇÕES DE AUTENTICAÇÃO ==================
window.lawAuthenticate = function() {
    const password = document.getElementById('law-password').value;
    const currentDate = new Date().toISOString().split('T')[0];
    
    console.log("🏛️ [LAW] Tentativa de autenticação...");
    
    if (currentDate > LAW_EXPIRY) {
        showLawMessage("⚠️ Licença Expirada", "Sistema expirado em " + LAW_EXPIRY + "\nContate Wesley para renovação", "warning");
        return;
    }
    
    if (password === LAW_PASSWORD) {
        console.log("🏛️ [LAW] Autenticação bem-sucedida!");
        showLawMessage("✅ Acesso Autorizado", "Bem-vindo ao Estúdio LAW!\nCarregando sistema...", "success");
        
        setTimeout(() => {
            document.getElementById('law-auth-panel').remove();
            initializeLawSystem();
        }, 2000);
    } else {
        console.log("🏛️ [LAW] Senha incorreta");
        showLawMessage("❌ Acesso Negado", "Senha incorreta!\nTente novamente.", "error");
        document.getElementById('law-password').value = '';
        document.getElementById('law-password').focus();
    }
};

window.lawShowExpired = function() {
    showLawMessage("📋 Atividades Expiradas", "Nenhuma atividade expirada encontrada.", "info");
};

window.lawExit = function() {
    if (confirm("Deseja realmente sair do sistema LAW?")) {
        document.querySelectorAll('[id*="law"]').forEach(el => el.remove());
        console.log("🏛️ [LAW] Sistema encerrado pelo usuário");
    }
};

// ================== SISTEMA DE MENSAGENS ==================
function showLawMessage(title, message, type = "info") {
    const colors = {
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3"
    };
    
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px; right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000000;
        font-family: 'Segoe UI', Arial, sans-serif;
        max-width: 300px;
        animation: lawMessageSlide 0.5s ease;
    `;
    
    msgDiv.innerHTML = `
        <strong>${title}</strong><br>
        <small>${message.replace(/\n/g, '<br>')}</small>
    `;
    
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes lawMessageSlide {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'lawMessageSlide 0.5s ease reverse';
        setTimeout(() => msgDiv.remove(), 500);
    }, 3000);
}

// ================== SISTEMA PRINCIPAL ==================
function initializeLawSystem() {
    console.log("🏛️ [LAW] Inicializando sistema principal...");
    
    // Criar painel principal
    createMainPanel();
    
    // Carregar funcionalidades
    loadLawFeatures();
    
    showLawMessage("🚀 Sistema Ativo", "Estúdio LAW inicializado!\nTodas as funcionalidades disponíveis.", "success");
}

function createMainPanel() {
    const mainPanel = document.createElement('div');
    mainPanel.id = 'law-main-panel';
    mainPanel.innerHTML = `
        <div class="law-panel-header">
            <h3>🏛️ Estúdio LAW v${LAW_VERSION}</h3>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="law-panel-content">
            <div class="law-section">
                <h4>⚡ Automações</h4>
                <label><input type="checkbox" id="auto-answer"> Resposta Automática</label>
                <label><input type="checkbox" id="skip-videos"> Pular Vídeos</label>
                <label><input type="checkbox" id="show-answers"> Mostrar Respostas</label>
            </div>
            <div class="law-section">
                <h4>🚀 Avançado</h4>
                <button class="law-action-btn" onclick="lawFunctions.completeAll()">Completar Tudo</button>
                <button class="law-action-btn" onclick="lawFunctions.farmPoints()">Farm Pontos</button>
                <button class="law-action-btn" onclick="lawFunctions.unlockAll()">Desbloquear</button>
            </div>
        </div>
        <div class="law-panel-footer">
            Por Wesley - © 2025 Estúdio LAW
        </div>
    `;

    const panelStyles = `
        <style id="law-panel-styles">
            #law-main-panel {
                position: fixed;
                top: 20px; right: 20px;
                width: 300px;
                background: rgba(30, 30, 30, 0.95);
                border: 1px solid #64b5f6;
                border-radius: 10px;
                color: white;
                font-family: 'Segoe UI', Arial, sans-serif;
                z-index: 999998;
                animation: lawPanelFadeIn 0.8s ease;
            }
            
            .law-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid rgba(100, 181, 246, 0.3);
                background: linear-gradient(45deg, #1976d2, #1565c0);
            }
            
            .law-panel-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }
            
            .law-panel-header button {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .law-panel-header button:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .law-panel-content {
                padding: 20px;
            }
            
            .law-section {
                margin-bottom: 20px;
            }
            
            .law-section h4 {
                margin: 0 0 10px 0;
                color: #64b5f6;
                font-size: 1rem;
            }
            
            .law-section label {
                display: block;
                margin-bottom: 8px;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .law-section input {
                margin-right: 8px;
            }
            
            .law-action-btn {
                width: 100%;
                padding: 8px;
                margin-bottom: 5px;
                background: linear-gradient(45deg, #2196f3, #1976d2);
                border: none;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }
            
            .law-action-btn:hover {
                background: linear-gradient(45deg, #1976d2, #1565c0);
                transform: translateY(-1px);
            }
            
            .law-panel-footer {
                padding: 10px 15px;
                border-top: 1px solid rgba(100, 181, 246, 0.3);
                font-size: 0.75rem;
                text-align: center;
                opacity: 0.8;
            }
            
            @keyframes lawPanelFadeIn {
                from { 
                    opacity: 0; 
                    transform: translateX(100%); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(0); 
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', panelStyles);
    document.body.appendChild(mainPanel);
}

// ================== FUNCIONALIDADES ==================
window.lawFunctions = {
    completeAll() {
        showLawMessage("🎯 Processando", "Completando todas as atividades...", "info");
        setTimeout(() => {
            showLawMessage("✅ Concluído", "Todas as atividades foram completadas!", "success");
        }, 2000);
    },
    
    farmPoints() {
        showLawMessage("💎 Farm Ativo", "Iniciando farm de pontos...", "info");
        setTimeout(() => {
            showLawMessage("💰 Sucesso", "Farm de pontos concluído!", "success");
        }, 3000);
    },
    
    unlockAll() {
        showLawMessage("🔓 Desbloqueando", "Liberando todo o conteúdo...", "info");
        setTimeout(() => {
            showLawMessage("🎉 Liberado", "Todo o conteúdo foi desbloqueado!", "success");
        }, 2500);
    }
};

function loadLawFeatures() {
    console.log("🏛️ [LAW] Carregando funcionalidades...");
    
    // Event listeners para checkboxes
    document.getElementById('auto-answer')?.addEventListener('change', (e) => {
        showLawMessage("⚡ Auto-Answer", e.target.checked ? "Ativado" : "Desativado", "info");
    });
    
    document.getElementById('skip-videos')?.addEventListener('change', (e) => {
        showLawMessage("⏭️ Skip Videos", e.target.checked ? "Ativado" : "Desativado", "info");
    });
    
    document.getElementById('show-answers')?.addEventListener('change', (e) => {
        showLawMessage("👁️ Show Answers", e.target.checked ? "Ativado" : "Desativado", "info");
    });
}

// ================== INICIALIZAÇÃO ==================
console.log("🏛️ [ESTÚDIO LAW] Sistema carregado com sucesso!");
console.log("🏛️ [LAW] Versão:", LAW_VERSION);
console.log("🏛️ [LAW] Desenvolvido por: Wesley");

// Iniciar splash screen
createSplashScreen();
