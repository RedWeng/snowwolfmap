/* =========================================================
   雪狼男孩：艾薩克之家 - Game Core (專屬版)
   ---------------------------------------------------------
   本模組僅用於艾薩克家場景，完全獨立於主引擎。
   功能包含：
   - 場景控制 (SceneIsaac)
   - 任務提示 (QuestSystemIsaac)
   - 音樂淡入淡出 (AudioIsaac)
   - 情緒顯示 (EmotionHUDIsaac)
   ========================================================= */

console.log("%c[雪狼男孩] Isaac House Core 已啟動 🎵", "color:#88f;font-weight:bold;");

// =========================================================
// 🎵 背景音樂控制器
// =========================================================
window.AudioIsaac = {
  bgm: null,
  current: null,

  play(src, vol = 0.5, loop = true) {
    try {
      if (this.current === src && this.bgm && !this.bgm.paused) return;
      this.stop();

      const audio = new Audio(src);
      audio.loop = loop;
      audio.volume = 0;
      audio.play();
      this.bgm = audio;
      this.current = src;

      const fadeIn = setInterval(() => {
        if (audio.volume < vol) audio.volume = Math.min(vol, audio.volume + 0.05);
        else clearInterval(fadeIn);
      }, 150);
    } catch (err) {
      console.warn("AudioIsaac 播放錯誤：", err);
    }
  },

  fadeOut(duration = 2000) {
    if (!this.bgm) return;
    const step = this.bgm.volume / (duration / 100);
    const fade = setInterval(() => {
      if (this.bgm.volume > 0.05) this.bgm.volume -= step;
      else {
        this.stop();
        clearInterval(fade);
      }
    }, 100);
  },

  stop() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
    this.bgm = null;
    this.current = null;
  }
};

// =========================================================
// 🌟 任務提示系統
// =========================================================
window.QuestSystemIsaac = {
  update(title, desc) {
    const box = document.getElementById("questUpdate");
    if (!box) return;
    box.innerText = desc ? `${title}：${desc}` : title;
    box.style.display = "block";
    box.style.opacity = "1";
    box.style.transition = "opacity 0.8s ease";

    setTimeout(() => {
      box.style.opacity = "0";
      setTimeout(() => (box.style.display = "none"), 1000);
    }, 3000);
  }
};

// =========================================================
// 💫 情緒HUD (理解 / 恐懼 / 憤怒)
// =========================================================
window.EmotionHUDIsaac = {
  data: { understanding: 0.5, fear: 0.3, anger: 0.2 },
  el: null,

  init() {
    if (document.getElementById("emotionHUD")) return;
    this.el = document.createElement("div");
    this.el.id = "emotionHUD";
    Object.assign(this.el.style, {
      position: "absolute",
      top: "20px",
      left: "20px",
      padding: "10px 15px",
      background: "rgba(0,0,0,0.55)",
      color: "#fff",
      borderRadius: "10px",
      fontSize: "14px",
      zIndex: "60"
    });
    document.body.appendChild(this.el);
    this.refresh();
  },

  refresh() {
    const { understanding, fear, anger } = this.data;
    this.el.innerHTML = `
      💫 理解 ${(understanding * 100).toFixed(0)}%<br>
      😨 恐懼 ${(fear * 100).toFixed(0)}%<br>
      😡 憤怒 ${(anger * 100).toFixed(0)}%
    `;
    document.body.style.filter = `brightness(${0.7 + understanding * 0.5})`;
  },

  add(key, val) {
    if (this.data[key] !== undefined) {
      this.data[key] = Math.max(0, Math.min(1, this.data[key] + val));
      this.refresh();
    }
  }
};

// =========================================================
// 🧭 場景系統（單頁控制）
// =========================================================
window.SceneIsaac = {
  current: "home",

  init() {
    console.log("%c[SceneIsaac] 初始化完成 ✅", "color:#9cf;");
    EmotionHUDIsaac.init();
    AudioIsaac.play("audio/bgm_home.mp3", 0.5);
    this.bindButtons();
    this.renderScene();
  },

  switchScene(name) {
    document.querySelectorAll(".scene-bg").forEach(bg => bg.classList.remove("active"));
    document.getElementById(`bg_${name}`).classList.add("active");
    this.current = name;
    this.renderScene();

    // BGM 切換
    const bgmMap = {
      home: "audio/bgm_home.mp3",
      study: "audio/bgm_darkroom.mp3",
      basement: "audio/bgm_darkroom.mp3",
      memory: "audio/bgm_memorycore.mp3"
    };
    AudioIsaac.play(bgmMap[name], 0.5);
  },

  renderScene() {
    document.querySelectorAll(".hotspot").forEach(h => h.remove());

    if (this.current === "home") {
      this.hotspot(63, 58, 12, 20, "進入書房", () => this.switchScene("study"));
      this.hotspot(10, 55, 20, 25, "前往森林（鎖定）", () =>
        this.dialogue([
          { char: "艾薩克", text: "森林被雪霧覆蓋，現在不能前往。" }
        ])
      );
    }

    if (this.current === "study") {
      this.hotspot(58, 62, 12, 20, "父親的筆記本", () => {
        this.dialogue([
          { char: "艾薩克", text: "這是父親的筆記本……" },
          { char: "艾薩克", text: "『雪狼不是敵人，它們守護著記憶……』" },
          { char: "艾薩克", text: "父親早就知道真相了……" }
        ]);
        QuestSystemIsaac.update("任務更新", "找到父親的日記。");
      });
      this.hotspot(78, 40, 10, 30, "地下室門", () => this.switchScene("basement"));
    }

    if (this.current === "basement") {
      this.hotspot(50, 40, 20, 30, "記憶核心", () => this.switchScene("memory"));
    }

    if (this.current === "memory") {
      this.dialogue([
        { char: "艾薩克", text: "這是……雪狼的記憶。" },
        { char: "艾薩克", text: "父親原來一直在守護它。" }
      ]);
      QuestSystemIsaac.update("任務完成", "艾薩克理解了雪狼的真相。");
    }
  },

  hotspot(left, top, width, height, title, onClick) {
    const h = document.createElement("div");
    h.className = "hotspot";
    h.style.left = `${left}%`;
    h.style.top = `${top}%`;
    h.style.width = `${width}%`;
    h.style.height = `${height}%`;
    h.title = title;
    h.onclick = onClick;
    document.body.appendChild(h);
  },

  dialogue(lines) {
    const box = document.getElementById("dialogueBox");
    const char = document.getElementById("dialogueCharacter");
    const text = document.getElementById("dialogueText");
    let i = 0;

    const show = () => {
      const line = lines[i];
      if (!line) {
        box.style.display = "none";
        return;
      }
      box.style.display = "block";
      char.textContent = line.char;
      text.textContent = line.text;
      i++;
    };
    box.onclick = show;
    show();
  },

  bindButtons() {
    const back = document.getElementById("btnBack");
    if (back) back.onclick = () => this.switchScene("home");
  }
};
