export function bindUI(core,pano){
  const $=q=>document.querySelector(q);
  const $$=q=>Array.from(document.querySelectorAll(q));
  const sfx=$("#sfx");

  function playClick(){ try{sfx.currentTime=0;sfx.play();}catch{} }

  const bgmDay=$("#bgm_day"),bgmLib=$("#bgm_lib"),bgmMusic=$("#bgm_music");
  function playBGM(which){
    [bgmDay,bgmLib,bgmMusic].forEach(b=>b.pause());
    if(which==='lib')bgmLib.play();
    else if(which==='music')bgmMusic.play();
    else bgmDay.play();
  }

  $("#bgmBtn").onclick=()=>{ playClick();
    if(!bgmDay.paused||!bgmLib.paused||!bgmMusic.paused){ 
      [bgmDay,bgmLib,bgmMusic].forEach(b=>b.pause());
      $("#bgmBtn").textContent='BGM：關';
    }else{ playBGM('day'); $("#bgmBtn").textContent='BGM：開'; }
  };

  // 場景熱點按鈕
  const scenes=['gate','art','music','library','playground','principal'];
  const hotspotContainer=$("#hotspots");
  scenes.forEach(sc=>{
    const btn=document.createElement('button');
    btn.className='chip'; btn.textContent=sc; btn.onclick=()=>{playClick();pano.load(sc);}
    hotspotContainer.appendChild(btn);
  });

  // 外部導覽
  $$('[data-jump]').forEach(b=>b.onclick=()=>{playClick();location.href=b.dataset.jump;});
  $("#returnGame").onclick=()=>{playClick();location.href='mission_snow_temple.html';};

  playBGM('day');
}
// === Isaac Emotion HUD ===
window.EmotionHUD = {
  data: { anger: 0.2, fear: 0.2, understanding: 0.5 },
  init() {
    if (document.getElementById('emotionHUD')) return;
    const box = document.createElement('div');
    box.id = 'emotionHUD';
    box.style.position = 'absolute';
    box.style.top = '20px';
    box.style.left = '20px';
    box.style.padding = '10px';
    box.style.background = 'rgba(0,0,0,0.6)';
    box.style.color = '#fff';
    box.style.fontSize = '14px';
    box.style.borderRadius = '8px';
    document.body.appendChild(box);
    this.refresh();
  },
  refresh() {
    const e = this.data;
    const box = document.getElementById('emotionHUD');
    if (!box) return;
    box.innerHTML = `😡 ${(e.anger*100).toFixed(0)}% 😨 ${(e.fear*100).toFixed(0)}% 💫 ${(e.understanding*100).toFixed(0)}%`;
    document.body.style.filter = `brightness(${0.6 + e.understanding * 0.7})`;
  },
  add(key, value) {
    this.data[key] = Math.min(1, Math.max(0, this.data[key] + value));
    this.refresh();
  }
};
