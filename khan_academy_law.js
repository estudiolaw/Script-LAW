<!-- Adicione isso no seu HTML antes de tudo -->
<script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
<style>
  @keyframes fireworks {
    0% { transform: translateY(0); opacity: 1; }
    80% { opacity: 1; }
    100% { transform: translateY(-150px); opacity: 0; }
  }

  .firework {
    width: 5px;
    height: 5px;
    background: radial-gradient(circle, white, transparent);
    position: absolute;
    animation: fireworks 1s ease-out forwards;
  }

  .password-panel {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(120deg, #000000, #141e30);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 999999;
    color: white;
    font-family: sans-serif;
    animation: fadein 1.2s ease-in;
  }

  .password-input {
    padding: 10px 20px;
    font-size: 20px;
    border-radius: 10px;
    border: none;
    outline: none;
    margin-top: 20px;
    background: #222;
    color: #fff;
    box-shadow: 0 0 10px #00f;
  }

  .password-btn {
    margin-top: 15px;
    padding: 10px 20px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: linear-gradient(90deg, #0044ff, #00bbff);
    color: white;
    box-shadow: 0 0 10px #00f;
    transition: 0.3s;
  }

  .password-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px #00f;
  }

  @keyframes fadein {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .celebration {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    animation: fadein 1s ease-in-out;
    color: #fff;
    font-size: 3em;
    font-family: 'Segoe UI', sans-serif;
  }
</style>

<script>
(function() {
  // Proteção contra DevTools básico
  setInterval(() => {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
      document.body.innerHTML = '<h1 style="color:red; text-align:center; margin-top:50vh;">DevTools detectado! Acesso bloqueado.</h1>';
    }
  }, 1000);

  const senhaCorreta = "law2025";

  const passwordPanel = document.createElement("div");
  passwordPanel.className = "password-panel";
  passwordPanel.innerHTML = `
    <h2>🔒 Digite a senha para acessar</h2>
    <input type="password" id="senhaInput" class="password-input" placeholder="Digite a senha...">
    <button class="password-btn" onclick="validarSenha()">Entrar</button>
  `;
  document.body.appendChild(passwordPanel);

  window.validarSenha = () => {
    const senha = document.getElementById("senhaInput").value;
    if (senha === senhaCorreta) {
      mostrarComemoracao();
    } else {
      Toastify({
        text: "❌ Senha incorreta!",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, red, darkred)" }
      }).showToast();
    }
  };

  function criarFogos() {
    for (let i = 0; i < 30; i++) {
      const fogo = document.createElement("div");
      fogo.className = "firework";
      fogo.style.left = `${Math.random() * 100}vw`;
      fogo.style.top = `${100 + Math.random() * 50}px`;
      fogo.style.background = `radial-gradient(circle, hsl(${Math.random()*360}, 100%, 60%), transparent)`;
      document.body.appendChild(fogo);
      setTimeout(() => fogo.remove(), 1000);
    }
  }

  function mostrarComemoracao() {
    document.querySelector(".password-panel").remove();

    const celebration = document.createElement("div");
    celebration.className = "celebration";
    celebration.innerHTML = `🎆<br><span>Parabéns, o script é seu!</span>`;

    document.body.appendChild(celebration);
    criarFogos();

    setTimeout(() => {
      celebration.remove();
      iniciarEstudioLAW();
    }, 3500);
  }

  function iniciarEstudioLAW() {
    const splashScreen = document.createElement('div');
    splashScreen.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(to bottom right, #000428, #004e92);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 48px;
      letter-spacing: 0.1em;
      text-shadow: 0 0 15px #00ccff;
      animation: fadein 2s ease-in-out;
    `;

    splashScreen.innerHTML = "🎬 Estúdio LAW";
    document.body.appendChild(splashScreen);
    criarFogos();

    setTimeout(() => {
      splashScreen.remove();
      iniciarScriptPrincipal();
    }, 3000);
  }

  function iniciarScriptPrincipal() {
    // Aqui chama seu script final ou plugin
    Toastify({
      text: "🚀 Script iniciado com sucesso!",
      duration: 3000,
      gravity: "bottom",
      position: "center",
      style: { background: "#1a1a1a", color: "#0ff" }
    }).showToast();

    // Seu script real aqui:
    // ex: loadScript('url-do-seu-script.js');
  }
})();
</script>
