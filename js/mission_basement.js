/* =======================================
   🧩 Isaac Home – Basement Mission System v1.0
   ======================================= */

const MissionBasement = {
  stage: Number(localStorage.getItem("quest_basement_stage") || 0),
  foundBox: false,
  foundCore: false,
  chipPlayed: false,

  init() {
    console.log("🕹️ Basement mission initialized (stage:", this.stage, ")");
    this.cacheDom();
    this.bindEvents();
    this.startIntro();
  },

  cacheDom() {
    this.core = document.getElementById("core");
    this.box = document.getElementById("box");
    this.questList = document.getElementById("questList");
    this.flash = document.getElementById("coreFlash");
  },

  bindEvents() {
    this.core.onclick = () => this.triggerCore();
    this.box.onclick = () => this.triggerBox();
  },

  startIntro() {
    if (this.stage === 0) {
      Dialogue.play([
        { n: "艾薩克", t: "這裡……好黑。電力系統幾乎壞了。" },
        { n: "艾薩克", t: "父親常說，『光會記得那些相信它的人』……" },
        { n: "系統", t: "任務更新：調查記憶核心與舊金屬箱。" }
      ], () => {
        UICore.addQuest("探索地下室");
        this.stage = 1;
        localStorage.setItem("quest_basement_stage", 1);
      });
    }
  },

  triggerBox() {
    if (this.foundBox) return;
    this.foundBox = true;
    Dialogue.play([
      { n: "艾薩克", t: "這個舊箱子……被鎖上了。" },
      { n: "系統", t: "提示：能源系統需要啟動。" }
    ], () => {
      UICore.addQuest("找到能源源頭");
      this.checkProgress();
    });
  },

  triggerCore() {
    if (this.foundCore) return;
    this.foundCore = true;
    this.flash.classList.add("flash-active");
    setTimeout(() => this.flash.classList.remove("flash-active"), 2500);

    UICore.playSFX && UICore.playSFX("audio/core_activate.wav");

    Dialogue.play([
      { n: "艾薩克", t: "這光……像在呼吸。父親的能源理論是真的。" },
      { n: "系統", t: "任務更新：啟動記憶核心。" }
    ], () => {
      UICore.addQuest("啟動記憶核心");
      this.checkProgress();
    });
  },

  checkProgress() {
    if (this.foundBox && this.foundCore && this.stage < 2) {
      this.stage = 2;
      localStorage.setItem("quest_basement_stage", 2);
      this.playFatherRecording();
    }
  },

  playFatherRecording() {
    Dialogue.play([
      { n: "艾薩克", t: "父親的錄音晶片……還能運作嗎？" },
      { n: "錄音", t: "（聲音顫抖）艾薩克……如果你能聽見這段訊息……代表系統還沒被摧毀……" },
      { n: "錄音", t: "記住，光不只是能量，它會記得你做過的選擇……" }
    ], () => {
      this.playChipAudio();
    });
  },

  playChipAudio() {
    const chip = new Audio("audio/record_chip.mp3");
    chip.volume = 0.6;
    chip.play();
    this.chipPlayed = true;

    chip.onended = () => {
      UICore.addQuest("找到密門線索");
      this.spawnPortal();
      this.stage = 3;
      localStorage.setItem("quest_basement_stage", 3);
    };
  },

  spawnPortal() {
    const portal = document.createElement("button");
    portal.textContent = "➡️ 前往地底室";
    portal.className = "portalBtn";
    Object.assign(portal.style, {
      position: "absolute",
      left: "50%", bottom: "120px",
      transform: "translateX(-50%) scale(0.9)",
      padding: "12px 22px",
      background: "linear-gradient(90deg,#6ecbff,#b6e6ff)",
      border: "none",
      borderRadius: "12px",
      color: "#0b1a2a",
      fontWeight: "bold",
      boxShadow: "0 0 20px rgba(150,200,255,0.6)",
      cursor: "pointer",
      zIndex: "40",
      transition: "all .4s ease"
    });
    portal.onmouseover = () => (portal.style.transform = "translateX(-50%) scale(1.05)");
    portal.onmouseout = () => (portal.style.transform = "translateX(-50%) scale(0.9)");
    portal.onclick = () => {
      Dialogue.play([{ n: "系統", t: "傳送門啟動中……" }], () => {
        window.location.href = "isaac_secret.html";
      });
    };
    document.body.appendChild(portal);

    // 小動畫
    portal.animate(
      [
        { opacity: 0, transform: "translateX(-50%) scale(0.7)" },
        { opacity: 1, transform: "translateX(-50%) scale(1)" }
      ],
      { duration: 800, easing: "ease-out", fill: "forwards" }
    );
  }
};

// ✅ 啟動模組
window.addEventListener("load", () => {
  if (typeof UICore === "undefined" || typeof Dialogue === "undefined") {
    console.error("❌ UICore / Dialogue 未載入，請先引入核心模組。");
    return;
  }
  MissionBasement.init();
});
