// ============================================================
// SnowWolf RPG FX Controller v4.2
// ============================================================

function fxShow(name){
  document.querySelectorAll('.fx-layer').forEach(fx=>fx.classList.remove('fx-show'));
  const target=document.getElementById('fx_'+name);
  if(target){
    target.classList.add('fx-show');
    if(name==="snowstorm") makeSnow(target);
  }
}

// ❄️ 下雪粒子生成
function makeSnow(container){
  if(container.dataset.made==="1") return;
  container.dataset.made="1";

  for(let i=0;i<200;i++){
    const flake=document.createElement("div");
    flake.className="snowflake";
    flake.style.left=Math.random()*100+"vw";
    flake.style.width=2+Math.random()*6+"px";
    flake.style.height=flake.style.width;
    flake.style.animationDuration=6+Math.random()*10+"s";
    flake.style.animationDelay=Math.random()*10+"s";
    flake.style.opacity=0.4+Math.random()*0.6;
    flake.style.setProperty("--drift",(Math.random()*200-100)+"px");
    document.body.appendChild(flake); // ❄️ 改成加在 body 層（不被覆蓋）
  }
}
// === Isaac Home Visual Layer ===
if (!window.FX) window.FX = {};

FX.addFogLayer = function() {
  if (document.getElementById('fogLayer')) return;
  const fog = document.createElement('div');
  fog.id = 'fogLayer';
  fog.style.position = 'absolute';
  fog.style.top = 0;
  fog.style.left = 0;
  fog.style.width = '100%';
  fog.style.height = '100%';
  fog.style.pointerEvents = 'none';
  fog.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), rgba(0,0,0,0.5))';
  fog.style.mixBlendMode = 'screen';
  fog.style.animation = 'fogDrift 25s infinite linear';
  document.body.appendChild(fog);
};

FX.addLightPulse = function() {
  if (document.getElementById('lightPulse')) return;
  const pulse = document.createElement('div');
  pulse.id = 'lightPulse';
  pulse.style.position = 'absolute';
  pulse.style.top = 0;
  pulse.style.left = 0;
  pulse.style.width = '100%';
  pulse.style.height = '100%';
  pulse.style.background = 'rgba(255,255,255,0.07)';
  pulse.style.pointerEvents = 'none';
  pulse.style.animation = 'lightPulse 6s infinite ease-in-out';
  document.body.appendChild(pulse);
};

// 動畫 keyframes（只新增一次）
const fxStyle = document.createElement('style');
fxStyle.innerHTML = `
@keyframes fogDrift {
  0% {background-position: 0% 0%;}
  100% {background-position: 100% 100%;}
}
@keyframes lightPulse {
  0%,100% {opacity: 0;}
  50% {opacity: 0.4;}
}`;
document.head.appendChild(fxStyle);
