<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<link rel="preload" as="audio" href="audio/wardrobe_epic_theme.mp3">
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>衣櫃 Wardrobe | 雪狼宇宙</title>
<style>
  :root{
    --ink:#e7eefb; --muted:#9bb2d4; --chip:#152238;
    --panel:#0f1726; --panel2:#0b1220; --edge:#223553; --glow:0 10px 40px rgba(0,0,0,.35);
    --primary:#78a2ff; --accent:#9ad6ff; --ok:#39d98a;
    --radius:18px;
  }
  *{box-sizing:border-box}
  html,body{height:100%;margin:0;background:#000}
  body{font-family: ui-rounded, system-ui, "PingFang TC","Noto Sans TC",sans-serif;color:var(--ink)}

  /* ===== 背景：圖片 + 冰塊特效 + 極光 ===== */
  .bgImage{
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:url("img/bg/wardrobe_bg.jpg");
    background-size:cover; background-position:center; background-repeat:no-repeat;
    filter:contrast(1.04) brightness(.96) saturate(1.02);
  }
  .bgShade{
    position:fixed; inset:0; z-index:1; pointer-events:none;
    background:radial-gradient(1200px 800px at 50% 20%,
      rgba(0,0,0,.12) 0%, rgba(0,0,0,.42) 60%, rgba(0,0,0,.62) 100%);
  }
  .bgFx{position:fixed; inset:0; overflow:hidden; z-index:2; pointer-events:none}
  .aurora{
    position:absolute; inset:-12% -12% 0 -12%;
    background:
      radial-gradient(60% 35% at 70% -10%, #2a6bbb66 0%, transparent 60%),
      radial-gradient(55% 32% at 10% 110%, #1c4d8f66 0%, transparent 60%);
    mix-blend-mode:screen; filter:blur(2px) saturate(1.06);
  }
  /* ❄ 冰塊粒子 */
  .ice{
    position:absolute; width:14px; height:14px; transform:rotate(45deg);
    background:linear-gradient(145deg,#e9fbff,#a5e3ff);
    border:1px solid rgba(255,255,255,.7);
    box-shadow:0 0 14px #9edbff99, inset 0 0 10px #ffffffaa;
    opacity:.9; will-change: transform, opacity;
    animation: floatY var(--dur,24s) linear infinite,
               drift var(--drift,8s) ease-in-out infinite,
               blink var(--blink,1.2s) steps(2) infinite;
  }
  @keyframes floatY{
    0%   { transform: translate(var(--x,0), 105vh) rotate(45deg); }
    100% { transform: translate(var(--x,0), -18vh) rotate(45deg); }
  }
  @keyframes drift{ 0%,100%{--x:0px} 50%{--x:var(--dx,28px)} }
  @keyframes blink{ 0%,100%{opacity:.95} 50%{opacity:.55} }

  /* ===== 頂部 Toolbar ===== */
  .topbar{
    position:fixed; left:18px; right:18px; top:12px; z-index:5;
    display:flex; gap:12px; align-items:center;
  }
  .chip{
    background:var(--chip); color:#cfe1ff; border:1px solid var(--edge);
    border-radius:999px; padding:8px 12px; font-size:13px;
    display:inline-flex; gap:8px; align-items:center; box-shadow:var(--glow)
  }
  .spacer{flex:1}

  /* ===== HUD：金幣 + 情緒條 ===== */
  .hud{position:fixed; left:18px; right:18px; top:58px; z-index:5; display:flex; gap:24px; align-items:center}
  .coins{display:flex; align-items:center; gap:8px; background:#122036cc; border:1px solid var(--edge);
    padding:8px 12px; border-radius:999px; box-shadow:var(--glow)}
  .coins b{font-size:14px; letter-spacing:.3px}
  .bars{display:flex; gap:22px}
  .bar{width:260px; max-width:26vw}
  .bar label{display:block; font-size:12px; color:#b9c8e6; margin:0 0 4px 2px}
  .meter{height:6px; background:#0d1830; border:1px solid #1e2c47; border-radius:999px; overflow:hidden}
  .meter span{display:block; height:100%; background:linear-gradient(90deg,#4aa3ff,#9ad6ff); width:10%; transition:width .35s}

  /* ===== 主面板 ===== */
  .wrap{position:relative; z-index:5; padding:120px 18px 24px}
  .panel{
    width:min(1240px,96vw); margin:0 auto; background:linear-gradient(180deg,#0f1829ee,#0b1221ee);
    border:1px solid #1e2b45; border-radius:22px; box-shadow:var(--glow); padding:18px 18px 22px
  }
  .panel h2{margin:6px 6px 12px; font-size:20px; color:#d9e8ff; display:flex; align-items:center; gap:10px}
  .sub{color:var(--muted); font-size:13px; margin:0 6px 14px}

  /* 篩選列 */
  .filters{display:flex; gap:10px; flex-wrap:wrap; margin:8px 6px 14px}
  .pill{background:#13223c; border:1px solid #243a60; color:#cfe1ff; padding:8px 12px; border-radius:999px; font-size:13px; cursor:pointer}
  .pill.active{background:#183255; border-color:#335281}

  /* 衣櫃網格 */
  .grid{display:grid; grid-template-columns:repeat(6,1fr); gap:14px}
  @media (max-width:1200px){ .grid{grid-template-columns:repeat(5,1fr)} }
  @media (max-width:960px) { .grid{grid-template-columns:repeat(4,1fr)} }
  @media (max-width:720px) { .grid{grid-template-columns:repeat(3,1fr)} }
  @media (max-width:520px) { .grid{grid-template-columns:repeat(2,1fr)} }

  .card{background:linear-gradient(180deg,#0d1626,#0a121f); border:1px solid #22314a; border-radius:16px; padding:10px; display:flex; flex-direction:column}
  .media{width:100%; aspect-ratio:3/4; border-radius:12px; overflow:hidden; background:#0a1322; border:1px solid #20314b; margin-bottom:8px}
  .media img,.media video{width:100%; height:100%; object-fit:cover; display:block}
  .card h4{margin:2px 0 6px; font-size:14px}
  .muted{color:#9db1cf; font-size:12px; margin:0 0 8px}
  .chips{display:flex; gap:6px; flex-wrap:wrap; margin-top:auto}
  .chipS{font-size:11px; padding:4px 8px; border-radius:999px; background:#13223c; border:1px solid #233a61; color:#cfe1ff}

  /* 底部工具列：道具庫 / 商店 */
  .dock{display:flex; gap:10px; justify-content:flex-end; margin-top:14px}
  .btn{background:#173055; color:#e7f1ff; border:1px solid #27426e; border-radius:12px; padding:10px 14px; font-size:14px; cursor:pointer; box-shadow:var(--glow)}
  .btn:disabled{opacity:.5; cursor:not-allowed}

  /* 小提示 */
  .toast{position:fixed; right:18px; bottom:18px; background:#0c1a30; color:#dff2ff; border:1px solid #234168; border-radius:12px; padding:10px 14px; box-shadow:var(--glow); z-index:50; display:none}
</style>
</head>
<body>

<!-- 背景：圖片 + 遮罩 + 特效 -->
<div class="bgImage"></div>
<div class="bgShade"></div>
<div class="bgFx" id="bgFx"><div class="aurora"></div></div>

<!-- 頂部：導覽 -->
<div class="topbar">
  <button class="chip" data-jump="home.html">🏠 艾薩克的家</button>
  <button class="chip" data-jump="school.html">🏫 蘭薩爾小學</button>
  <button class="chip" data-jump="map_world.html">🗺️ 世界地圖</button>
  <div class="spacer"></div>
  <div class="chip">💰 金幣 <b id="coins">120</b></div>
  <button id="bgm" class="chip">BGM：開</button>
</div>

<!-- HUD：金幣 + 情緒條 -->
<div class="hud">
  <div class="coins">🪙 <b id="coins2">120</b></div>
  <div class="bars">
    <div class="bar"><label>勇氣 Courage</label><div class="meter"><span id="mC" style="width:24%"></span></div></div>
    <div class="bar"><label>同理 Empathy</label><div class="meter"><span id="mE" style="width:18%"></span></div></div>
    <div class="bar"><label>真實 Truth</label><div class="meter"><span id="mT" style="width:12%"></span></div></div>
  </div>
</div>

<!-- 主內容 -->
<div class="wrap">
  <div class="panel">
    <h2>🧥 衣櫃 Wardrobe</h2>
    <p class="sub">提示：衣物卡片影片/圖片路徑統一為 <code>assets/wardrobe/&lt;id&gt;.mp4</code>（若無則顯示 <code>.jpg</code>）。</p>

    <!-- 篩選 -->
    <div class="filters" id="filters"></div>

    <!-- 網格 -->
    <div class="grid" id="grid"></div>

    <!-- 底部工具列 -->
    <div class="dock">
      <button class="btn" id="openStore">🧰 道具庫 / 商店</button>
      <button class="btn" data-jump="mission_snow_temple.html">返回：雪之聖殿</button>
    </div>
  </div>
</div>

<!-- 音效/音樂 -->
<audio id="sfx" src="sfx/click.wav" preload="auto"></audio>
<!-- ✅ 修正：統一路徑 + 自動播放支援 -->
<audio id="bgma" src="audio/wardrobe_epic_theme.mp3" loop preload="auto"></audio>

<!-- 提示 -->
<div id="toast" class="toast"></div>

<script>
/* ====== 基礎 ====== */
const SFX = document.getElementById('sfx');
const BGM = document.getElementById('bgma');
const toast = (t)=>{const n=document.getElementById('toast');n.textContent=t;n.style.display='block';setTimeout(()=>n.style.display='none',1400);}
const sfx = ()=>{ try{ SFX.currentTime=0; SFX.play(); }catch{} }

/* ====== 狀態（可與全站共用的 key 對應） ====== */
const state = {
  coins: Number(localStorage.getItem('coins')||120),
  stats: {
    C: Number(localStorage.getItem('stat_C')||24),
    E: Number(localStorage.getItem('stat_E')||18),
    T: Number(localStorage.getItem('stat_T')||12),
  },
  categories: [
    {id:'coat', name:'外套 Coats'},
    {id:'top', name:'上衣 Tops'},
    {id:'bottom', name:'下身 Bottoms'},
    {id:'dress', name:'洋裝 Dresses'},
    {id:'hat', name:'帽子 Hats'},
    {id:'bag', name:'背包 bag'},
    {id:'gloves', name:'手套 Gloves'},
    {id:'boots', name:'靴子 Boots'},
    {id:'acc', name:'飾品 Accessories'}
  ],
  wardrobe: [
    { id:'explorer_coat',  cat:'coat',  title:'探險者外套', eff:{C:+1}, tags:['保暖','輕量'] },
    { id:'snow_cloak',     cat:'coat',  title:'雪地披風',   eff:{E:+1}, tags:['披風','禦寒'] },
    { id:'frost_parka',    cat:'coat',  title:'霜羽厚外套', eff:{C:+1,E:+1}, tags:['防風','連帽'] },

    { id:'seer_robe',      cat:'top',   title:'觀星者長袍', eff:{T:+1}, tags:['儀式','長袖'] },
    { id:'thermal_knit',   cat:'top',   title:'發熱毛衣',   eff:{E:+1}, tags:['針織','保暖'] },
    { id:'battle_tunic',   cat:'top',   title:'遠征束襟',   eff:{C:+1}, tags:['耐磨','輕裝'] },
    { id:'uniform_girl',   cat:'top',   title:'蘭薩爾小學女生制服',   eff:{C:+1}, tags:['學院','夏季'] },

    { id:'flow_belt',      cat:'bottom',   title:'漂浮腰帶', eff:{T:+1}, tags:['能量','魔力'] },

    { id:'flaming_battle',    cat:'coat',title:'烈焰戰袍',   eff:{C:+1}, tags:['防潑','耐寒'] },
    { id:'dawn_sanctum', cat:'dress',title:'黎明聖衣',   eff:{T:+1}, tags:['星纹','飄逸'] },

    { id:'winter_dress',   cat:'dress', title:'冰川聖衣',   eff:{E:+1}, tags:['華麗','襯裡'] },
    { id:'forest_dress',   cat:'dress', title:'森林聖衣',   eff:{T:+1}, tags:['典雅','飾帶'] },
    { id:'sylvan_attire',   cat:'dress', title:'翠葉洋裝',   eff:{E:+1}, tags:['呼吸','閃光'] },

    { id:'midnight_sanctum',       cat:'dress',   title:'風暴聖衣',   eff:{E:+1}, tags:['羽絲','流光'] },
    { id:'wolf_cap',       cat:'hat',   title:'雪狼毛帽',   eff:{T:+1}, tags:['輕便','夜觀'] },

    { id:'frostveil_pack', cat:'bag', title:'寒霧行囊',   eff:{C:+1}, tags:['防禦','銀灰'] },
    { id:'azurefang_rucksack',     cat:'bag', title:'蒼狼背囊',   eff:{E:+1}, tags:['守護','狼族'] },
    { id:'astraweave_satchel',     cat:'bag', title:'星紋旅袋',   eff:{E:+1}, tags:['星象','迷失'] },

    { id:'runic_gloves',   cat:'gloves',title:'符紋手套',   eff:{T:+1}, tags:['符紋','保暖'] },
    { id:'leather_gloves', cat:'gloves',title:'馴鹿皮手套', eff:{C:+1}, tags:['耐用','防滑'] },

    { id:'ice_boots',      cat:'boots', title:'破冰雪靴',   eff:{C:+1}, tags:['防滑','保暖'] },
    { id:'soft_boots',     cat:'boots', title:'雲棉短靴',   eff:{E:+1}, tags:['輕量','安靜'] },

    { id:'moon_pendant',   cat:'acc',   title:'月影墜飾',   eff:{T:+1}, tags:['月光','護符'] },
    { id:'whisper_earrings',   cat:'acc',   title:'翠語耳環',   eff:{T:+1}, tags:['秘密','聆聽'] },
    { id:'friend_pin',     cat:'acc',   title:'友情胸針',   eff:{E:+1}, tags:['勇氣','凝聚'] }
  ]
};

/* ====== UI 綁定 ====== */
const coinsEls=[document.getElementById('coins'),document.getElementById('coins2')];
const mC=document.getElementById('mC'), mE=document.getElementById('mE'), mT=document.getElementById('mT');
const grid=document.getElementById('grid'); const filters=document.getElementById('filters');

function syncHUD(){
  coinsEls.forEach(el=>el.textContent=state.coins);
  mC.style.width = Math.max(0,Math.min(100,state.stats.C)) + '%';
  mE.style.width = Math.max(0,Math.min(100,state.stats.E)) + '%';
  mT.style.width = Math.max(0,Math.min(100,state.stats.T)) + '%';
}

/* 篩選 pills */
let activeCat = 'all';
function buildFilters(){
  filters.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'pill' + (activeCat==='all'?' active':'');
  all.textContent = '全部 All';
  all.onclick = ()=>{ sfx(); activeCat='all'; buildFilters(); renderGrid(); };
  filters.appendChild(all);
  state.categories.forEach(c=>{
    const b=document.createElement('button');
    b.className='pill' + (activeCat===c.id?' active':'');
    b.textContent=c.name;
    b.onclick=()=>{ sfx(); activeCat=c.id; buildFilters(); renderGrid(); };
    filters.appendChild(b);
  });
}

/* 卡片影片優先，無檔回退圖片（統一路徑） */
async function makeMediaHTML(id){
  const mp4 = `assets/wardrobe/${id}.mp4`;
  const jpg = `assets/wardrobe/${id}.jpg`;
  try{
    const r = await fetch(mp4, {method:'HEAD'});
    if(r.ok){
      return `<video src="${mp4}" autoplay loop muted playsinline></video>`;
    }
  }catch{}
  return `<img src="${jpg}" alt="">`;
}

async function renderGrid(){
  grid.innerHTML = '';
  const list = state.wardrobe.filter(w => activeCat==='all' ? true : w.cat===activeCat);
  for(const w of list){
    const card=document.createElement('div'); card.className='card';
    const mediaWrap=document.createElement('div'); mediaWrap.className='media';
    mediaWrap.innerHTML = await makeMediaHTML(w.id);

    const h4=document.createElement('h4'); h4.textContent = w.title;
    const p=document.createElement('p'); p.className='muted';
    const eff = `${w.eff?.C?`勇氣 +${w.eff.C} `:''}${w.eff?.E?`同理 +${w.eff.E} `:''}${w.eff?.T?`真實 +${w.eff.T} `:''}`.trim() || '—';
    p.textContent = `效果 / Effect：${eff}`;

    const chips=document.createElement('div'); chips.className='chips';
    (w.tags||[]).forEach(t=>{
      const s=document.createElement('span'); s.className='chipS'; s.textContent=t; chips.appendChild(s);
    });

    card.append(mediaWrap,h4,p,chips);
    grid.appendChild(card);
  }
}

/* ====== 冰塊粒子 ====== */
(function spawnIce(){
  const layer = document.getElementById('bgFx');
  const COUNT = 60;
  for (let i=0; i<COUNT; i++){
    const d = document.createElement('div');
    d.className = 'ice';
    const size = 10 + Math.random()*22;
    d.style.width  = size + 'px';
    d.style.height = size + 'px';
    d.style.left = (Math.random()*100).toFixed(2) + 'vw';
    d.style.animationDelay =
      `${(-Math.random()*26).toFixed(2)}s, ${(-Math.random()*6).toFixed(2)}s, ${(-Math.random()*1.2).toFixed(2)}s`;
    d.style.setProperty('--dur',  (18 + Math.random()*18).toFixed(2) + 's');
    d.style.setProperty('--drift',(6 + Math.random()*6).toFixed(2)  + 's');
    const dx = (Math.random()<.5?'-':'') + (18 + Math.floor(Math.random()*32));
    d.style.setProperty('--dx', dx + 'px');
    layer.appendChild(d);
  }
})();

/* ====== 事件 ====== */
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{ const to=b.dataset.jump; if(to) window.location.href=to; }));
document.getElementById('bgm').onclick=()=>{
  sfx();
  if(BGM.paused){ BGM.volume=.7; BGM.play(); document.getElementById('bgm').textContent='BGM：開'; }
  else{ BGM.pause(); document.getElementById('bgm').textContent='BGM：關'; }
};
document.getElementById('openStore').onclick=()=>{ sfx(); window.location.href='store.html?from=wardrobe'; };

/* ====== 啟動 ====== */
syncHUD();
buildFilters();
renderGrid();

/* ✅ 自動播放保險機制（載入嘗試 + 任一互動即播放） */
(function ensureAutoplay(){
  const tryPlay = ()=> BGM.play().then(()=>{document.getElementById('bgm').textContent='BGM：開';}).catch(()=>{});
  BGM.volume = .7;
  tryPlay();                               // 進頁面先試一次
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) tryPlay(); }, {once:true});
  const unlock = ()=>{ tryPlay(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
  window.addEventListener('pointerdown', unlock, {passive:true});
  window.addEventListener('keydown', unlock);
})();
</script>
</body>
</html>
