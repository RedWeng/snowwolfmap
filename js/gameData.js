window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.characters = {
  heather: {
    name: "海瑟",
    role: "偵查 / 支援",
    hp: 92,
    stress: 63,
    status: "OK",
    mental: "穩定但高度緊繃",
    moodLine: "我不想再有人被帶走了。就算是我爸…我也要親眼看到他安全。",
    aiHint: "AI 分析：維持偵查行動，但壓力已接近危險。請在完成回收後迅速撤離。",
    voiceText: "說真的，我沒有在裝勇敢…我只是…我真的很怕下一個會是誰。",
    avatar: "img/characters/heather.jpg",
    portraitFull: "img/characters_full/heather_full.png",
    sceneBg: "img/locations/mirror_lake_bg.jpg",
    radarStats: {
      "壓力場": 70,
      "可視度": 80,
      "敵方數量": 40,
      "地形風險": 55,
      "隊伍穩定": 75
    },
    tagA: "遠程偵查",
    tagB: "低干擾潛行",
    tagC: "夜間視覺",
    artifacts: [
      { name: "鏡層殘響模組", desc: "可記錄『被帶走的那一刻』並作為證據" },
      { name: "靜壓標記符",   desc: "能標示異質生物的焦點，避免失控" }
    ]
  },

  rit: {
    name: "里特",
    role: "前鋒 / 救援",
    hp: 80,
    stress: 45,
    status: "撐著",
    mental: "情緒高度集中，拒絕撤離",
    moodLine: "我只是想把艾薩克的爸爸帶回來。就這樣。不要叫我冷靜。",
    aiHint: "AI 分析：此成員正在承擔過度壓力。短時間可用，長時間高崩潰風險。",
    voiceText: "別再叫我退後了，我不會走。",
    avatar: "img/characters/rit.jpg",
    portraitFull: "img/characters_full/rit_full.png",
    sceneBg: "img/locations/forest_clearing_bg.jpg",
    radarStats: {
      "壓力場": 60,
      "可視度": 55,
      "敵方數量": 75,
      "地形風險": 40,
      "隊伍穩定": 50
    },
    tagA: "高速突入",
    tagB: "肉身扛線",
    tagC: "不聽指揮",
    artifacts: [
      { name: "臨時固定繃帶", desc: "撐住身體到撤離點" },
      { name: "信標噴漆",   desc: "給走散成員看的緊急路標" }
    ]
  },

  dean: {
    name: "迪恩",
    role: "防線 / 正面擋衝",
    hp: 71,
    stress: 58,
    status: "疲勞",
    mental: "身體吃不消但還在撐，優先護住別人",
    moodLine: "頂著。我們要一起走。不要回頭看我，快走！",
    aiHint: "AI 分析：肌肉疲勞進入風險區。繼續硬扛可能造成永久傷害。",
    voiceText: "我沒事。你們先走。我頂得住。",
    avatar: "img/characters/dean.jpg",
    portraitFull: "img/characters_full/dean_full.png",
    sceneBg: "img/locations/ruin_corridor_bg.jpg",
    radarStats: {
      "壓力場": 85,
      "可視度": 40,
      "敵方數量": 50,
      "地形風險": 65,
      "隊伍穩定": 90
    },
    tagA: "盾牆",
    tagB: "破口阻擋",
    tagC: "高負重",
    artifacts: [
      { name: "膠質護臂", desc: "暫時吸收衝擊力" },
      { name: "重力固著釘", desc: "把我們的撤離點直接釘住" }
    ]
  },

  isaac: {
    name: "艾薩克",
    role: "遠程 / 老經驗",
    hp: 49,
    stress: 82,
    status: "腿傷",
    mental: "接近崩潰邊緣，仍在堅持定位訊號",
    moodLine: "他一定還活著。求你們不要放棄他。",
    aiHint: "AI 分析：立即撤離建議。再撐下去將導致嚴重後遺症。",
    voiceText: "我可以走…別把我當負擔…我拜託你…",
    avatar: "img/characters/isaac.jpg",
    portraitFull: "img/characters_full/isaac_full.png",
    sceneBg: "img/locations/stone_site_bg.jpg",
    radarStats: {
      "壓力場": 95,
      "可視度": 75,
      "敵方數量": 30,
      "地形風險": 88,
      "隊伍穩定": 40
    },
    tagA: "訊號定位",
    tagB: "遠距支援",
    tagC: "情緒不穩",
    artifacts: [
      { name: "記憶殘響收束器", desc: "鎖定最後出現的訊號" },
      { name: "行動支架", desc: "勉強支撐膝關節" }
    ]
  }
};
