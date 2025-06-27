// ========================================
// ESTÚDIO LAW - SISTEMA PROFISSIONAL V4.0.0
// ========================================

(function() {
    'use strict';
    
    const ver = "V4.0.0-PRO";
    let isDev = false;
    let isAuthenticated = false;
    
    // Configurações do sistema
    const config = {
        repoPath: `https://raw.githubusercontent.com/YourRepo/EstudioLAW/refs/heads/${isDev ? "dev/" : "main/"}`,
        splashDuration: 3000,
        celebrationDuration: 3000
    };
    
    // Detecção de dispositivo
    const device = {
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
        apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
    };
    
    // Dados do usuário
    let user = {
        username: "Username",
        nickname: "Nickname",
        UID: 0
    };
    
    let loadedPlugins = [];
    
    // Sistema de senhas válidas com expiração
    const validPasswords = {
        'LAW-PRO-2025-001': { expires: '2025-12-31', hours: '23:59' },
        'LAW-ENT-2025-002': { expires: '2025-11-30', hours: '23:59' },
        'LAW-DEV-2025-003': { expires: '2025-10-31', hours: '23:59' },
        'LAW-ADM-2025-004': { expires: '2025-09-30', hours: '23:59' },
        'LAW-VIP-2025-005': { expires: '2025-08-31', hours: '23:59' },
        'LAW-MAX-2025-006': { expires: '2025-07-31', hours: '23:59' },
        'LAW-TOP-2025-007': { expires: '2025-06-30', hours: '23:59' },
        'LAW-CEO-2025-008': { expires: '2025-12-31', hours: '23:59' },
        'LAW-GOD-2025-009': { expires: '2025-12-31', hours: '23:59' },
        'LAW-ULT-2025-010': { expires: '2025-12-31', hours: '23:59' }
    };
    
    // Recursos do sistema
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
    
    // ========================================
    // SISTEMA DE SEGURANÇA AVANÇADO
    // ========================================
    
    function initSecurity() {
        // Bloquear menu de contexto
        document.addEventListener('contextmenu', (e) => {
            if (!window.disableSecurity) {
                e.preventDefault();
                showSecurityAlert();
            }
        });
        
        // Bloquear teclas de desenvolvedor
        document.addEventListener('keydown', (e) => {
            if (!window.disableSecurity) {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && ['I', 'C', 'J', 'K'].includes(e.key)) ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    console.clear();
                    showSecurityAlert();
                }
            }
        });
        
        // Anti-debug avançado
        let devtools = {open: false, orientation: null};
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || 
                window.outerWidth - window.innerWidth > 200) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    document.body.innerHTML = createSecurityBlock();
                }
            }
        }, 500);
        
        // Proteção contra console
        Object.defineProperty(console, 'clear', {
            value: function() {
                if (!window.disableSecurity) {
                    console.log('%c🔒 ESTÚDIO LAW - SISTEMA PROTEGIDO', 'color: #00aaff; font-size: 20px; font-weight: bold;');
                }
            }
        });
    }
    
    function showSecurityAlert() {
        if (!isAuthenticated) return;
        
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 68, 68, 0.95);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 99999;
            box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
        `;
        alert.textContent = '🔒 ACESSO NEGADO - Sistema Protegido';
        document.body.appendChild(alert);
        
        setTimeout(() => alert.remove(), 2000);
    }
    
    function createSecurityBlock() {
        return `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: linear-gradient(-45deg, #ff4444, #cc0000, #ff6666, #990000);
                background-size: 400% 400%;
                animation: backgroundFlow 3s ease infinite;
                font-family: 'Segoe UI', sans-serif;
                color: white;
                text-align: center;
                flex-direction: column;
            ">
                <div style="font-size: 4em; margin-bottom: 20px;">🔒</div>
                <div style="font-size: 2em; font-weight: bold; margin-bottom: 10px;">ACESSO NEGADO</div>
                <div style="font-size: 1.2em;">Sistema de Segurança Ativado</div>
            </div>
        `;
    }
    
    // ========================================
    // SISTEMA DE ESTILOS DINÂMICOS
    // ========================================
    
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'estudio-law-styles';
        style.innerHTML = `
            @keyframes backgroundFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
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
            
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(0, 170, 255, 0.3); }
                50% { box-shadow: 0 0 40px rgba(0, 170, 255, 0.6); }
            }
            
            @keyframes particles {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes celebration {
                0% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.2) rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); }
            }
            
            .law-particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            .law-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #00aaff, #0077cc);
                border-radius: 50%;
                animation: particles 15s linear infinite;
            }
        `;
        
        if (!document.getElementById('estudio-law-styles')) {
            document.head.appendChild(style);
        }
    }
    
    // ========================================
    // SISTEMA DE PARTÍCULAS
    // ========================================
    
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'law-particles';
        particlesContainer.id = 'law-particles';
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'law-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
    }
    
    // ========================================
    // SPLASH SCREEN ESTÚDIO LAW
    // ========================================
    
    async function showEstudioLawSplash() {
        const splashScreen = document.createElement('div');
        splashScreen.id = 'law-splash';
        splashScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
            background-size: 400% 400%;
            animation: backgroundFlow 10s ease infinite;
            user-select: none;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        splashScreen.innerHTML = `
            <div style="
                font-size: 4em;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0 0 10px #00aaff, 0 0 20px #0077cc;
                animation: glowText 2s ease-in-out infinite alternate,
                           fadeSlideIn 1.5s ease forwards;
                opacity: 0;
                transform: translateY(30px);
            ">
                Estúdio <span style="color:#00aaff;">LAW</span>
            </div>
        `;
        
        document.body.appendChild(splashScreen);
        setTimeout(() => splashScreen.style.opacity = '1', 10);
        
        return splashScreen;
    }
    
    async function hideEstudioLawSplash(splashScreen) {
        splashScreen.style.transition = 'opacity 0.8s ease';
        splashScreen.style.opacity = '0';
        
        setTimeout(() => {
            splashScreen.remove();
            showAuthSystem();
        }, 1000);
    }
    
    // ========================================
    // SISTEMA DE AUTENTICAÇÃO
    // ========================================
    
    function showAuthSystem() {
        const authSystem = document.createElement('div');
        authSystem.id = 'law-auth';
        authSystem.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
            background-size: 400% 400%;
            animation: backgroundFlow 15s ease infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        authSystem.innerHTML = `
            <div style="
                background: rgba(15, 28, 46, 0.95);
                border: 2px solid rgba(0, 170, 255, 0.3);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(20px);
                animation: pulseGlow 3s ease-in-out infinite;
                min-width: 400px;
                max-width: 500px;
                text-align: center;
            ">
                <div style="
                    color: #ffffff;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                    text-shadow: 0 0 10px #00aaff;
                ">Acesso Restrito</div>
                
                <div style="
                    color: #8ab4f8;
                    font-size: 1em;
                    margin-bottom: 30px;
                    opacity: 0.8;
                ">Digite sua licença de acesso</div>
                
                <input type="password" id="law-password" placeholder="••••••••••••••••" style="
                    width: 100%;
                    padding: 15px 20px;
                    font-size: 1.1em;
                    background: rgba(0, 0, 0, 0.7);
                    border: 2px solid rgba(0, 170, 255, 0.3);
                    border-radius: 10px;
                    color: #ffffff;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                    text-align: center;
                    letter-spacing: 2px;
                    box-sizing: border-box;
                ">
                
                <button id="law-auth-btn" style="
                    width: 100%;
                    padding: 15px;
                    font-size: 1.2em;
                    background: linear-gradient(45deg, #00aaff, #0077cc);
                    border: none;
                    border-radius: 10px;
                    color: #ffffff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">Autenticar</button>
                
                <div id="law-error" style="
                    color: #ff4444;
                    margin-top: 15px;
                    font-size: 0.9em;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                ">Licença inválida ou expirada</div>
            </div>
        `;
        
        document.body.appendChild(authSystem);
        
        // Eventos
        const passwordInput = document.getElementById('law-password');
        const authBtn = document.getElementById('law-auth-btn');
        
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') validatePassword();
        });
        
        authBtn.addEventListener('click', validatePassword);
        
        // Focus automático
        setTimeout(() => passwordInput.focus(), 500);
    }
    
    function validatePassword() {
        const passwordInput = document.getElementById('law-password');
        const errorMessage = document.getElementById('law-error');
        const password = passwordInput.value.trim().toUpperCase();
        
        if (!password) {
            showError('Digite uma licença válida');
            return;
        }
        
        if (validPasswords[password]) {
            const passwordData = validPasswords[password];
            const expirationDate = new Date(passwordData.expires + ' ' + passwordData.hours);
            const currentDate = new Date();
            
            if (currentDate <= expirationDate) {
                isAuthenticated = true;
                showCelebration();
            } else {
                showError('Licença expirada em ' + passwordData.expires);
            }
        } else {
            showError('Licença inválida');
        }
    }
    
    function showError(message) {
        const errorMessage = document.getElementById('law-error');
        errorMessage.textContent = message;
        errorMessage.style.opacity = '1';
        
        setTimeout(() => {
            errorMessage.style.opacity = '0';
        }, 3000);
    }
    
    // ========================================
    // CENA DE COMEMORAÇÃO
    // ========================================
    
    function showCelebration() {
        const authSystem = document.getElementById('law-auth');
        
        authSystem.style.opacity = '0';
        
        setTimeout(() => {
            authSystem.remove();
            
            const celebration = document.createElement('div');
            celebration.id = 'law-celebration';
            celebration.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(-45deg, #0f4c2e, #0a5a2f, #157842, #0a4b2d);
                background-size: 400% 400%;
                animation: backgroundFlow 8s ease infinite;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9997;
                flex-direction: column;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            
            celebration.innerHTML = `
                <div style="
                    font-size: 3em;
                    color: #00ff88;
                    font-weight: bold;
                    text-shadow: 0 0 20px #00ff88;
                    animation: celebration 2s ease-in-out infinite;
                    margin-bottom: 20px;
                ">ACESSO AUTORIZADO</div>
                
                <div style="
                    font-size: 1.5em;
                    color: #ffffff;
                    opacity: 0.9;
                ">Bem-vindo ao Estúdio LAW</div>
            `;
            
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                celebration.style.opacity = '0';
                setTimeout(() => {
                    celebration.remove();
                    initializeMainScript();
                }, 500);
            }, config.celebrationDuration);
            
        }, 500);
    }
    
    // ========================================
    // SCRIPT PRINCIPAL
    // ========================================
    
    function initializeMainScript() {
        console.clear();
        console.log(`%c🚀 ESTÚDIO LAW ${ver} INICIADO`, 'color: #00aaff; font-size: 16px; font-weight: bold;');
        console.log(`%c🔐 Sistema autenticado e protegido`, 'color: #00ff88; font-size: 14px;');
        
        // Aqui você pode adicionar todo o seu código principal baseado no script original
        
        // Exemplo: Carregar plugins
        loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
            .then(() => {
                sendToast("🌿 Estúdio LAW injetado com sucesso!");
                playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
                
                setTimeout(() => {
                    sendToast(`⭐ Bem vindo(a) ao Estúdio LAW Professional`);
                }, 1000);
                
                // Inicializar funcionalidades principais
                setupMenu();
                setupMain();
            });
    }
    
    // ========================================
    // FUNÇÕES AUXILIARES
    // ========================================
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    const playAudio = url => {
        try {
            const audio = new Audio(url);
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignorar erros de autoplay
        } catch (e) {}
    };
    
    function sendToast(text, duration = 5000) {
        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: text,
                duration: duration,
                gravity: 'bottom',
                position: 'center',
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(45deg, #00aaff, #0077cc)"
                }
            }).showToast();
        }
    }
    
    async function loadScript(url, label) {
        try {
            const response = await fetch(url);
            const script = await response.text();
            loadedPlugins.push(label);
            eval(script);
            return Promise.resolve();
        } catch (error) {
            console.error(`Erro ao carregar ${label}:`, error);
            return Promise.reject(error);
        }
    }
    
    function setupMenu() {
        // Implementar menu principal
        console.log('📋 Menu principal carregado');
    }
    
    function setupMain() {
        // Implementar funcionalidades principais
        console.log('⚙️ Funcionalidades principais carregadas');
    }
    
    // ========================================
    // INICIALIZAÇÃO DO SISTEMA
    // ========================================
    
    async function init() {
        // Verificar se está no site correto
        if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
            alert("❌ Estúdio LAW - Erro de Injeção!\n\nVocê precisa executar no site do Khan Academy!");
            window.location.href = "https://pt.khanacademy.org/";
            return;
        }
        
        // Injetar estilos
        injectStyles();
        
        // Criar partículas
        createParticles();
        
        // Inicializar segurança
        initSecurity();
        
        // Mostrar splash screen
        const splash = await showEstudioLawSplash();
        
        // Aguardar e mostrar sistema de auth
        setTimeout(() => {
            hideEstudioLawSplash(splash);
        }, config.splashDuration);
    }
    
    // Iniciar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();