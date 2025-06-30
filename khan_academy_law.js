const ver = "V3.1.1";
let isDev = false;

// Usando o repositório do Khanware para as funções principais
const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/${isDev ? "dev/" : "main/"}`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

/* User */
let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
}

let loadedPlugins = [];

/* Elements */
const unloader = document.createElement('unloader');
const dropdownMenu = document.createElement('dropDownMenu');
const watermark = document.createElement('watermark');
const statsPanel = document.createElement('statsPanel');
const splashScreen = document.createElement('splashScreen');
const passwordScreen = document.createElement('passwordScreen');
const successScreen = document.createElement('successScreen');

/* Globals */
window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    customBanner: false,
    nextRecomendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false
};
window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: ""
};

/* Sistema de Senhas com Vencimento Individual */
const passwordSystem = {
    passwords: [
        {
            password: "1BMIDIAS",
            name: "Licença Básica Midias",
            expiryDate: "2025-12-31",
            description: "Acesso básico ao sistema"
        },
        {
            password: "270425",
            name: "Licença Especial",
            expiryDate: "2025-08-15",
            description: "Licença com data específica"
        },
        {
            password: "dogmal",
            name: "Licença Desenvolvimento",
            expiryDate: "2025-09-30",
            description: "Acesso para desenvolvimento"
        },
        {
            password: "kng120120",
            name: "Licença KNG",
            expiryDate: "2025-07-20",
            description: "Licença personalizada KNG"
        },
        {
            password: "BLUELAW",
            name: "Licença Blue Law",
            expiryDate: "2026-01-15",
            description: "Licença premium Blue Law"
        },
        {
            password: "STUDIOLAW",
            name: "Licença Studio Law",
            expiryDate: "2025-11-30",
            description: "Licença completa do estúdio"
        },
        {
            password: "LAWMASTER",
            name: "Licença Master",
            expiryDate: "2026-03-31",
            description: "Licença com todos os recursos"
        },
        {
            password: "AZULSTUDIO",
            name: "Licença Azul Studio",
            expiryDate: "2025-10-15",
            description: "Licença do estúdio azul"
        },
        {
            password: "LAWACCESS",
            name: "Licença de Acesso",
            expiryDate: "2025-08-30",
            description: "Licença de acesso padrão"
        },
        {
            password: "ESTUDIOAZUL",
            name: "Licença Estúdio Azul",
            expiryDate: "2025-12-15",
            description: "Licença premium do estúdio azul"
        }
    ],

    // Função para validar senha e verificar vencimento
    validatePassword(inputPassword) {
        const password = this.passwords.find(p => p.password === inputPassword);
        
        if (!password) {
            return { valid: false, reason: "Senha não encontrada" };
        }

        const currentDate = new Date();
        const expiryDate = new Date(password.expiryDate);
        
        if (currentDate > expiryDate) {
            return { 
                valid: false, 
                reason: "Senha expirada", 
                expiredDate: password.expiryDate,
                passwordName: password.name
            };
        }

        return { 
            valid: true, 
            password: password,
            daysUntilExpiry: Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24))
        };
    },

    // Função para obter informações da senha (para administradores)
    getPasswordInfo(inputPassword) {
        const password = this.passwords.find(p => p.password === inputPassword);
        return password || null;
    },

    // Função para listar todas as senhas (apenas para debug/admin)
    listAllPasswords() {
        return this.passwords.map(p => ({
            name: p.name,
            password: p.password,
            expiryDate: p.expiryDate,
            description: p.description,
            daysRemaining: Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        }));
    }
};

/* Security */
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => { if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { e.preventDefault(); } });
console.log(Object.defineProperties(new Error, { toString: {value() {(new Error).stack.includes('toString@') && location.reload();}}, message: {get() {location.reload();}}, }));

/* Styles */
document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}" }));
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"}));
document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Event Emitter */
class EventEmitter{constructor(){this.events={}}on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true });

/* Functions */
window.debug = function(text) { /* QuickFix */}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); debug(`🔊 Playing audio from ${url}`); };
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); } };

function sendToast(text, duration=5000, gravity='bottom') { 
    Toastify({ 
        text: text, 
        duration: duration, 
        gravity: gravity, 
        position: "center", 
        stopOnFocus: true, 
        style: { 
            background: "linear-gradient(135deg, #0a1a2f, #152842)",
            border: "1px solid #00aaff",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(0, 170, 255, 0.3)"
        } 
    }).showToast(); 
    debug(text); 
}

// Abertura Estúdio LAW
async function showEstudioLawSplash() {
    const style = document.createElement('style');
    style.id = 'estudio-law-style';
    style.innerHTML = `
        @keyframes backgroundFlow {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
        }
        @keyframes glowText {
            from { text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc; }
            to { text-shadow: 0 0 20px #00ccff, 0 0 30px #00aaff; }
        }
        @keyframes fadeSlideIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes particleFloat {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00aaff;
            border-radius: 50%;
            animation: particleFloat 8s linear infinite;
        }
    `;
    
    if (!document.getElementById('estudio-law-style')) {
        document.head.appendChild(style);
    }

    splashScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
        background-size: 400% 400%;
        animation: backgroundFlow 10s ease infinite;
        user-select: none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        opacity: 0; transition: opacity 0.5s ease;
    `;
    
    splashScreen.innerHTML = `
        <div id="particles"></div>
        <div id="estudio-law-text" style="
            font-size: 4em; font-weight: bold; color: #ffffff;
            text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
            animation: glowText 2s ease-in-out infinite alternate, fadeSlideIn 1.5s ease forwards;
            opacity: 0; transform: translateY(30px); text-align: center;
        ">
            Estúdio <span style="color:#00aaff;">LAW</span>
            <div style="font-size: 0.3em; margin-top: 20px; color: #66ccff;">
                Sistema Avançado de Aprendizagem
            </div>
        </div>
    `;
    
    // Adicionar partículas
    const particlesContainer = splashScreen.querySelector('#particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideEstudioLawSplash() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
}

// Sistema de Senha com Vencimento
async function showPasswordScreen() {
    const currentTime = new Date().toLocaleString('pt-BR');
    
    passwordScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9998;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #0a1a2f, #152842, #0f1c2e);
        background-size: 400% 400%;
        animation: backgroundFlow 15s ease infinite;
        user-select: none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        opacity: 0; transition: opacity 0.5s ease;
    `;
    
    passwordScreen.innerHTML = `
        <div style="
            background: rgba(15, 28, 46, 0.9);
            border: 2px solid #00aaff;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 0 30px rgba(0, 170, 255, 0.5);
            backdrop-filter: blur(10px);
            text-align: center;
            max-width: 400px;
            width: 90%;
        ">
            <div style="color: #00aaff; font-size: 2.5em; font-weight: bold; margin-bottom: 10px;">
                🔐 ACESSO RESTRITO
            </div>
            <div style="color: #66ccff; margin-bottom: 20px; font-size: 1.1em;">
                Sistema Estúdio LAW
            </div>
            <div style="color: #999; margin-bottom: 30px; font-size: 0.9em;">
                ${currentTime}
            </div>
            
            <input type="password" id="lawPassword" placeholder="Digite a senha de acesso..." style="
                width: 100%; padding: 15px; margin-bottom: 20px;
                background: rgba(0, 170, 255, 0.1);
                border: 2px solid #00aaff;
                border-radius: 10px;
                color: #ffffff;
                font-size: 1.1em;
                text-align: center;
                outline: none;
                transition: all 0.3s ease;
            ">
            
            <button id="lawSubmit" style="
                width: 100%; padding: 15px;
                background: linear-gradient(135deg, #00aaff, #0077cc);
                border: none; border-radius: 10px;
                color: white; font-size: 1.2em; font-weight: bold;
                cursor: pointer; transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 170, 255, 0.3);
            ">
                ACESSAR SISTEMA
            </button>
            
            <div id="passwordError" style="
                color: #ff4444; margin-top: 15px; font-size: 0.9em;
                opacity: 0; transition: opacity 0.3s ease;
            "></div>
            
            <div id="passwordSuccess" style="
                color: #44ff44; margin-top: 15px; font-size: 0.9em;
                opacity: 0; transition: opacity 0.3s ease;
            "></div>
            
            <div style="margin-top: 30px; color: #666; font-size: 0.8em;">
                Tentativas restantes: <span id="attempts">3</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(passwordScreen);
    setTimeout(() => passwordScreen.style.opacity = '1', 10);
    
    let attempts = 3;
    const passwordInput = document.getElementById('lawPassword');
    const submitButton = document.getElementById('lawSubmit');
    const errorDiv = document.getElementById('passwordError');
    const successDiv = document.getElementById('passwordSuccess');
    const attemptsSpan = document.getElementById('attempts');
    
    // Efeitos visuais no input
    passwordInput.addEventListener('focus', () => {
        passwordInput.style.boxShadow = '0 0 20px rgba(0, 170, 255, 0.5)';
        passwordInput.style.borderColor = '#00ccff';
    });
    
    passwordInput.addEventListener('blur', () => {
        passwordInput.style.boxShadow = 'none';
        passwordInput.style.borderColor = '#00aaff';
    });
    
    // Função de validação com sistema de vencimento
    const validatePassword = () => {
        const inputPassword = passwordInput.value.trim();
        const validation = passwordSystem.validatePassword(inputPassword);
        
        if (validation.valid) {
            // Senha válida
            const passwordInfo = validation.password;
            const daysUntilExpiry = validation.daysUntilExpiry;
            
            // Mostrar informações da licença
            successDiv.innerHTML = `
                ✅ Licença: ${passwordInfo.name}<br>
                📅 Válida até: ${new Date(passwordInfo.expiryDate).toLocaleDateString('pt-BR')}<br>
                ⏰ ${daysUntilExpiry} dias restantes
            `;
            successDiv.style.opacity = '1';
            
            // Armazenar informações da licença para uso no sistema
            window.currentLicense = {
                name: passwordInfo.name,
                description: passwordInfo.description,
                expiryDate: passwordInfo.expiryDate,
                daysRemaining: daysUntilExpiry
            };
            
            setTimeout(() => {
                hidePasswordScreen();
                showSuccessScreen();
            }, 2000);
            
            return true;
        } else {
            // Senha inválida ou expirada
            attempts--;
            attemptsSpan.textContent = attempts;
            
            if (validation.reason === "Senha expirada") {
                errorDiv.innerHTML = `
                    ❌ Licença "${validation.passwordName}" expirou!<br>
                    📅 Vencimento: ${new Date(validation.expiredDate).toLocaleDateString('pt-BR')}
                `;
            } else {
                errorDiv.textContent = validation.reason;
            }
            
            errorDiv.style.opacity = '1';
            
            if (attempts <= 0) {
                errorDiv.innerHTML = `
                    🚫 Acesso negado! Tentativas esgotadas.<br>
                    Redirecionando...
                `;
                setTimeout(() => {
                    window.location.href = "https://pt.khanacademy.org/";
                }, 3000);
            } else {
                setTimeout(() => {
                    passwordInput.style.borderColor = '#00aaff';
                    passwordInput.style.boxShadow = 'none';
                    errorDiv.style.opacity = '0';
                    successDiv.style.opacity = '0';
                }, 4000);
            }
            
            passwordInput.style.borderColor = '#ff4444';
            passwordInput.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.3)';
            passwordInput.value = '';
            return false;
        }
    };
    
    submitButton.addEventListener('click', validatePassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validatePassword();
    });
    
    // Focar no input
    setTimeout(() => passwordInput.focus(), 500);
}

async function hidePasswordScreen() {
    passwordScreen.style.opacity = '0';
    setTimeout(() => passwordScreen.remove(), 1000);
}

// Tela de Sucesso com informações da licença
async function showSuccessScreen() {
    const license = window.currentLicense;
    
    successScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9997;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #0a2f0a, #0f4f0f, #1a6b1a);
        background-size: 400% 400%;
        animation: backgroundFlow 10s ease infinite;
        user-select: none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        opacity: 0; transition: opacity 0.5s ease;
    `;
    
    successScreen.innerHTML = `
        <div style="
            text-align: center;
            animation: fadeSlideIn 1s ease forwards;
            opacity: 0; transform: translateY(-30px);
        ">
            <div style="font-size: 5em; color: #00ff00; margin-bottom: 20px;">
                ✅
            </div>
            <div style="color: #ffffff; font-size: 2.5em; font-weight: bold; margin-bottom: 15px;">
                ACESSO AUTORIZADO
            </div>
            <div style="color: #66ff66; font-size: 1.3em; margin-bottom: 20px;">
                ${license.name}
            </div>
            <div style="color: #ccffcc; font-size: 1em; margin-bottom: 20px;">
                ${license.description}
            </div>
            <div style="color: #ffff66; font-size: 0.9em; margin-bottom: 30px;">
                📅 Válida até: ${new Date(license.expiryDate).toLocaleDateString('pt-BR')}<br>
                ⏰ ${license.daysRemaining} dias restantes
            </div>
            <div style="color: #ccffcc; font-size: 1em;">
                Carregando sistema...
            </div>
            <div style="
                width: 300px; height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px; margin: 20px auto;
                overflow: hidden;
            ">
                <div id="loadingBar" style="
                    width: 0%; height: 100%;
                    background: linear-gradient(90deg, #00ff00, #66ff66);
                    border-radius: 2px;
                    transition: width 0.1s ease;
                "></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successScreen);
    setTimeout(() => successScreen.style.opacity = '1', 10);
    
    // Animação da barra de carregamento
    const loadingBar = document.getElementById('loadingBar');
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                hideSuccessScreen();
                // Iniciar carregamento das funcionalidades após a tela de sucesso
                initMainFunctions();
            }, 1000);
        }
        loadingBar.style.width = progress + '%';
    }, 100);
}

async function hideSuccessScreen() {
    successScreen.style.opacity = '0';
    setTimeout(() => successScreen.remove(), 1000);
}

async function loadScript(url, label) { 
    return fetch(url).then(response => response.text()).then(script => { 
        loadedPlugins.push(label); 
        eval(script); 
    }); 
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

/* Visual Functions */
function setupMenu() {
    // Carregar menus do Khanware (funcionais)
    console.log("🎯 Configurando menus funcionais...");
    loadScript(repoPath+'visuals/mainMenu.js', 'mainMenu');
    loadScript(repoPath+'visuals/statusPanel.js', 'statusPanel');
    // loadScript(repoPath+'visuals/widgetBot.js', 'widgetBot');
    if(isDev) loadScript(repoPath+'visuals/devTab.js', 'devTab');
}

/* Main Functions */ 
function setupMain(){
    // Carregar funções REAIS do Khanware
    console.log("⚡ Carregando módulos funcionais...");
    loadScript(repoPath+'functions/questionSpoof.js', 'questionSpoof');
    loadScript(repoPath+'functions/videoSpoof.js', 'videoSpoof');
    loadScript(repoPath+'functions/minuteFarm.js', 'minuteFarm');
    loadScript(repoPath+'functions/spoofUser.js', 'spoofUser');
    loadScript(repoPath+'functions/answerRevealer.js', 'answerRevealer');
    loadScript(repoPath+'functions/rgbLogo.js', 'rgbLogo');
    loadScript(repoPath+'functions/customBanner.js', 'customBanner');
    loadScript(repoPath+'functions/autoAnswer.js', 'autoAnswer');
}

// Função para inicializar as funcionalidades principais
async function initMainFunctions() {
    // Carregar dependências externas
    await loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs');
    if (window.onekoEl) {
        onekoEl = document.getElementById('oneko');
        onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
        onekoEl.style.display = "none";
    }
    
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
    if (window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable();
    }
    
    // Carregar perfil do usuário
    try {
        const response = await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, {
            headers: {
                accept: "*/*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            body: '{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    nickname\\n    points\\n    __typename\\n  }\\n}"}',
            method: "POST",
            mode: "cors",
            credentials: "include"
        });
        
        const data = await response.json();
        if (data.data && data.data.user) {
            user = { 
                nickname: data.data.user.nickname || "Usuário", 
                username: data.data.user.username || "username", 
                UID: data.data.user.id ? data.data.user.id.slice(-5) : "00000"
            };
        }
    } catch (error) {
        console.log("Erro ao carregar perfil:", error);
    }
    
    // Toasts de boas-vindas com informações da licença
    const license = window.currentLicense;
    sendToast("🌊 Estúdio LAW ativado com sucesso!", 3000);
    sendToast(`⭐ Bem-vindo(a): ${user.nickname}`, 3000);
    sendToast(`🎫 Licença: ${license.name}`, 3000);
    
    // Aviso se a licença está próxima do vencimento (menos de 30 dias)
    if (license.daysRemaining <= 30) {
        sendToast(`⚠️ Licença expira em ${license.daysRemaining} dias`, 5000);
    }
    
    if (device.apple) { 
        setTimeout(() => sendToast(`🍎 Sistema Apple detectado!`, 2000), 1000); 
    }
    
    // Tocar som de sucesso
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    // Carregar módulos principais
    setupMenu();
    setupMain();
    
    // Mostrar plugins carregados
    setTimeout(() => {
        loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top
