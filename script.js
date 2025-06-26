// Animação simples de transição de fundo (opcional)
let colors = ["#1e3a8a", "#2563eb", "#3b82f6"];
let i = 0;

setInterval(() => {
  document.body.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`;
  i++;
}, 8000);
