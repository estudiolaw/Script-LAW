javascript:(async () => {
  const ver = "LAW Studio Edition V4.0.1";
  const isDev = false;

  const repoPath = `https://raw.githubusercontent.com/Niximkk/Khanware/${isDev ? "dev/" : "main/"}`;

  const loadScript = async (url, label) => {
    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao carregar ${label}`);
        return res.text();
      })
      .then((code) => eval(code));
  };

  const loadCss = (url) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  };

  if (!/^https:\/\/(www\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌ Você precisa estar no site do Khan Academy para usar este script.");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }

  // Splash screen LAW
  const splash = document.createElement("div");
  splash.style = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, #000000, #1a1a1a, #2d2d2d);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 99999; font-family: 'Poppins', sans-serif; color: white; font-size: 28px;
    text-align: center; transition: opacity 0.5s ease;
  `;
  splash.innerHTML = `
    <div style="font-size: 38px; font-weight: 700; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LAW STUDIO</div>
    <div style="font-size: 20px; margin-top: 10px;">KHANWARE Enhanced Edition</div>
    <div style="margin-top: 40px; font-size: 14px; color: #aaa;">Carregando recursos...</div>
  `;
  document.body.appendChild(splash);

  // Estilos base
  loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
  await loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "Toastify");

  const toast = (msg, dur = 3000) =>
    Toastify({
      text: msg,
      duration: dur,
      gravity: "bottom",
      position: "center",
      style: {
        background: "linear-gradient(45deg, #4ecdc4, #45b7d1)",
        fontFamily: "Poppins, sans-serif",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      },
    }).showToast();

  // Load funções principais
  try {
    await Promise.all([
      loadScript(repoPath + "functions/questionSpoof.js", "Question Spoof"),
      loadScript(repoPath + "functions/videoSpoof.js", "Video Spoof"),
      loadScript(repoPath + "functions/answerRevealer.js", "Answer Revealer"),
      loadScript(repoPath + "functions/autoAnswer.js", "Auto Answer"),
    ]);
  } catch (e) {
    console.error("❌ Erro ao carregar funções:", e);
    alert("❌ Falha ao carregar recursos Khanware LAW");
    splash.remove();
    return;
  }

  // Painel LAW
  const panel = document.createElement("div");
  panel.innerHTML = `
    <div style="position:fixed;top:20px;right:20px;width:360px;background:#111;border-radius:16px;padding:20px;font-family:Poppins,sans-serif;z-index:99999;color:white;box-shadow:0 8px 32px rgba(0,0,0,0.4);backdrop-filter:blur(8px);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:20px;font-weight:700;background: linear-gradient(45deg, #ff6b6b, #4ecdc4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">LAW STUDIO</div>
          <div style="font-size:12px;opacity:0.6;">${ver}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">×</button>
      </div>
      <div style="margin-top:20px;">
        ✅ <b>Auto Resposta</b><br>
        ✅ <b>Mostrar Respostas</b><br>
        ✅ <b>Vídeos Liberados</b><br>
        ✅ <b>Painel Moderno</b>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // Finalizar splash
  splash.style.opacity = "0";
  setTimeout(() => splash.remove(), 500);
  toast("✅ Khanware LAW ativado com sucesso!");
})();
