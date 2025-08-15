/* ================================
   Khanware Estúdio LAW - V1.1
   ================================ */

const ver = "V1.1";
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
};

let loadedPlugins = [];

/* Elements */
const unloader = document.createElement('unloader');
const dropdownMenu = document.createElement('dropDownMenu');
const watermark = document.createElement('watermark');
const statsPanel = document.createElement('statsPanel');
const splashScreen = document.createElement('splashScreen');

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

/* Security */
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => { if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) { e.preventDefault(); } });
console.log(Object.defineProperties(new Error, { toString: {value() {(new Error).stack.includes('toString@') && location.reload();}}, message: {get() {location.reload();}}, }));

/* Misc Styles */
document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}" }));
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"}));
document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Emmiter */
class EventEmitter{constructor(){this.events={}}on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true });

/* Misc Functions */
window.debug = function(text) { /* QuickFix */}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); debug(`🔊 Playing audio from ${url}`); };
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); } };

function sendToast(text, duration=5000, gravity='bottom') { Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast(); debug(text); };

/* ===== Tela de Senha Estúdio LAW ===== */
const estúdioLAWLogin = document.createElement('div');
estúdioLAWLogin.id = 'estudioLAWLogin';
document.body.appendChild(estúdioLAWLogin);

const loginStyle = document.createElement('style');
loginStyle.innerHTML = `
#estudioLAWLogin {
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: linear-gradient(135deg, #001f3f, #003366);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    z-index:99999; color:#72caff; font-family:MuseoSans, sans-serif;
    transition: opacity 0.5s ease;
}
#estudioLAWLogin h1 {
    font-size:50px; margin-bottom:40px; text-shadow: 0 0 10px #0056b3, 0 0 20px #007bff;
}
#estudioLAWLogin input {
    padding:10px 15px; font-size:20px; border-radius:10px; border:none;
    margin-bottom:20px; width:250px; text-align:center;
}
#estudioLAWLogin button {
    padding:10px 25px; font-size:20px; border-radius:10px; border:none;
    background:#007bff; color:white; cursor:pointer;
    transition: background 0.3s;
}
#estudioLAWLogin button:hover { background:#0056b3; }
#estudioLAWLogin .msg { margin-top:15px; font-size:16px; color:#a0c4ff; }
.heart { position: fixed; width: 30px; height: 30px; background: red; transform: rotate(45deg); animation: float 2s linear forwards; }
.heart:before, .heart:after { content: ''; position: absolute; width: 30px; height: 30px; background: red; border-radius: 50%; }
.heart:before { top:-15px; left:0; } .heart:after { left:15px; top:0; }
@keyframes float { 0% { transform: translateY(0) rotate(45deg); opacity:1; } 100% { transform: translateY(-200px) rotate(45deg); opacity:0; } }
`;
document.head.appendChild(loginStyle);

/* Senhas */
const passwords = [
    {password:"LOVE123", type:"love", expires:new Date("2025-12-31T23:59:59"), msg:"💖 Bem-vindo(a) ao Estúdio LAW!"},
    {password:"ADMINLAW", type:"admin", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER01", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER02", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER03", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER04", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER05", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER06", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER07", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER08", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER09", type:"member", expires:new Date("2025-12-31T23:59:59")},
    {password:"MEMBER10", type:"member", expires:new Date("2025-12-31T23:59:59")}
];

/* HTML Login */
estúdioLAWLogin.innerHTML = `
<h1>ESTÚDIO LAW</h1>
<input type="password" id="lawPassword" placeholder="Digite a senha">
<button id="lawLoginBtn">Entrar</button>
<div class="msg" id="lawMsg"></div>
`;

const lawInput = document.getElementById('lawPassword');
const lawBtn = document.getElementById('lawLoginBtn');
const lawMsg = document.getElementById('lawMsg');

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),2000);
}

/* Login Func */
lawBtn.addEventListener('click', () => {
    const entered = lawInput.value.trim();
    const now = new Date();
    const valid = passwords.find(p => p.password === entered && p.expires > now);
    if(valid){
        if(valid.type === "love"){
            lawMsg.textContent = valid.msg;
            lawMsg.style.color = "#ff6bcb";
            for(let i=0;i<20;i++){ setTimeout(createHeart,i*100); }
        }
        if(valid.type === "admin"){
            lawMsg.textContent = "🛡️ Acesso de Admin concedido!";
            lawMsg.style.color = "#72caff";
            window.isAdmin = true; // Flag de admin
        }
        if(valid.type === "member"){
            lawMsg.textContent = "⭐ Acesso de Membro concedido!";
            lawMsg.style.color = "#72caff";
        }
        estúdioLAWLogin.style.opacity = 0;
        setTimeout(()=>{
            estúdioLAWLogin.remove();
            startKhanware(); // Função principal do Khanware
        }, 1000);
    } else {
        lawMsg.textContent = "❌ Senha inválida ou expirada!";
        lawMsg.style.color = "#ff6b6b";
        lawInput.value = '';
    }
});

lawInput.addEventListener('keyup', e => { if(e.key === "Enter") lawBtn.click(); });

/* ======== Função principal para carregar Khanware ======== */
async function startKhanware(){
    showSplashScreen();
    await loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => { 
        onekoEl = document.getElementById('oneko'); 
        onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')"; 
        onekoEl.style.display = "none"; 
    });
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); });
    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');

    fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile",{referrer:"https://pt.khanacademy.org/profile/me",body:'{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    username\\n    nickname\\n    __typename\\n  }}"}',method:"POST",mode:"cors",credentials:"include"})
    .then(async response => { 
        let data = await response.json(); 
        user = { nickname: data.data.user.nickname, username: data.data.user.username, UID: data.data.user.id.slice(-5) }; 
        sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
    });

    hideSplashScreen();
    setupMenu();
    setupMain();
    console.clear();
     }
