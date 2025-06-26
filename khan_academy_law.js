const ver = "V3.1.1";
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

/* Splash animado azul dark Estúdio LAW */
const splashScreen = document.createElement('splashScreen');

async function showEstudioLawSplash() {
  splashScreen.style.cssText = `
    position:fixed;
    top:0; left:0; width:100%; height:100%;
    z-index:9999;
    display:flex;
    align-items:center;
    justify-content:center;
    background: linear-gradient(-45deg, #0f1c2e, #0a1a2f, #152842, #0a1b2d);
    background-size: 400% 400%;
    animation: backgroundFlow 10s ease infinite;
    user-select:none;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  splashScreen.innerHTML = `
    <div id="estudio-law-text" style="
      font-size: 3em;
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
  `;
  
  if (!document.getElementById('estudio-law-style')) {
    document.head.appendChild(style);
  }
  
  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideEstudioLawSplash() {
  splashScreen.style.transition = 'opacity 0.8s ease';
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

/* Misc Styles para painel e marca d'água */
const baseStyles = document.createElement('style');
baseStyles.textContent = `
  watermark {
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 700;
    font-size: 12px;
    color: #00aaff;
    opacity: 0.4;
    user-select: none;
    pointer-events: none;
    text-shadow: 0 0 5px #00aaff;
    z-index: 99999;
  }

  statsPanel {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(10, 20, 34, 0.85);
    border: 2px solid #00aaff;
    border-radius: 10px;
    padding: 15px 25px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #00aaff;
    font-weight: 600;
    box-shadow: 0 0 15px #00aaff;
    user-select: none;
    z-index: 99999;
    max-width: 320px;
  }
`;
document.head.appendChild(baseStyles);

/* Misc Functions */
window.debug = function(text) { /* QuickFix */};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { 
    const audio = new Audio(url); 
    audio.play(); 
    debug(`🔊 Playing audio from ${url}`); 
};
const findAndClickBySelector = selector => { 
    const element = document.querySelector(selector); 
    if (element) { 
        element.click(); 
        sendToast(`⭕ Pressionando ${selector}...`, 1000); 
    } 
};

function sendToast(text, duration=5000, gravity='bottom') {
    Toastify({
        text: `${text} — Fica ligado nas dicas do Draxion... | Estúdio LAW`,
        duration: duration,
        gravity: gravity,
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#000000",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontWeight: "600",
            color: "#00aaff",
            textShadow: "0 0 5px #00aaff"
        }
    }).showToast();
    debug(text);
};

/* Emmiter */
class EventEmitter{
    constructor(){this.events={}}
    on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}
    off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}
    emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}
    once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}
};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { 
    for (let mutation of mutationsList) 
        if (mutation.type === 'childList') plppdo.emit('domChanged'); 
}).observe(document.body, { childList: true, subtree: true });

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

/* Setup Main */
function setupMenu() {
    loadScript(repoPath+'visuals/mainMenu.js', 'mainMenu');
    loadScript(repoPath+'visuals/statusPanel.js', 'statusPanel');
    loadScript(repoPath+'visuals/widgetBot.js', 'widgetBot');
    if(isDev) loadScript(repoPath+'visuals/devTab.js', 'devTab');
}
function setupMain(){
    loadScript(repoPath+'functions/questionSpoof.js', 'questionSpoof');
    loadScript(repoPath+'functions/videoSpoof.js', 'videoSpoof');
    loadScript(repoPath+'functions/minuteFarm.js', 'minuteFarm');
    loadScript(repoPath+'functions/spoofUser.js', 'spoofUser');
    loadScript(repoPath+'functions/answerRevealer.js', 'answerRevealer');
    loadScript(repoPath+'functions/rgbLogo.js', 'rgbLogo');
    loadScript(repoPath+'functions/customBanner.js', 'customBanner');
    loadScript(repoPath+'functions/autoAnswer.js', 'autoAnswer');
}

/* Inject */

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
    alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); 
    window.location.href = "https://pt.khanacademy.org/"; 
}

(async () => {
  await showEstudioLawSplash();

  loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => { 
    const onekoEl = document.getElementById('oneko'); 
    onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')"; 
    onekoEl.style.display = "none"; 
  });
  loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{
      DarkReader.setFetchMethod(window.fetch); 
      DarkReader.enable(); 
  })
  loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
  loadScript('https://cdn.jsdelivr.net/npm/toastify-js').then(async () => {
      await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`,{
          headers:{
              accept:"*/*",
              "accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
              "content-type":"application/json",
              priority:"u=1, i",
              "sec-ch-ua":'"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
              "sec-ch-ua-mobile":"?0",
              "sec-ch-ua-platform":'"Windows"',
              "sec-fetch-dest":"empty",
              "sec-fetch-mode":"cors",
              "sec-fetch-site":"same-origin",
              "sec-gpc":"1",
              "x-ka-fkey":"1"
          },
          referrer:"https://pt.khanacademy.org/profile/me/teacher/kaid_589810246138844031185299/class/6245691961556992",
          referrerPolicy:"strict-origin-when-cross-origin",
          body:'{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\"can_do_what_only_admins_can_do\\")\\n    isPublisher: hasPermission(name: \\"can_publish\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\"can_moderate_users\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isFormalTeacher\\n    isK4dStudent\\n    isKmapStudent\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\"can_ban_users\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(\\n      name: \\"can_send_moderator_messages\\"\\n      scope: GLOBAL\\n    )\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    includesKmapDistrictOwnedData\\n    includesK4dDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    hasAccessToAIGuideCompanionMode\\n    hasAccessToAIGuideLearner\\n    hasAccessToAIGuideDistrictAdmin\\n    hasAccessToAIGuideParent\\n    hasAccessToAIGuideTeacher\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    region\\n    userDistrictInfos {\\n      id\\n      isKAD\\n      district {\\n        id\\n        region\\n        __typename\\n      }\\n      __typename\\n    }\\n    schoolAffiliation {\\n      id\\n      location\\n      __typename\\n    }\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}"}',
          method:"POST",
          mode:"cors",
          credentials:"include"
      })
      .then(async response => { 
          let data = await response.json(); 
          user = { 
              nickname: data.data.user.nickname, 
              username: data.data.user.username, 
              UID: data.data.user.id.slice(-5) 
          }; 
          
          watermark.textContent = '';
          statsPanel.innerHTML = `
            <div><b>Usuário:</b> ${user.nickname || user.username}</div>
            <div><b>ID:</b> ${user.UID}</div>
            <div><b>Versão:</b> ${ver}</div>
          `;
          
          document.body.appendChild(watermark);
          document.body.appendChild(statsPanel);
          
          sendToast("🌿 Khanware injetado com sucesso!");
          playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
          await delay(500);
          sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
          if(device.apple) { 
              await delay(500); 
              sendToast(`🪽 Que tal comprar um Samsung?`); 
          }
          loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top') );
          await delay(1500);
          await hideEstudioLawSplash();
          setupMenu();
          setupMain();
          console.clear();
      })
      .catch(e => {
          sendToast("⚠️ Erro ao buscar perfil do usuário.");
          console.error(e);
          await hideEstudioLawSplash();
      });
  });
})();
