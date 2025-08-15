// == Estúdio LAW Script - Versão 1.0 ==
// Marca, cores e identidade visual do Estúdio LAW
// Desenvolvido para automações no Khan Academy
// © Estúdio LAW

const versao = "1.0.0";
const repoPath = `https://raw.githubusercontent.com/EstudioLaw/KhanLaw/refs/heads/main/`;

// Azul da marca
const lawBlue = "#1894e6";
const lawGradient = "linear-gradient(90deg, #1894e6 0%, #1eb2ff 100%)";

// Logo (troque pelo link definitivo se quiser)
const logoURL = "https://i.imgur.com/4yQGkGz.png"; 

// Sistema de Senha
let senhaConfig = [
    { senha: "ESTUDIOLAW2025", validade: "2025-12-31 23:59" },
    { senha: "AUTOMATICLAW", validade: "2025-09-30 00:00" },
    { senha: "KHANLAW", validade: "2025-10-10 12:00" },
    { senha: "BLUEPOWER", validade: "2025-11-01 18:00" },
    { senha: "LAWMASTER", validade: "2025-09-01 00:00" },
    { senha: "STUDIOHORSE", validade: "2025-12-01 23:59" },
    { senha: "AUTOKHAN", validade: "2025-10-31 23:59" },
    { senha: "LAWFORCE", validade: "2025-09-15 20:00" },
    { senha: "LAWPRO", validade: "2025-11-15 09:00" },
    { senha: "HORSELAW", validade: "2025-10-05 17:30" },
    // Adicione mais senhas usando a função abaixo!
];

// Função para adicionar novas senhas dinamicamente
function adicionarSenha(senha, validade) {
    senhaConfig.push({ senha, validade });
}

// Função de validação de senha
function validarSenha(senha) {
    let agora = new Date();
    for (let item of senhaConfig) {
        let validade = new Date(item.validade.replace(" ", "T"));
        if (item.senha === senha && agora <= validade) {
            return true;
        }
    }
    return false;
}

// Splash Screen dinâmica - Cavalo atirando as letras "ESTÚDIO LAW"
async function showSplashScreenLAW() {
    let splash = document.createElement("div");
    splash.id = "lawSplashScreen";
    splash.style.cssText = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;
        background:#101010;display:flex;align-items:center;justify-content:center;flex-direction:column;
        transition:opacity .5s;font-family:sans-serif;user-select:none;
    `;
    splash.innerHTML = `
        <img src="${logoURL}" style="width:170px;margin-bottom:32px;" />
        <div id="lawAnim"></div>
    `;
    document.body.appendChild(splash);

    // Animação: cavalo atirando letras
    const texto = "ESTÚDIO LAW";
    let animDiv = document.getElementById("lawAnim");
    for(let i=0;i<texto.length;i++){
        await new Promise(res=>setTimeout(res,250));
        let shot = document.createElement("span");
        shot.textContent = texto[i];
        shot.style = `
            font-size:38px;margin:0 5px;padding:0 2px;
            color:${lawBlue};font-weight:900;opacity:0;
            transform:translateY(40px) scale(0.8);display:inline-block;transition:.5s;
            text-shadow:0 2px 8px #1894e6aa;
        `;
        animDiv.appendChild(shot);
        setTimeout(()=>{ shot.style.opacity="1"; shot.style.transform="translateY(0) scale(1)"; },50);
        if(i%2==0) new Audio('https://assets.mixkit.co/sfx/download/mixkit-fast-short-whistle-493.wav').play();
    }
    await new Promise(res=>setTimeout(res,1000));
    splash.style.opacity = "0";
    setTimeout(()=>{ splash.remove(); },700);
}

// Tela de senha
async function showSenhaPromptLAW() {
    return new Promise((resolve) => {
        let senhaDiv = document.createElement("div");
        senhaDiv.id = "lawSenhaPrompt";
        senhaDiv.style.cssText = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99998;
            background:#161f2eeb;display:flex;align-items:center;justify-content:center;flex-direction:column;
            font-family:sans-serif;
        `;
        senhaDiv.innerHTML = `
            <div style="background:#101c33;padding:40px 32px 32px;border-radius:16px;box-shadow:0 0 30px #1894e680;display:flex;flex-direction:column;align-items:center;">
                <img src="${logoURL}" style="width:90px;margin-bottom:16px;" />
                <h2 style="color:${lawBlue};margin-bottom:20px;">Acesso Estúdio LAW</h2>
                <input type="password" id="lawSenhaInput" placeholder="Digite sua senha..." style="font-size:18px;border-radius:8px;padding:6px 18px;border:1.5px solid ${lawBlue};outline:none;" />
                <button id="lawSenhaBtn" style="margin-top:20px;background:${lawGradient};color:white;font-weight:bold;padding:10px 28px;border:none;border-radius:8px;font-size:17px;cursor:pointer;">
                    Entrar
                </button>
                <div id="lawSenhaMsg" style="margin-top:20px;color:#e61e4d;font-size:16px;display:none;"></div>
            </div>
        `;
        document.body.appendChild(senhaDiv);

        senhaDiv.querySelector("#lawSenhaBtn").onclick = () => {
            let senha = senhaDiv.querySelector("#lawSenhaInput").value;
            if (validarSenha(senha)) {
                senhaDiv.remove();
                resolve(true);
            } else {
                let msg = senhaDiv.querySelector("#lawSenhaMsg");
                msg.textContent = "Senha inválida ou expirada!";
                msg.style.display = "block";
            }
        };
        senhaDiv.querySelector("#lawSenhaInput").addEventListener("keydown", (e) => {
            if (e.key === "Enter") senhaDiv.querySelector("#lawSenhaBtn").click();
        });
    });
}

// Estilo global: azul da marca, logo, fontes
function injectLAWStyles() {
    let style = document.createElement("style");
    style.innerHTML = `
        body { background: #111a28 !important; color: #e8f0ff; font-family: 'MuseoSans', 'Segoe UI', Arial, sans-serif; }
        ::selection { background: ${lawBlue}44; }
        .law-btn { background: ${lawGradient}; color: white; padding: 8px 20px; border-radius: 8px; font-size: 17px; border: none; }
        .law-watermark { position:fixed;bottom:18px;right:18px;color:${lawBlue};font-weight:900;opacity:0.17;font-size:30px;pointer-events:none;z-index:9999; }
    `;
    document.head.appendChild(style);

    // Favicon customizado
    let link = document.querySelector("link[rel~='icon']");
    if(!link){
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    link.href = logoURL;
}

// Watermark LAW
function addLAWWatermark() {
    let wm = document.createElement("div");
    wm.className = "law-watermark";
    wm.textContent = "ESTÚDIO LAW";
    document.body.appendChild(wm);
}

// ---------------------------
// Funções automáticas Khan Academy
// ---------------------------

// Responde perguntas automaticamente na página de exercício
function autoAnswerLAW() {
    // Tenta encontrar botões de resposta e clicar
    setInterval(() => {
        let btn = document.querySelector('[data-test-id="hint-button"], [data-test-id="show-answer-button"]');
        if(btn) btn.click();
        let submitBtn = document.querySelector('[data-test-id="submit-answer-button"]');
        if(submitBtn) submitBtn.click();
    }, 2000);
}

// Mostra todas as respostas disponíveis
function revealAnswersLAW() {
    let answers = document.querySelectorAll('[data-test-id="correct-answer"], [data-test-id="solution-text"]');
    answers.forEach(a => a.style.background = lawGradient);
}

// Farmer de minutos (simula que vídeo está sendo assistido)
function minuteFarmLAW() {
    let videos = document.querySelectorAll('video');
    videos.forEach(v => {
        v.currentTime = v.duration - 2; // pula pro final
        v.play();
        v.dispatchEvent(new Event('ended'));
    });
}

// Spoofar questão (simula que já foi respondida)
function questionSpoofLAW() {
    let complete = document.querySelector('[data-test-id="progress-bar"]');
    if(complete) complete.style.background = lawBlue;
    let corrects = document.querySelectorAll('[data-test-id="correct-answer"]');
    corrects.forEach(c => c.style.border = `2px solid ${lawBlue}`);
}

// Função principal que ativa tudo
function setupLAWFeatures() {
    autoAnswerLAW();
    setInterval(revealAnswersLAW, 5000);
    setInterval(minuteFarmLAW, 8000);
    setInterval(questionSpoofLAW, 4000);
    alert("✅ Estúdio LAW - Automação ativada para Khan Academy!");
}

// Segurança básica
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if ((e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { e.preventDefault(); }
});

// Injeção principal
(async function(){
    injectLAWStyles();
    showSplashScreenLAW();
    addLAWWatermark();

    // Só executa no Khan Academy
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
        alert("❌ Estúdio LAW: Execute no site do Khan Academy! (https://pt.khanacademy.org/)");
        window.location.href = "https://pt.khanacademy.org/";
        return;
    }

    // Sistema de senha
    let acesso = await showSenhaPromptLAW();
    if(acesso){
        setupLAWFeatures();
    }
})();

// Adicione novas senhas com: adicionarSenha("SENHANOVA", "2025-08-31 23:59");
