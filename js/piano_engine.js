// === Panolens 360 Viewer 控制 ===
const panoMount = document.getElementById('panoMount');
let viewer = null, currentPano = null;

// 360 圖片路徑表
const PANO = {
  gate:'img/360/school_gate_360.jpg',
  classroom:'img/360/school_classroom_360.jpg',
  library:'img/360/school_library_360.jpg',
  music:'img/360/school_music_360.jpg',
  art:'img/360/school_art_360.jpg',
  playground:'img/360/school_playground_360.jpg',
  principal:'img/360/school_office_360.jpg'
};

// 確保容器存在
if (!panoMount) {
  console.error('❌ 找不到 panoMount');
}

// === 初始化 Viewer ===
function ensureViewer(){
  if(!viewer){
    viewer = new PANOLENS.Viewer({
      container: panoMount,
      controlBar: false,
      autoHideInfospot: true,
      cameraFov: 75,
      output: 'console',
      viewIndicator: true,
      dwellTime: 800
    });
    // 給一點透明黑背景，避免初始閃白
    panoMount.style.background = '#000';
  }
  return viewer;
}

// === 載入全景圖 ===
async function loadPano(name){
  const url = PANO[name];
  if(!url){console.warn('⚠️ 沒找到場景',name);return;}
  
  const v = ensureViewer();

  // 移除舊場景
  if(currentPano){
    try{v.remove(currentPano);}catch(e){console.warn(e);}
    currentPano.dispose && currentPano.dispose();
    currentPano = null;
  }

  // 創建新全景
  const pano = new PANOLENS.ImagePanorama(url);
  pano.addEventListener('enter-fade-start',()=>console.log('進入場景:',name));
  pano.addEventListener('error',()=>console.error('❌ 無法載入',url));

  v.add(pano);
  v.setPanorama(pano);
  currentPano = pano;
}

// === 初始化預設場景 ===
window.addEventListener('DOMContentLoaded', ()=>{
  panoMount.style.position='absolute';
  panoMount.style.inset='0';
  panoMount.style.zIndex='0';
  panoMount.style.width='100%';
  panoMount.style.height='100%';
  panoMount.style.overflow='hidden';
  loadPano('gate');
});

// 讓其他模組能呼叫
window.loadPano = loadPano;
