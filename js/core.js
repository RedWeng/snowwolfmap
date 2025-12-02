// === js/isaac_home/ui_core.js ===
const UICore = {
  bgm: null,
  sfx: null,

  init() {
    console.log("🎮 UICore ready");

    // --- 音效 ---
    this.sfx = new Audio("sfx/click.wav");

    // --- 綁定導覽列跳轉 ---
    const navButtons = document.querySelectorAll("[data-jump]");
    navButtons.forEach(btn=>{
      btn.onclick = () => {
        const target = btn.dataset.jump;
        this.playClick();
        console.log("➡️ 跳轉到", target);
        window.location.href = target;
      };
    });

    // --- BGM 控制 ---
    const bgmBtn = document.getElementById("bgmBtn");
    if (bgmBtn) {
      bgmBtn.addEventListener("click",()=>{
        this.toggleBGM(bgmBtn);
      });
    }

    // --- 任務面板開關 ---
    const questBox = document.getElementById("questBox");
    const toggleQuest = document.getElementById("toggleQuest");
    if (toggleQuest && questBox) {
      toggleQuest.addEventListener("click",()=>{
        questBox.classList.toggle("active");
        this.playClick();
      });
    }

    // --- HUD 初始化 ---
    if (window.HUD && HUD.init) HUD.init();

    // --- 自動播放 BGM ---
    this.autoPlayBGM("audio/bgm_home.mp3");
  },

  // --- 音效 ---
  playClick(){
    if (this.sfx) {
      this.sfx.currentTime = 0;
      this.sfx.play().catch(()=>{});
    }
  },

  // --- BGM ---
  toggleBGM(btn){
    if (!this.bgm) {
      this.autoPlayBGM("audio/bgm_home.mp3");
      btn.textContent = "🔊 BGM 開";
    } else {
      this.bgm.pause();
      this.bgm = null;
      btn.textContent = "🔇 BGM 關";
    }
    this.playClick();
  },

  autoPlayBGM(src){
    if (this.bgm) return;
    this.bgm = new Audio(src);
    this.bgm.loop = true;
    this.bgm.volume = 0.5;
    const start = ()=>{ this.bgm.play().catch(()=>{}); document.body.removeEventListener("click",start); };
    document.body.addEventListener("click",start);
  },

  // --- 任務新增 ---
  addQuest(title){
    const questList = document.getElementById("questList");
    if (!questList) return;
    const li = document.createElement("li");
    li.textContent = `🗒 ${title}`;
    questList.appendChild(li);
  }
};

// === 啟動 ===
window.addEventListener("load", () => {
  console.log("✅ DOM loaded — initializing UICore");
  UICore.init();
});
