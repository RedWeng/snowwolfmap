const SceneIsaac = {
  current: "home",
  scenes: ["home", "study", "basement", "memory"],

  init() {
    UI.init();
    EmotionHUD?.init?.();
    FX.addFogLayer?.();
    QuestSystem.playBGM?.('audio/bgm_home.mp3', 0.5, true);

    this.bindNavigation();
    this.activateHotspots();
  },

  switchTo(name) {
    console.log("切換場景至:", name);
    this.current = name;

    // 換背景
    document.querySelectorAll('.scene-bg').forEach(bg => bg.classList.remove('active'));
    document.getElementById(`bg_${name}`).classList.add('active');

    // 切換音樂
    if (name === "study") QuestSystem.playBGM('audio/bgm_darkroom.mp3', 0.45, true);
    if (name === "memory") QuestSystem.playBGM('audio/bgm_memorycore.mp3', 0.55, true);

    // 重建互動
    this.activateHotspots();
  },

  bindNavigation() {
    document.getElementById('btnBack').onclick = () => {
      this.switchTo("home");
      QuestSystem.playBGM('audio/bgm_home.mp3', 0.5, true);
    };
  },

  activateHotspots() {
    // 清空舊的
    document.querySelectorAll('.hotspot').forEach(h => h.remove());

    // 根據場景新增互動點
    if (this.current === "home") {
      this.createHotspot("go_study", 63, 58, 12, 20, "進入書房", () => this.switchTo("study"));
      this.createHotspot("go_forest", 10, 55, 20, 25, "前往森林", () => {
        UI.showDialogue([{char:'艾薩克',text:'森林被雪霧覆蓋，現在不能前往。'}]);
      });
    }

    if (this.current === "study") {
      this.createHotspot("obj_diary", 58, 62, 12, 20, "艾薩克父親的日記", () => {
        UI.showDialogue([
          { char:'艾薩克', text:'這是父親的筆記本……' },
          { char:'艾薩克', text:'「雪狼不是敵人……」' }
        ], ()=>QuestSystem.update('任務更新','找到父親的日記。'));
      });
      this.createHotspot("obj_door", 78, 40, 10, 30, "地下室門", () => this.switchTo("basement"));
    }

    if (this.current === "basement") {
      this.createHotspot("obj_core", 50, 40, 20, 30, "記憶共鳴核心", () => this.switchTo("memory"));
    }

    if (this.current === "memory") {
      UI.showDialogue([
        { char:'艾薩克', text:'這是……雪狼的記憶。' },
        { char:'艾薩克', text:'父親原來一直在守護它。' }
      ], ()=>QuestSystem.update('任務完成','艾薩克理解了雪狼的真相。'));
    }
  },

  createHotspot(id, left, top, width, height, title, onClick) {
    const h = document.createElement('div');
    h.className = 'hotspot';
    h.id = id;
    h.title = title;
    h.style.left = `${left}%`;
    h.style.top = `${top}%`;
    h.style.width = `${width}%`;
    h.style.height = `${height}%`;
    h.onclick = onClick;
    document.body.appendChild(h);
  }
};
