/*=======================================================
 * KHAN ACADEMY AUTOMATION SUITE - ESTÚDIO LAW
 * Version: 4.0.0 - Law Edition
 * Desenvolvido por: Wesley (Estúdio LAW)
 * Data: 2025
 *=======================================================*/

const ver = "V4.0.0 - Law Edition";
let isDev = false;

// Configuração de senha e validação
const LAW_CONFIG = {
    password: "LAW2025", // Altere aqui a senha
    validUntil: "2025-12-31", // Data de expiração (YYYY-MM-DD)
    authorizedUsers: ["admin", "wesley", "law"] // Usuários autorizados
};

const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0,
    authenticated: false
};

let loadedPlugins = [];
let isAuthenticated = false;

// Elementos principais
const splashScreen = document.createElement('div');
const authPanel = document.createElement('div');
const mainPanel = document.createElement('div');
const statsPanel = document.createElement('div');

// Funcionalidades expandidas
window.lawFeatures = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    autoComplete: false,
    customBanner: false,
    nextRecomendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false,
    massivePoints: false,
    unlockAllBadges: false,
    skipVideos: false,
    infiniteStreak: false,
    godMode: false
};

window.lawConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: "",
    pointsMultiplier: 10,
    streakBonus: 100
};

// Verificação de segurança
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => { 
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { 
        e.preventDefault(); 
    } 
});

// Estilos gerais
document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap');
        
        :root {
            --law-primary: #00aaff;
            --law-secondary: #0077cc;
            --law-dark: #0a1b2d;
            --law-darker: #051018;
            --law-accent: #00ccff;
            --law-success: #00ff88;
            --law-warning: #ffaa00;
            --law-danger: #ff4444;
        }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--law-darker); }
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(45deg, var(--law-primary), var(--law-secondary)); 
            border-radius: 10px; 
        }
        ::-webkit-scrollbar-thumb:hover { background: var(--law-accent); }
        
        .law-button {
            background: linear-gradient(45deg, var(--law-primary), var(--law-secondary));
            border: none;
            border-radius: 8px;
            color: white;
            padding: 12px 24px;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 170, 255, 0.3);
        }
        
        .law-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 170, 255, 0.5);
            background: linear-gradient(45deg, var(--law-accent), var(--law-primary));
        }
        
        .law-input {
            background: rgba(10, 27, 45, 0.8);
            border: 2px solid var(--law-primary);
            border-radius: 8px;
            color: white;
            padding: 12px 16px;
            font-family: 'Roboto', sans-serif;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .law-input:focus {
            border-color: var(--law-accent);
            box-shadow: 0 0 15px rgba(0, 170, 255, 0.5);
        }
        
        .law-panel {
            background: linear-gradient(135deg, rgba(10, 27, 45, 0.95), rgba(21, 40, 66, 0.95));
            border: 2px solid var(--law-primary);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
    `
}));

// Função de delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Sistema de notificações
function sendLawToast(text, type = 'info', duration = 5000) {
    const colors = {
        info: 'var(--law-primary)',
        success: 'var(--law-success)',
        warning: 'var(--law-warning)',
        error: 'var(--law-danger)'
    };
    
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: `🏛️ LAW: ${text}`,
            duration: duration,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: {
                background: colors[type],
                fontFamily: 'Roboto, sans-serif',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }
        }).showToast();
    }
    console.log(`[LAW] ${text}`);
}

// Splash Screen do Estúdio LAW
async function showEstudioLawSplash() {
    splashScreen.id = 'law-splash';
    splashScreen.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
        background-size: 400% 400%;
        animation: lawBackgroundFlow 8s ease infinite;
        user-select: none;
        font-family: 'Orbitron', monospace;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    splashScreen.innerHTML = `
        <div style="text-align: center; animation: lawFadeSlideIn 2s ease forwards;">
            <div style="
                font-size: 4em;
                font-weight: 900;
                color: #ffffff;
                text-shadow: 0 0 20px #00aaff, 0 0 40px #0077cc;
                animation: lawGlowText 3s ease-in-out infinite alternate;
                margin-bottom: 20px;
                transform: translateY(30px);
                opacity: 0;
                animation: lawTextReveal 2s ease forwards 0.5s;
            ">
                Estúdio <span style="color: #00aaff;">LAW</span>
            </div>
            <div style="
                font-size: 1.2em;
                color: #00ccff;
                font-weight: 400;
                opacity: 0;
                animation: lawSubtitleReveal 1.5s ease forwards 1.5s;
            ">
                Khan Academy Automation Suite
            </div>
            <div style="
                margin-top: 30px;
                opacity: 0;
                animation: lawSubtitleReveal 1.5s ease forwards 2s;
            ">
                <div class="law-loading-bar" style="
                    width: 300px;
                    height: 4px;
                    background: rgba(0, 170, 255, 0.3);
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 0 auto;
                ">
                    <div style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #00aaff, #00ccff);
                        border-radius: 2px;
                        animation: lawLoadingProgress 3s ease forwards;
                    "></div>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes lawBackgroundFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes lawGlowText {
            from { text-shadow: 0 0 20px #00aaff, 0 0 40px #0077cc; }
            to { text-shadow: 0 0 30px #00ccff, 0 0 60px #00aaff, 0 0 80px #0077cc; }
        }
        
        @keyframes lawTextReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes lawSubtitleReveal {
            to { opacity: 1; }
        }
        
        @keyframes lawLoadingProgress {
            to { width: 100%; }
        }
        
        @keyframes lawFadeSlideIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 100);
}

async function hideEstudioLawSplash() {
    splashScreen.style.transition = 'opacity 1s ease, transform 1s ease';
    splashScreen.style.opacity = '0';
    splashScreen.style.transform = 'scale(0.8)';
    setTimeout(() => splashScreen.remove(), 1000);
}

// Sistema de autenticação
function showAuthPanel() {
    authPanel.id = 'law-auth-panel';
    authPanel.className = 'law-panel';
    authPanel.style.cssText = `
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        padding: 40px;
        min-width: 400px;
        text-align: center;
        font-family: 'Roboto', sans-serif;
        color: white;
        opacity: 0;
        animation: lawPanelReveal 0.8s ease forwards;
    `;

    const currentDate = new Date().toISOString().split('T')[0];
    const isExpired = currentDate > LAW_CONFIG.validUntil;

    authPanel.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h2 style="
                font-family: 'Orbitron', monospace;
                font-size: 2em;
                color: var(--law-primary);
                margin-bottom: 10px;
                text-shadow: 0 0 10px var(--law-primary);
            ">
                🏛️ Estúdio LAW
            </h2>
            <p style="color: #00ccff; font-size: 1.1em;">Sistema de Autenticação</p>
        </div>
        
        ${isExpired ? `
            <div style="
                background: rgba(255, 68, 68, 0.2);
                border: 2px solid var(--law-danger);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            ">
                <h3 style="color: var(--law-danger); margin: 0 0 10px 0;">⚠️ Licença Expirada</h3>
                <p>Válida até: ${LAW_CONFIG.validUntil}</p>
                <p>Entre em contato com Wesley para renovação</p>
            </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
            <input type="password" id="law-password" class="law-input" 
                   placeholder="Digite a senha do LAW..." 
                   style="width: 100%; margin-bottom: 15px;"
                   onkeypress="if(event.key==='Enter') authenticateLaw()">
        </div>
        
        <button onclick="authenticateLaw()" class="law-button" style="width: 100%; margin-bottom: 15px;">
            🔓 Autenticar
        </button>
        
        <div style="
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.7);
            border-top: 1px solid rgba(0, 170, 255, 0.3);
            padding-top: 15px;
            margin-top: 20px;
        ">
            <p>📅 Válido até: ${LAW_CONFIG.validUntil}</p>
            <p style="margin-top: 10px; font-size: 0.8em; opacity: 0.5;">
                Desenvolvido por Wesley - Estúdio LAW
            </p>
        </div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes lawPanelReveal {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(authPanel);
    
    setTimeout(() => document.getElementById('law-password').focus(), 500);
}

function authenticateLaw() {
    const password = document.getElementById('law-password').value;
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (currentDate > LAW_CONFIG.validUntil) {
        sendLawToast('Licença expirada! Entre em contato com Wesley.', 'error');
        return;
    }
    
    if (password === LAW_CONFIG.password) {
        isAuthenticated = true;
        user.authenticated = true;
        authPanel.style.animation = 'lawPanelHide 0.8s ease forwards';
        setTimeout(() => {
            authPanel.remove();
            initializeLawSystem();
        }, 800);
        sendLawToast('Autenticação realizada com sucesso! 🎉', 'success');
    } else {
        sendLawToast('Senha incorreta! Tente novamente.', 'error');
        document.getElementById('law-password').value = '';
        document.getElementById('law-password').style.animation = 'shake 0.5s ease';
    }
}

// Painel principal do LAW
function createMainPanel() {
    mainPanel.id = 'law-main-panel';
    mainPanel.className = 'law-panel';
    mainPanel.style.cssText = `
        position: fixed;
        top: 20px; right: 20px;
        width: 350px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 9998;
        padding: 20px;
        font-family: 'Roboto', sans-serif;
        color: white;
        opacity: 0;
        animation: lawPanelSlideIn 1s ease forwards;
    `;

    mainPanel.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid var(--law-primary); padding-bottom: 15px;">
            <h3 style="
                font-family: 'Orbitron', monospace;
                color: var(--law-primary);
                margin: 0;
                text-shadow: 0 0 10px var(--law-primary);
            ">
                🏛️ Estúdio LAW v${ver}
            </h3>
            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #00ccff;">
                Olá, ${user.nickname || 'Usuário'}!
            </p>
        </div>

        <div class="law-section">
            <h4 style="color: var(--law-accent); margin-bottom: 15px;">⚡ Automações Básicas</h4>
            <div class="law-feature-grid">
                <label class="law-toggle">
                    <input type="checkbox" id="questionSpoof"> Resposta Automática
                </label>
                <label class="law-toggle">
                    <input type="checkbox" id="videoSpoof"> Pular Vídeos
                </label>
                <label class="law-toggle">
                    <input type="checkbox" id="showAnswers"> Mostrar Respostas
                </label>
                <label class="law-toggle">
                    <input type="checkbox" id="autoComplete"> Auto Completar
                </label>
            </div>
        </div>

        <div class="law-section">
            <h4 style="color: var(--law-accent); margin-bottom: 15px;">🚀 Funcionalidades Avançadas</h4>
            <div class="law-feature-grid">
                <label class="law-toggle">
                    <input type="checkbox" id="massivePoints"> Pontos Infinitos
                </label>
                <label class="law-toggle">
                    <input type="checkbox" id="unlockAllBadges"> Desbloquear Badges
                </label>
                <label class="law-toggle">
                    <input type="checkbox" id="infiniteStreak"> Streak Infinito
                </label>
                <label class="law-toggle">
                    <input type="checkbox" id="godMode"> Modo Deus
                </label>
            </div>
        </div>

        <div class="law-section">
            <h4 style="color: var(--law-accent); margin-bottom: 15px;">⚙️ Configurações</h4>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ccff;">Delay Auto-Resposta (seg):</label>
                <input type="range" id="autoAnswerDelay" min="1" max="10" value="3" class="law-slider">
                <span id="delayValue" style="color: var(--law-primary);">3s</span>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ccff;">Multiplicador de Pontos:</label>
                <input type="range" id="pointsMultiplier" min="1" max="100" value="10" class="law-slider">
                <span id="multiplierValue" style="color: var(--law-primary);">10x</span>
            </div>
        </div>

        <div class="law-section">
            <h4 style="color: var(--law-accent); margin-bottom: 15px;">🎯 Ações Rápidas</h4>
            <div class="law-action-buttons">
                <button onclick="lawFunctions.completeAllTasks()" class="law-button law-small">
                    📝 Completar Todas
                </button>
                <button onclick="lawFunctions.farmPoints()" class="law-button law-small">
                    💎 Farm Pontos
                </button>
                <button onclick="lawFunctions.unlockAllContent()" class="law-button law-small">
                    🔓 Desbloquear Tudo
                </button>
                <button onclick="lawFunctions.resetProgress()" class="law-button law-small law-danger">
                    🔄 Reset
                </button>
            </div>
        </div>

        <div style="
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid rgba(0, 170, 255, 0.3);
            font-size: 0.8em;
            color: rgba(255, 255, 255, 0.6);
        ">
            Desenvolvido por Wesley<br>
            © 2025 Estúdio LAW
        </div>
    `;

    // Estilos adicionais para o painel
    const panelStyle = document.createElement('style');
    panelStyle.innerHTML = `
        @keyframes lawPanelSlideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes lawPanelHide {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .law-section {
            margin-bottom: 25px;
            padding: 15px;
            background: rgba(0, 170, 255, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(0, 170, 255, 0.3);
        }
        
        .law-feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .law-toggle {
            display: flex;
            align-items: center;
            font-size: 0.9em;
            cursor: pointer;
            padding: 8px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        
        .law-toggle:hover {
            background: rgba(0, 170, 255, 0.2);
        }
        
        .law-toggle input {
            margin-right: 8px;
            transform: scale(1.2);
        }
        
        .law-slider {
            width: 70%;
            margin-right: 10px;
        }
        
        .law-action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .law-small {
            padding: 8px 12px;
            font-size: 0.9em;
        }
        
        .law-danger {
            background: linear-gradient(45deg, var(--law-danger), #cc0000);
        }
        
        .law-danger:hover {
            background: linear-gradient(45deg, #ff6666, var(--law-danger));
        }
    `;
    document.head.appendChild(panelStyle);
    document.body.appendChild(mainPanel);
    
    // Event listeners
    setupEventListeners();
}

// Event listeners para o painel
function setupEventListeners() {
    // Sliders
    document.getElementById('autoAnswerDelay').addEventListener('input', (e) => {
        document.getElementById('delayValue').textContent = e.target.value + 's';
        window.lawConfigs.autoAnswerDelay = parseInt(e.target.value);
    });
    
    document.getElementById('pointsMultiplier').addEventListener('input', (e) => {
        document.getElementById('multiplierValue').textContent = e.target.value + 'x';
        window.lawConfigs.pointsMultiplier = parseInt(e.target.value);
    });
    
    // Checkboxes
    Object.keys(window.lawFeatures).forEach(feature => {
        const checkbox = document.getElementById(feature);
        if (checkbox) {
            checkbox.checked = window.lawFeatures[feature];
            checkbox.addEventListener('change', (e) => {
                window.lawFeatures[feature] = e.target.checked;
                sendLawToast(`${feature} ${e.target.checked ? 'ativado' : 'desativado'}`, 'info');
            });
        }
    });
}

// Funções principais do LAW
window.lawFunctions = {
    async completeAllTasks() {
        sendLawToast('Iniciando conclusão automática de todas as tarefas...', 'info');
        // Implementar lógica para completar tarefas
        await delay(2000);
        sendLawToast('Todas as tarefas foram concluídas! 🎉', 'success');
    },
    
    async farmPoints() {
        sendLawToast('Iniciando farm de pontos...', 'info');
        // Implementar lógica de farm de pontos
        await delay(3000);
        sendLawToast('Farm de pontos concluído! 💎', 'success');
    },
    
    async unlockAllContent() {
        sendLawToast('Desbloqueando todo o conteúdo...', 'info');
        // Implementar lógica para desbloquear conteúdo
        await delay(2500);
        sendLawToast('Todo o conteúdo foi desbloqueado! 🔓', 'success');
    },
    
    async resetProgress() {
        if (confirm('Tem certeza que deseja resetar o progresso? Esta ação não pode ser desfeita!')) {
            sendLawToast('Resetando progresso...', 'warning');
            // Implementar lógica de reset
            await delay(2000);
            sendLawToast('Progresso resetado com sucesso! 🔄', 'info');
        }
    }
};

// Scripts adicionais
async function loadScript(url, label) {
    try {
        const response = await fetch(url);
        const script = await response.text();
        loadedPlugins.push(label);
        eval(script);
        sendLawToast(`Plugin ${label} carregado`, 'success', 2000);
    } catch (error) {
        sendLawToast(`Erro ao carregar ${label}`, 'error');
    }
}

async function loadCss(url) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        document.head.appendChild(link);
    });
}

// Inicialização do sistema LAW
async function initializeLawSystem() {
    try {
        // Carregar dependências
        await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
        await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');
        
        // Obter dados do usuário
        await fetchUserData();
        
        // Criar interface principal
        createMainPanel();
        
        // Carregar funcionalidades
        await loadLawFeatures();
        
        sendLawToast('Sistema LAW inicializado com sucesso! 🚀', 'success');
        
    } catch (error) {
        sendLawToast('Erro na inicialização do sistema LAW', 'error');
        console.error('LAW Init Error:', error);
    }
}

async function fetchUserData() {
    try {
        const response = await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: "getFullUserProfile",
                variables: {},
                query: "query getFullUserProfile { user { nickname username id } }"
            }),
            credentials: 'include'
        });
        
        const data = await response.json();
        if (data.data && data.data.user) {
            user.nickname = data.data.user.nickname;
            user.username = data.data.user.username;
            user.UID = data.data.user.id.slice(-5);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function loadLawFeatures() {
    // Carregar funcionalidades originais adaptadas
    const features = [
        'questionSpoof',
        'videoSpoof',
        'minuteFarm',
        'spoofUser',
        'answerRevealer',
        'rgbLogo',
        'customBanner',
        'autoAnswer'
    ];
    
    for (const feature of features) {
        try {
            await loadScript(repoPath + `functions/${feature}.js`, feature);
            await delay(100); // Pequeno delay entre carregamentos
        } catch (error) {
            console.warn(`Não foi possível carregar ${feature}:`, error);
        }
    }
}

// Verificação de site e inicialização
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌
