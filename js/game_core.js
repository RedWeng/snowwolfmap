/* ---- 音效與狀態 ---- */
const SFX=new Audio('sfx/click.wav');
const state={
  coins:Number(localStorage.getItem('coins')||120),
  C:+(localStorage.getItem('stat_C')||24),
  E:+(localStorage.getItem('stat_E')||18),
  T:+(localStorage.getItem('stat_T')||12),
  loc:'gate',
  quests: JSON.parse(localStorage.getItem('quests') || '{}')
};

/* ---- 同步 HUD ---- */
function syncHUD(){
  document.getElementById('mC').style.width=state.C+'%';
  document.getElementById('mE').style.width=state.E+'%';
  document.getElementById('mT').style.width=state.T+'%';
  document.getElementById('coins').textContent=
  document.getElementById('coins2').textContent=state.coins;
  localStorage.setItem('stat_C',state.C);
  localStorage.setItem('stat_E',state.E);
  localStorage.setItem('stat_T',state.T);
  localStorage.setItem('coins',state.coins);
  localStorage.setItem('quests',JSON.stringify(state.quests));
  renderQuests();
}
syncHUD();

/* ---- 任務清單更新 ---- */
const questList=document.getElementById('questList');
function renderQuests(){
  questList.innerHTML='';
  const all=[
    {id:'art',name:'🎨 完成美術任務'},
    {id:'music',name:'🎵 完成音樂任務'},
    {id:'library',name:'📖 閱讀任務'},
    {id:'playground',name:'⚙️ 體動任務'},
    {id:'principal',name:'👑 校長任務'}
  ];
  all.forEach(q=>{
    const li=document.createElement('li');
    li.textContent=q.name+' '+(state.quests[q.id]?'✅':'⌛');
    questList.appendChild(li);
  });
}

/* ---- 對話模組 ---- */
const who=document.getElementById('who'),
      line=document.getElementById('line'),
      ava=document.getElementById('ava'),
      opts=document.getElementById('opts'),
      toast=document.getElementById('toast');

function showToast(msg){toast.textContent=msg;toast.style.display='block';setTimeout(()=>toast.style.display='none',1200);}

/* ---- 對話腳本 ---- */
const SYS='img/avatars/system.png';
const scripts={
  gate:[
    {n:'系統',a:SYS,t:'你站在「蘭薩爾小學」的校門口，雪光在牌匾上閃爍。'},
    {n:'艾薩克',a:'img/avatars/isaac.png',t:'「從這裡開始，先去哪裡看看？」'},
    {n:'系統',a:SYS,t:'選擇你的目的地。',
      choose:[
        {txt:'圖書館',go:'library'},
        {txt:'音樂教室',go:'music'},
        {txt:'美術教室',go:'art'},
        {txt:'操場',go:'playground'},
        {txt:'校長室',go:'principal'}
      ]}
  ],
  library:[
    {n:'艾薩克',a:'img/avatars/isaac.png',t:'「看！《時間祕境》自己翻頁了！」'},
    {n:'系統',a:SYS,t:'要閱讀嗎？',
      choose:[
        {txt:'閱讀並做筆記（真實+2）',act:()=>{state.T+=2;state.quests.library=true;showToast('真實 +2 / 閱讀任務完成');}},
        {txt:'先離開',go:'gate'}
      ]}
  ],
  music:[
    {n:'海瑟',a:'img/avatars/heather.png',t:'「這裡的音色真美…要一起彈嗎？」'},
    {n:'系統',a:SYS,t:'選擇練習項目：',
      choose:[
        {txt:'合奏挑戰（勇氣+2）',act:()=>{state.C+=2;state.quests.music=true;showToast('勇氣 +2 / 音樂任務完成');}},
        {txt:'靜靜聆聽（同理+1）',act:()=>{state.E+=1;showToast('同理 +1');}}
      ]}
  ],
  art:[
    {n:'迪恩',a:'img/avatars/dean.png',t:'「我正在畫狼的影子…要幫我調顏料嗎？」'},
    {n:'系統',a:SYS,t:'要幫忙嗎？',
      choose:[
        {txt:'幫忙（同理+2）',act:()=>{state.E+=2;state.quests.art=true;showToast('同理 +2 / 美術任務完成');}},
        {txt:'拒絕（真實+1）',act:()=>{state.T+=1;showToast('真實 +1');}}
      ]}
  ],
  playground:[
    {n:'里特',a:'img/avatars/rit.png',t:'「一起跑步吧！比比誰先到操場中央！」'},
    {n:'系統',a:SYS,t:'參加比賽？',
      choose:[
        {txt:'全力奔跑！（勇氣+3）',act:()=>{state.C+=3;state.quests.playground=true;showToast('勇氣 +3 / 體動任務完成');}},
        {txt:'偷懶一下（同理-1）',act:()=>{state.E-=1;showToast('同理 -1');}}
      ]}
  ],
  principal:[
    {n:'校長',a:'img/avatars/principal.png',t:'「真實永遠比勝利重要。」'},
    {n:'系統',a:SYS,t:'要報告學習心得嗎？',
      choose:[
        {txt:'誠實報告（真實+2）',act:()=>{state.T+=2;state.quests.principal=true;showToast('真實 +2 / 校長任務完成');}},
        {txt:'略過',go:'gate'}
      ]}
  ]
};

/* ---- 對話流程 ---- */
let cur=scripts.gate,idx=0;
function showLine(o){
  who.textContent=o.n;
  line.textContent=o.t;
  ava.src=o.a;
  opts.innerHTML='';
  if(o.act){o.act();syncHUD();}
  if(o.choose){
    o.choose.forEach(ch=>{
      const b=document.createElement('button');
      b.className='btn'; b.textContent=ch.txt;
      b.addEventListener('click',()=>{
        SFX.currentTime=0;SFX.play();
        if(ch.act)ch.act();
        if(ch.go)setScene(ch.go);
        syncHUD();
      });
      opts.appendChild(b);
    });
  }
}

/* 下一句 */
document.getElementById('next').addEventListener('click',()=>{
  SFX.currentTime=0;SFX.play();
  opts.innerHTML='';
  if(idx<cur.length)showLine(cur[idx++]);
  else idx=0;
});

/* ---- 場景切換 ---- */
async function setScene(name){
  idx=0;
  cur=scripts[name]||[{n:'系統',a:SYS,t:'未知場景。'}];
  showLine(cur[idx++]);
  if(typeof loadPano==='function') await loadPano(name);
  syncHUD();
}

/* ---- 初始化 ---- */
setScene('gate');

/* ---- 導航與快捷 ---- */
document.querySelectorAll('[data-jump]').forEach(b=>{
  b.addEventListener('click',()=>{SFX.play();location.href=b.dataset.jump;});
});
document.getElementById('returnGame').addEventListener('click',()=>{location.href='mission_snow_temple.html';});
// === Isaac Home Quest Extension ===
if (!window.QuestSystem) window.QuestSystem = {};

QuestSystem.update = function(title, description) {
  const questBox = document.getElementById('questUpdate');
  if (!questBox) return;
  questBox.innerText = description ? `${title}：${description}` : `任務更新：${title}`;
  questBox.style.display = 'block';
  setTimeout(() => questBox.style.display = 'none', 3000);
};

QuestSystem.playBGM = function(src, volume = 0.5, loop = true) {
  if (window.AudioManager && AudioManager.play) {
    AudioManager.play(src, volume, loop);
  } else {
    const bgm = new Audio(src);
    bgm.loop = loop;
    bgm.volume = volume;
    bgm.play();
    window._isaacBGM = bgm;
  }
};

QuestSystem.fadeOutBGM = function(duration = 2000) {
  if (window.AudioManager && AudioManager.fadeOut) AudioManager.fadeOut(duration);
  else if (window._isaacBGM) {
    const bgm = window._isaacBGM;
    const step = bgm.volume / (duration / 100);
    const fade = setInterval(() => {
      if (bgm.volume > 0.05) bgm.volume -= step;
      else { bgm.pause(); clearInterval(fade); }
    }, 100);
  }
};
