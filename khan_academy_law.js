const ver = "LAW v1.0.0";
let isDev = false;

const repoPath = `https://raw.githubusercontent.com/EstudioLAW/LAW-Academy-Tools/refs/heads/${isDev ? "dev/" : "main/"}/`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

/* User Data - Estúdio LAW */
let user = {
    username: "LAW_User",
    nickname: "Usuário LAW",
    UID: 0,
    lawVersion: ver
}

let loadedLAWModules = [];

/* LAW Elements */
const lawUnloader = document.createElement('lawUnloader');
const lawDropdownMenu = document.createElement('lawDropDownMenu');
const lawWatermark = document.createElement('lawWatermark');
const lawStatsPanel = document.createElement('lawStatsPanel');
const lawSplashScreen = document.createElement('lawSplashScreen');

/* LAW Features */
window.lawFeatures = {
    smartAnswers: true,
    videoBooster: true,
    showSolutions: false,
    autoComplete: false,
    lawBanner: true,
    nextSuggestion: false,
    repeatMode: false,
    timeOptimizer: false,
    lawTheme: true
};

window.lawConfigs = {
    autoDelay: 3,
    customUser: "",
    customAvatar: "",
    lawColor: "#00ff41", // Verde matrix style
    lawSecondary: "#003311"
};

/* LAW Security System */
document.addEventListener('contextmenu', (e) => !window.lawDebugMode && e.preventDefault());
document.addEventListener('keydown', (e) => { 
    if (!window.lawDebugMode && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { 
        e.preventDefault(); 
        lawToast("🔒 LAW Security: Inspeção bloqueada", 2000);
    } 
});

console.log(Object.defineProperties(new Error, { 
    toString: {value() {(new Error).stack.includes('toString@') && location.reload();}}, 
    message: {get() {location.reload();}} 
}));

/* LAW Styles */
document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        @font-face {
            font-family: 'LAW-Font';
            src: url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        }
        
        .law-glow {
            text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41;
        }
        
        .law-border {
            border: 2px solid #00ff41;
            box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
        }
    `
}));

document.head.appendChild(Object.assign(document.createElement('style'), {
    innerHTML: `
        ::-webkit-scrollbar { width: 12px; } 
        ::-webkit-scrollbar-track { background: #001a00; } 
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(45deg, #00ff41, #003311); 
            border-radius: 10px; 
        } 
        ::-webkit-scrollbar-thumb:hover { background: #00ff41; }
    `
}));

// LAW Favicon
document.querySelector("link[rel~='icon']").href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚖️</text></svg>';

/* LAW Event System */
class LAWEventEmitter {
    constructor() {
        this.events = {};
        this.lawId = "LAW_" + Date.now();
    }
    
    on(event, callback) {
        if (typeof event === "string") event = [event];
        event.forEach(e => {
            this.events[e] || (this.events[e] = []);
            this.events[e].push(callback);
        });
    }
    
    off(event, callback) {
        if (typeof event === "string") event = [event];
        event.forEach(e => {
            this.events[e] && (this.events[e] = this.events[e].filter(c => c !== callback));
        });
    }
    
    emit(event, ...args) {
        this.events[event] && this.events[event].forEach(callback => {
            callback(...args);
        });
    }
    
    once(event, callback) {
        if (typeof event === "string") event = [event];
        let wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

const lawSystem = new LAWEventEmitter();

new MutationObserver((mutationsList) => { 
    for (let mutation of mutationsList) 
        if (mutation.type === 'childList') 
            lawSystem.emit('domChanged'); 
}).observe(document.body, { childList: true, subtree: true });

/* LAW Functions */
window.lawDebug = function(text) { 
    console.log(`%c[LAW DEBUG] ${text}`, 'color: #00ff41; font-weight: bold;'); 
};

const lawDelay = ms => new Promise(resolve => setTimeout(resolve, ms));

const lawPlayAudio = url => { 
    const audio = new Audio(url); 
    audio.play(); 
    lawDebug(`🔊 LAW Audio: ${url}`); 
};

const lawClickElement = selector => { 
    const element = document.querySelector(selector); 
    if (element) { 
        element.click(); 
        lawToast(`⚡ LAW: Elemento ${selector} ativado`, 1000); 
    } 
};

function lawToast(text, duration = 5000, gravity = 'bottom') { 
    Toastify({ 
        text: `⚖️ ${text}`, 
        duration: duration, 
        gravity: gravity, 
        position: "center", 
        stopOnFocus: true, 
        style: { 
            background: "linear-gradient(45deg, #001a00, #003311)", 
            border: "1px solid #00ff41",
            color: "#00ff41",
            fontFamily: "Orbitron, monospace",
            fontWeight: "bold"
        } 
    }).showToast(); 
    lawDebug(text); 
}

async function showLAWSplashScreen() { 
    lawSplashScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #000000, #001a00);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.8s ease;
        user-select: none;
        color: #00ff41;
        font-family: Orbitron, monospace;
        font-size: 36px;
        text-align: center;
        font-weight: 900;
    `; 
    
    lawSplashScreen.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚖️</div>
            <div class="law-glow">ESTÚDIO LAW</div>
            <div style="font-size: 16px; margin-top: 10px; opacity: 0.8;">Academy Tools ${ver}</div>
            <div style="font-size: 12px; margin-top: 20px; opacity: 0.6;">Carregando sistema...</div>
        </div>
    `; 
    
    document.body.appendChild(lawSplashScreen); 
    setTimeout(() => lawSplashScreen.style.opacity = '1', 10);
}

async function hideLAWSplashScreen() { 
    lawSplashScreen.style.opacity = '0'; 
    setTimeout(() => lawSplashScreen.remove(), 1000); 
}

async function loadLAWScript(url, label) { 
    return fetch(url)
        .then(response => response.text())
        .then(script => { 
            loadedLAWModules.push(label); 
            eval(script); 
            lawDebug(`📦 LAW Module loaded: ${label}`);
        })
        .catch(error => {
            lawDebug(`❌ Failed to load LAW module: ${label} - ${error}`);
        }); 
}

async function loadLAWCss(url) { 
    return new Promise((resolve) => { 
        const link = document.createElement('link'); 
        link.rel = 'stylesheet'; 
        link.type = 'text/css'; 
        link.href = url; 
        link.onload = () => resolve(); 
        document.head.appendChild(link); 
    }); 
}

/* LAW Visual System */
function setupLAWInterface() {
    // Aqui você carregaria seus próprios módulos
    lawDebug("🎨 Setting up LAW Interface");
    // loadLAWScript(repoPath+'interface/lawMenu.js', 'LAW Menu');
    // loadLAWScript(repoPath+'interface/lawPanel.js', 'LAW Panel');
    // loadLAWScript(repoPath+'interface/lawWidgets.js', 'LAW Widgets');
}

/* LAW Core Functions */
function setupLAWCore() {
    lawDebug("⚙️ Setting up LAW Core");
    // loadLAWScript(repoPath+'core/smartAnswers.js', 'Smart Answers');
    // loadLAWScript(repoPath+'core/videoBooster.js', 'Video Booster');
    // loadLAWScript(repoPath+'core/timeOptimizer.js', 'Time Optimizer');
    // loadLAWScript(repoPath+'core/lawTheme.js', 'LAW Theme');
}

/* LAW Injection System */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert(`❌ Estúdio LAW - Erro de Injeção!\n\nVocê precisa executar o LAW Academy Tools no site do Khan Academy!\n\nRedirecionando...`); 
    window.location.href = "https://pt.khanacademy.org/"; 
}

// LAW Initialization
(async function initializeLAW() {
    lawDebug("🚀 Starting LAW Academy Tools...");
    
    showLAWSplashScreen();
    
    // Load external dependencies
    await loadLAWCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadLAWScript('https://cdn.jsdelivr.net/npm/toastify-js', 'Toastify');
    
    try {
        // Get user data
        const response = await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, {
            headers: {
                accept: "*/*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            body: JSON.stringify({
                "operationName": "getFullUserProfile",
                "variables": {},
                "query": "query getFullUserProfile { user { id nickname username } }"
            }),
            method: "POST",
            mode: "cors",
            credentials: "include"
        });
        
        const data = await response.json();
        if (data.data && data.data.user) {
            user = { 
                nickname: data.data.user.nickname, 
                username: data.data.user.username, 
                UID: data.data.user.id.slice(-5),
                lawVersion: ver
            };
        }
    } catch (error) {
        lawDebug("⚠️ Could not fetch user data: " + error);
    }
    
    lawToast("⚖️ LAW Academy Tools injetado com sucesso!");  
    lawPlayAudio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBj2U2/PEcSEGJ4HA8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBj2U2/PEcSEGKIDA8tiINwgZaLzs559NEAxQp+PwtmQcBjiO2fLNeSsFJHbH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2U2/PEcSEGKIDA8tiINwgZaLzs559NEAxQp+PwtmQcBjiO2fLNeSsFJHbH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2U2/PEcSEGKIDA8tiINwgZaLzs559NEAxQp+PwtmQcBjiO2fLNeSsFJHbH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2U2/PEcSEGKIDA8tiINwgZaLzs559NEAxQp+PwtmQcBjiO2fLNeSsFJHbH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2U2/PEcSEGKIDA8tiINwgZaLzs559NEAxQp+PwtmQcBjiO2fLNeSsFJHbH8N2QQAoUXrTp66hVFApGn');
    
    await lawDelay(1000);
    
    lawToast(`⭐ Bem-vindo(a) ao Estúdio LAW: ${user.nickname}`);
    
    if (device.apple) { 
        await lawDelay(500); 
        lawToast(`🍎 Sistema Apple detectado - LAW otimizado!`); 
    }
    
    if (device.mobile) {
        await lawDelay(500);
        lawToast(`📱 Versão mobile LAW ativada!`);
    }
    
    // Show loaded modules
    loadedLAWModules.forEach(module => 
        lawToast(`🔧 ${module} carregado!`, 2000, 'top')
    );
    
    await lawDelay(2000);
    
    hideLAWSplashScreen();
    setupLAWInterface();
    setupLAWCore();
    
    // Final message
    setTimeout(() => {
        lawToast(`🎯 LAW Academy Tools ${ver} pronto para uso!`, 4000);
        lawDebug("✅ LAW System fully initialized!");
    }, 1500);
    
    console.clear();
    console.log(`%c
    ███████╗███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗     ██╗      █████╗ ██╗    ██╗
    ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗    ██║     ██╔══██╗██║    ██║
    █████╗  ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║    ██║     ███████║██║ █╗ ██║
    ██╔══╝  ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║    ██║     ██╔══██║██║███╗██║
    ███████╗███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝    ███████╗██║  ██║╚███╔███╔╝
    ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝     ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 
    
    🎯 Academy Tools ${ver} - Desenvolvido com excelência
    ⚖️ Todos os direitos reservados
    `, 'color: #00ff41; font-weight: bold;');
    
})();

/* 
🎯 ESTÚDIO LAW - Academy Tools
⚖️ Versão: LAW v1.0.0
📅 Desenvolvido em 2024
🔒 Todos os direitos reservados

💡 Características:
- Interface completamente personalizada
- Sistema de segurança avançado  
- Tema LAW exclusivo
- Módulos otimizados
- Compatibilidade total

🚀 Para suporte e atualizações:
   contato@estudiolaw.com
*/
