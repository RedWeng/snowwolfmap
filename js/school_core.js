const $ = (q, sc=document)=>sc.querySelector(q);
const $$ = (q, sc=document)=>Array.from(sc.querySelectorAll(q));

/* --- 音效 --- */
const bgm = $("#bgm_day");
bgm.volume = 0.5; bgm.play();
const sfx = $("#sfx");
function playSfx(){ try{sfx.currentTime=0; sfx.play();}catch{} }

/* --- 360 Viewer --- */
let viewer, currentPano;
function ensureViewer(){
  if(!viewer){
    viewer = new PANOLENS.Viewer({
      container: document.querySelector("#panoMount"),
      controlBar: false,
      cameraFov: 75
    });
  }
  return viewer;
}

/* --- 場景圖片 --- */
const PANO = {
  gate: "img/360/school_gate_360.jpg",
  classroom: "img/360/school_classroom_360.jpg",
  library: "img/360/school_library_360.jpg",
  music: "img/360/school_music_360.jpg",
  art: "img/360/school_art_360.jpg",
  playground: "img/360/school_playground_360.jpg",
  principal: "img/360/school_office_360.jpg"
};

function setScene(name){
  const panoURL = PANO[name];
  if(!panoURL) return;
  const v = ensureViewer();
  if(currentPano){ v.remove(currentPano); }
  currentPano = new PANOLENS.ImagePanorama(panoURL);
  v.add(currentPano);
  v.setPanorama(currentPano);
}

/* --- 場景切換按鈕 --- */
$$('[data-pan]').forEach(b=>{
  b.onclick=()=>{ playSfx(); setScene(b.dataset.pan); };
});

/* --- 導覽跳轉 --- */
$$('[data-jump]').forEach(b=>{
  b.onclick=()=>{ playSfx(); location.href=b.dataset.jump; };
});

/* --- 對話系統 --- */
const who = $("#who");
const line = $("#line");
const nextBtn = $("#next");
const ava = $("#ava");

let curDialog = [];
let idx = 0;

/* 校長開場對話內容 */
const openingScene = [
  { n:"校長‧羅倫斯", a:"img/npc/principal.jpg", t:"歡迎回到蘭薩爾小學……孩子們，這裡，是你們夢想與勇氣的起點。" },
  { n:"校長‧羅倫斯", a:"img/npc/principal.jpg", t:"在這座學園裡，勇氣、同理與真實，將是你們成長的三把鑰匙。" },
  { n:"校長‧羅倫斯", a:"img/npc/principal.jpg", t:"去吧，從校門口出發，開啟屬於你們的冒險。" },
  { n:"系統", a:"img/npc/system.png", t:"任務【序章：踏入蘭薩爾】已啟動！請前往『音樂教室』開始第一個挑戰。" }
];

/* 顯示對話 */
function showLine(o){
  who.textContent = o.n;
  line.textContent = o.t;
  ava.src = o.a;
}

/* 下一句 */
nextBtn.addEventListener("click", ()=>{
  playSfx();
  if(idx < curDialog.length){
    showLine(curDialog[idx++]);
  } else {
    $("#dialogBox").classList.add("hidden");
    setScene("gate");
  }
});

/* 啟動對話 */
function startOpening(){
  curDialog = openingScene;
  idx = 0;
  $("#dialogBox").classList.remove("hidden");
  showLine(curDialog[idx++]);
}

/* 啟動頁面 */
window.addEventListener("load",()=>{
  setScene("gate"); // 預設背景
  startOpening();   // 啟動校長對話
});
