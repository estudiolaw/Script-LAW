const ver = "LAW Studio Edition V4.0.0";
let isDev = false;

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
const lawPanel = document.createElement('lawPanel');

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
    rgbLogo: false,
    lawBranding: true,
    enhancedPanel: true
};

window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: "",
    lawStudioMode: true,
    panelTheme: "dark"
};

/* Security */
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => { 
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { 
        e.preventDefault(); 
    } 
});

console.log(Object.defineProperties(new Error, { 
    toString: {value() {(new Error).stack.includes('toString@') && location.reload();}}, 
    message: {get() {location.reload();}}, 
}));

/* Enhanced Styles with LAW Branding */
document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @font-face {
            font-family: 'MuseoSans';
            src: url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf') format('truetype');
        }
        
        /* LAW Studio Custom Scrollbar */
        ::-webkit-scrollbar { 
            width: 12px; 
        } 
        ::-webkit-scrollbar-track { 
            background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
            border-radius: 10px;
        } 
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            border-radius: 10px;
            border: 2px solid #1a1a1a;
        } 
        ::-webkit-scrollbar-thumb:hover { 
            background: linear-gradient(45deg, #ff5252, #26c6da, #42a5f5);
        }
        
        /* LAW Panel Styles */
        .law-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            min-height: 200px;
            background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(30,30,30,0.95) 100%);
            border: 2px solid transparent;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            color: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .law-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            background-size: 300% 300%;
            animation: gradientShift 4s ease infinite;
            z-index: -1;
            border-radius: 15px;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .law-header {
            padding: 15px 20px;
            background: rgba(0,0,0,0.8);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .law-logo {
            font-size: 20px;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .law-version {
            font-size: 12px;
            color: rgba(255,255,255,0.7);
            font-weight: 300;
        }
        
        .law-content {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .law-feature {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .law-feature:hover {
            background: rgba(255,255,255,0.1);
            transform: translateX(5px);
        }
        
        .law-feature-name {
            font-weight: 500;
            font-size: 14px;
        }
        
        .law-toggle {
            width: 50px;
            height: 25px;
            background: #333;
            border-radius: 25px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .law-toggle.active {
            background: linear-gradient(45deg, #4ecdc4, #45b7d1);
        }
        
        .law-toggle::after {
            content: '';
            position: absolute;
            width: 21px;
            height: 21px;
            background: white;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;
        }
        
        .law-toggle.active::after {
            transform: translateX(25px);
        }
        
        .law-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }
        
        .law-stat {
            background: rgba(255,255,255,0.05);
            padding: 10px;
            border-radius: 8px;
            text-align: center;
        }
        
        .law-stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #4ecdc4;
        }
        
        .law-stat-label {
            font-size: 12px;
            color: rgba(255,255,255,0.7);
        }
        
        .law-minimize {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 5px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .law-minimize:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .law-panel.minimized {
            width: 200px;
            height: 60px;
        }
        
        .law-panel.minimized .law-content {
            display: none;
        }
    `
}));

document.head.appendChild(Object.assign(document.createElement('style'), {
    innerHTML: "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"
}));

document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Enhanced Event Emitter */
class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) }
    off(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e)) }) }
    emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) }
    once(t, e) { "string" == typeof t && (t = [t]); let s = (...i) => { e(...i), this.off(t, s) }; this.on(t, s) }
};

const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { 
    for (let mutation of mutationsList) 
        if (mutation.type === 'childList') 
            plppdo.emit('domChanged'); 
}).observe(document.body, { childList: true, subtree: true });

/* Enhanced Functions */
window.debug = function(text) { console.log(`[LAW DEBUG] ${text}`); }

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { 
    const audio = new Audio(url); 
    audio.volume = 0.3;
    audio.play(); 
    debug(`🔊 Playing audio from ${url}`); 
};

const findAndClickBySelector = selector => { 
    const element = document.querySelector(selector); 
    if (element) { 
        element.click(); 
        sendToast(`⭕ Clicando em ${selector}...`, 1000); 
    } 
};

function sendToast(text, duration = 5000, gravity = 'bottom') { 
    Toastify({ 
        text: text, 
        duration: duration, 
        gravity: gravity, 
        position: "center", 
        stopOnFocus: true, 
        style: { 
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        } 
    }).showToast(); 
    debug(text); 
};

/* Enhanced Splash Screen */
async function showSplashScreen() { 
    splashScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
        user-select: none;
        color: white;
        font-family: Poppins, sans-serif;
        font-size: 36px;
        text-align: center;
        flex-direction: column;
    `; 
    
    splashScreen.innerHTML = `
        <div style="margin-bottom: 20px;">
            <span style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">LAW STUDIO</span>
        </div>
        <div style="font-size: 24px; margin-bottom: 10px;">
            <span style="color: white;">KHANWARE</span><span style="color: #72ff72;">.SPACE</span>
        </div>
        <div style="font-size: 14px; color: rgba(255,255,255,0.7); font-weight: 300;">
            Enhanced Edition
        </div>
        <div style="margin-top: 30px; font-size: 12px; color: rgba(255,255,255,0.5);">
            Carregando recursos avançados...
        </div>
    `; 
    
    document.body.appendChild(splashScreen); 
    setTimeout(() => splashScreen.style.opacity = '1', 10);
};

async function hideSplashScreen() { 
    splashScreen.style.opacity = '0'; 
    setTimeout(() => splashScreen.remove(), 1000); 
};

/* Enhanced LAW Panel */
function createLAWPanel() {
    lawPanel.className = 'law-panel';
    lawPanel.innerHTML = `
        <div class="law-header">
            <div>
                <div class="law-logo">LAW STUDIO</div>
                <div class="law-version">${ver}</div>
            </div>
            <button class="law-minimize" onclick="togglePanel()">−</button>
        </div>
        <div class="law-content">
            <div class="law-feature">
                <span class="law-feature-name">🎯 Question Spoof</span>
                <div class="law-toggle ${window.features.questionSpoof ? 'active' : ''}" onclick="toggleFeature('questionSpoof')"></div>
            </div>
            <div class="law-feature">
                <span class="law-feature-name">📹 Video Spoof</span>
                <div class="law-toggle ${window.features.videoSpoof ? 'active' : ''}" onclick="toggleFeature('videoSpoof')"></div>
            </div>
            <div class="law-feature">
                <span class="law-feature-name">👁️ Show Answers</span>
                <div class="law-toggle ${window.features.showAnswers ? 'active' : ''}" onclick="toggleFeature('showAnswers')"></div>
            </div>
            <div class="law-feature">
                <span class="law-feature-name">🤖 Auto Answer</span>
                <div class="law-toggle ${window.features.autoAnswer ? 'active' : ''}" onclick="toggleFeature('autoAnswer')"></div>
            </div>
            <div class="law-feature">
                <span class="law-feature-name">⏱️ Minute Farmer</span>
                <div class="law-toggle ${window.features.minuteFarmer ? 'active' : ''}" onclick="toggleFeature('minuteFarmer')"></div>
            </div>
            <div class="law-feature">
                <span class="law-feature-name">🌈 RGB Logo</span>
                <div class="law-toggle ${window.features.rgbLogo ? 'active' : ''}" onclick="toggleFeature('rgbLogo')"></div>
            </div>
            
            <div class="law-stats">
                <div class="law-stat">
                    <div class="law-stat-value" id="lawPluginCount">${loadedPlugins.length}</div>
                    <div class="law-stat-label">Plugins</div>
                </div>
                <div class="law-stat">
                    <div class="law-stat-value" id="lawUserUID">${user.UID}</div>
                    <div class="law-stat-label">User ID</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(lawPanel);
}

window.togglePanel = function() {
    lawPanel.classList.toggle('minimized');
    const btn = lawPanel.querySelector('.law-minimize');
    btn.textContent = lawPanel.classList.contains('minimized') ? '+' : '−';
}

window.toggleFeature = function(feature) {
    window.features[feature] = !window.features[feature];
    const toggle = document.querySelector(`[onclick="toggleFeature('${feature}')"]`);
    toggle.classList.toggle('active');
    
    sendToast(`${feature} ${window.features[feature] ? 'ativado' : 'desativado'}!`, 2000);
    
    // Emit event for feature change
    plppdo.emit('featureToggled', feature, window.features[feature]);
}

async function loadScript(url, label) { 
    return fetch(url).then(response => response.text()).then(script => { 
        loadedPlugins.push(label); 
        eval(script); 
        document.getElementById('lawPluginCount').textContent = loadedPlugins.length;
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

/* Enhanced Visual Functions */
function setupMenu() {
    loadScript(repoPath + 'visuals/mainMenu.js', 'mainMenu');
    loadScript(repoPath + 'visuals/statusPanel.js', 'statusPanel');
    loadScript(repoPath + 'visuals/widgetBot.js', 'widgetBot');
    if (isDev) loadScript(repoPath + 'visuals/devTab.js', 'devTab');
}

/* Enhanced Main Functions */
function setupMain() {
    loadScript(repoPath + 'functions/questionSpoof.js', 'questionSpoof');
    loadScript(repoPath + 'functions/videoSpoof.js', 'videoSpoof');
    loadScript(repoPath + 'functions/minuteFarm.js', 'minuteFarm');
    loadScript(repoPath + 'functions/spoofUser.js', 'spoofUser');
    loadScript(repoPath + 'functions/answerRevealer.js', 'answerRevealer');
    loadScript(repoPath + 'functions/rgbLogo.js', 'rgbLogo');
    loadScript(repoPath + 'functions/customBanner.js', 'customBanner');
    loadScript(repoPath + 'functions/autoAnswer.js', 'autoAnswer');
}

/* Enhanced Injection */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert("❌ LAW Studio Khanware Failed to Inject!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); 
    window.location.href = "https://pt.khanacademy.org/"; 
}

showSplashScreen();

// Enhanced loading sequence
loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs')
    .then(() => { 
        onekoEl = document.getElementById('oneko'); 
        onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')"; 
        onekoEl.style.display = "none"; 
    });

loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin')
    .then(() => { 
        DarkReader.setFetchMethod(window.fetch); 
        DarkReader.enable(); 
    });

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');

loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {
        await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, {
            headers: {
                accept: "*/*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                priority: "u=1, i",
                "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-ka-fkey": "1"
            },
            referrer: "https://pt.khanacademy.org/profile/me/teacher/kaid_589810246138844031185299/class/6245691961556992",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: '{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\"can_do_what_only_admins_can_do\\")\\n    isPublisher: hasPermission(name: \\"can_publish\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\"can_moderate_users\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isFormalTeacher\\n    isK4dStudent\\n    isKmapStudent\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\"can_ban_users\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(\\n      name: \\"can_send_moderator_messages\\"\\n      scope: GLOBAL\\n    )\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    includesKmapDistrictOwnedData\\n    includesK4dDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    hasAccessToAIGuideCompanionMode\\n    hasAccessToAIGuideLearner\\n    hasAccessToAIGuideDistrictAdmin\\n    hasAccessToAIGuideParent\\n    hasAccessToAIGuideTeacher\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    region\\n    userDistrictInfos {\\n      id\\n      isKAD\\n      district {\\n        id\\n        region\\n        __typename\\n      }\\n      __typename\\n    }\\n    schoolAffiliation {\\n      id\\n      location\\n      __typename\\n    }\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}"}',
            method: "POST",
            mode: "cors",
            credentials: "include"
        })
            .then(async response => { 
                let data = await response.json(); 
                user = { 
                    nickname: data.data.user.nickname, 
                    username: data.data.user.username, 
                    UID: data.data.user.id.slice(-5) 
                }; 
                document.getElementById('lawUserUID').textContent = user.UID;
            });

        sendToast("🌿 LAW Studio Khanware injetado com sucesso!");

        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

        await delay(500);

        sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
        sendToast(`🎨 LAW Studio Edition ativa!`, 3000);
        
        if (device.apple) { 
            await delay(500); 
            sendToast(`🪽 Que tal comprar um Samsung?`); 
        }

        loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top'));

        hideSplashScreen();
        createLAWPanel();
        setupMenu();
        setupMain();

        console.clear();
        console.log(`
%c╔══════════════════════════════════════╗
║              LAW STUDIO              ║
║           KHANWARE ENHANCED          ║
║                                      ║
║    Enhanced by LAW Studio Team       ║
║         Version: ${ver}      ║
╚══════════════════════════════════════╝`, 
        'color: #4ecdc4; font-family: monospace; font-size: 12px;');
    });

/* 
═══════════════════════════════════════════════════════════════
  LAW STUDIO ENHANCED EDITION
  
  Melhorias implementadas:
  • Interface moderna com gradientes animados
  • Painel de controle aprimorado e interativo
  • Marca LAW Studio integrada
  • Animações suaves e efeitos visuais
  • Sistema de notificações melhorado
  • Scrollbar customizada
  • Splash screen redesenhada
  • Fontes Google Fonts (Poppins)
  • Sistema de stats em tempo real
  • Minimização do painel
  • Toggles visuais para recursos
  
  Créditos originais mantidos para o desenvolvedor original
═══════════════════════════════════════════════════════════════
*/

/* Original credits maintained - Thank you to everyone who has purchased access */
