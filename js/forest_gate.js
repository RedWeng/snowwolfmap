// === 🌲 穆高爾森林之門：任務與動畫控制 ===
window.addEventListener("load", () => {

  // 初始化共用 UI 系統
  UICore.init();
  console.log("✅ Forest Gate initialized.");

  // === 🎧 音樂與音效 ===
  const bgm = new Audio("audio/bgm_forest_gate.mp3");
  bgm.loop = true;
  bgm.volume = 0.45;
  const fxOpen = new Audio("audio/fx_gate_open.mp3");
  const fxMist = new Audio("audio/fx_mist_loop.mp3");
  fxMist.loop = true;
  fxMist.volume = 0.35;

  // === 🌫️ 初始霧氣動畫 ===
  const fogCanvas = document.getElementById("fogLayer");
  const ctx = fogCanvas.getContext("2d");
  fogCanvas.width = window.innerWidth;
  fogCanvas.height = window.innerHeight;

  let fogs = [];
  for (let i = 0; i < 30; i++) {
    fogs.push({
      x: Math.random() * fogCanvas.width,
      y: Math.random() * fogCanvas.height,
      r: 80 + Math.random() * 120,
      o: 0.04 + Math.random() * 0.07,
      s: 0.3 + Math.random() * 0.5
    });
  }

  function drawFog() {
    ctx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
    for (let f of fogs) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(200,230,255,${f.o})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.x += Math.sin(Date.now() * 0.0002) * f.s;
      f.y += Math.cos(Date.now() * 0.0003) * f.s;
      if (f.x > fogCanvas.width) f.x = -f.r;
      if (f.y > fogCanvas.height) f.y = -f.r;
    }
    requestAnimationFrame(drawFog);
  }
  drawFog();

  // === 💬 開場對話 ===
  setTimeout(() => {
    Dialogue.play([
      { n: "艾薩克", t: "……這裡就是父親提到的『穆高爾森林』？" },
      { n: "艾薩克", t: "那道巨門……彷彿在等待誰來開啟它。" },
      { n: "系統", t: "任務更新：啟動森林封印之門。" }
    ], () => {
      UICore.addQuest("啟動森林封印之門");
      // 自動播放 BGM
      const startPlay = () => {
        bgm.play().catch(() => {});
        document.body.removeEventListener("click", startPlay);
      };
      document.body.addEventListener("click", startPlay);
    });
  }, 1000);

  // === 🌀 門開動畫控制 ===
  const gate = document.getElementById("bgGate");
  const glow = document.querySelector(".fx-glow");
  const btnOpen = document.getElementById("openGateBtn");

  btnOpen.onclick = () => {
    fxOpen.play();
    fxMist.play();

    gate.classList.add("open");
    glow.classList.add("active");
    btnOpen.disabled = true;
    btnOpen.textContent = "啟動中…";

    // 門開過程動畫（3 秒）
    setTimeout(() => {
      btnOpen.style.display = "none";
      Dialogue.play([
        { n: "艾薩克", t: "光……正在回應我？" },
        { n: "艾薩克", t: "這股力量，像是森林本身的呼吸。" },
        { n: "系統", t: "任務完成：解鎖記憶核心，揭開雪狼之謎。" }
      ], () => {
        UICore.addQuest("解鎖記憶核心，揭開雪狼之謎");
        setTimeout(showNextButton, 2000);
      });
    }, 3000);
  };

  // === 🚪 前往下一章（穆高爾森林） ===
  function showNextButton() {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "➡️ 前往穆高爾森林";
    nextBtn.className = "chip";
    nextBtn.style.position = "absolute";
    nextBtn.style.bottom = "30px";
    nextBtn.style.right = "30px";
    nextBtn.style.zIndex = 50;
    nextBtn.style.background = "rgba(255,255,255,0.15)";
    nextBtn.style.border = "1px solid rgba(255,255,255,0.3)";
    nextBtn.style.backdropFilter = "blur(6px)";
    document.body.appendChild(nextBtn);

    nextBtn.onclick = () => {
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.open("mugor_forest.html", "_self");
      }, 500);
    };
  }
});
