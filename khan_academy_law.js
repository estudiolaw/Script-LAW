// Função para mostrar comemoração ao acertar a senha
function showCelebrationLAW() {
  // Overlay
  const overlay = document.createElement('div');
  overlay.id = "estudiolaw-celebrate-overlay";
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000100;
    background:rgba(17,30,51,0.95);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    transition: opacity .3s;
  `;

  // Mensagem
  const msg = document.createElement('div');
  msg.innerHTML = `
    <div style="font-size:2.5em;font-weight:bold;color:#fff;text-shadow:0 0 18px #00aaff;">
      🎉 Bem-vindo ao <span style="color:#00aaff">Script LAW</span>! 🎉
    </div>
    <div style="margin-top:18px;font-size:1.2em;color:#bbd;opacity:0.85;">Aproveite sua experiência.</div>
  `;

  // Canvas para fogos de artifício
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1000120;";

  overlay.appendChild(canvas);
  overlay.appendChild(msg);
  document.body.appendChild(overlay);

  // Simples animação de fogos de artifício
  (function fireworks(ctx, W, H) {
    let particles = [];
    function randomColor() {
      const colors = ["#fff","#00aaff","#ffc600","#ff4b98","#6aff00","#ff3e3e"];
      return colors[Math.floor(Math.random()*colors.length)];
    }
    function Firework() {
      this.x = Math.random() * W;
      this.y = H;
      this.targetY = 150 + Math.random() * (H/2-150);
      this.targetX = this.x + (Math.random()-0.5)*200;
      this.color = randomColor();
      this.radius = 2 + Math.random()*2;
      this.speed = 6 + Math.random()*3;
      this.exploded = false;
      this.particles = [];
    }
    Firework.prototype.update = function() {
      if(!this.exploded) {
        this.y -= this.speed;
        this.x += (this.targetX-this.x)*0.05;
        if(this.y <= this.targetY) {
          this.exploded = true;
          for(let i=0;i<25+Math.random()*20;i++) {
            this.particles.push({
              x:this.x,
              y:this.y,
              angle:Math.random()*2*Math.PI,
              speed:Math.random()*4+2,
              alpha:1,
              color:randomColor()
            });
          }
        }
      } else {
        this.particles.forEach(p=>{
          p.x += Math.cos(p.angle)*p.speed;
          p.y += Math.sin(p.angle)*p.speed;
          p.speed *= 0.96;
          p.alpha -= 0.02;
        });
        this.particles = this.particles.filter(p=>p.alpha>0);
      }
    }
    Firework.prototype.draw = function(ctx) {
      if(!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        this.particles.forEach(p=>{
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x,p.y,2,0,2*Math.PI);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });
      }
    }
    function spawnFirework() {
      particles.push(new Firework());
    }
    let frame = 0;
    function animate() {
      ctx.clearRect(0,0,W,H);
      if(frame%25===0) spawnFirework();
      particles.forEach(fw=>{
        fw.update();
        fw.draw(ctx);
      });
      particles = particles.filter(fw=>!fw.exploded || fw.particles.length>0);
      frame++;
      if(document.getElementById('estudiolaw-celebrate-overlay')) requestAnimationFrame(animate);
    }
    animate();
  })(canvas.getContext('2d'), canvas.width, canvas.height);

  // Remove overlay após 4 segundos
  setTimeout(()=>{
    overlay.style.opacity="0";
    setTimeout(()=>overlay.remove(),400);
  }, 4000);
}
