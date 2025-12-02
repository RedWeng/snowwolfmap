/************************************************************
 * Snow Wolf Content Factory - Arcane Fusion Engine v6.7.2
 * 可連續聊天 + 故事記憶 + GPT/Gemini 雙引擎
 ************************************************************/

console.log("Arcane Engine v6.7.2 Loaded");

// ====== API Keys（請換成你自己的） ======
const OPENAI_KEY = "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";
const GEMINI_KEY = "AIzaSyByuCbWgxirSBawtMbyk2JCxuOEMmh9i0E";

// ====== DOM ======
const sendBtn = document.getElementById("runBtn");
const chatWindow = document.getElementById("chatWindow");
const engineSelect = document.getElementById("engine");
const promptInput = document.getElementById("promptInput");

// 導入故事
const feedBtn = document.getElementById("feedBtn");
const feedStatus = document.getElementById("feedStatus");
const seasonInput = document.getElementById("seasonInput");

// ====== 故事資料 ======
let STORY_MEMORY = "";

// ====== ⭐ 多輪對話記憶 ======
let gptMessages = [];
let geminiHistory = [];

// ====== UI 泡泡 ======
function appendBubble(role, text) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", role);

  bubble.innerHTML = `
      <div class="bubble-role">
        ${role === "user" ? "你" : role === "gpt" ? "GPT" : "Gemini"}
      </div>
      <div class="bubble-text">${text}</div>
  `;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}


// ====== 導入故事 ======
feedBtn.addEventListener("click", () => {
  const text = seasonInput.value.trim();

  if (!text) {
    feedStatus.textContent = "❌ 導入失敗：沒有文字。";
    feedStatus.style.color = "#ff6b6b";
    return;
  }

  STORY_MEMORY = text;

  // GPT 初始系統提示
  gptMessages = [
    {
      role: "system",
      content:
        `你是《雪狼男孩》的世界觀顧問。
以下為世界觀資料：
${STORY_MEMORY}
請根據此資料回答。`
    }
  ];

  // Gemini 初始化
  geminiHistory = [
    {
      role: "user",
      parts: [
        {
          text:
            `你是《雪狼男孩》的世界觀顧問。
以下為故事資料：
${STORY_MEMORY}
請保持設定與角色一致性回答。`
        }
      ]
    }
  ];

  feedStatus.textContent = "✅ 故事資料庫導入成功！";
  feedStatus.style.color = "#7cf1b8";
});



// ====== GPT 多輪對話 ======
async function callGPT(prompt) {
  gptMessages.push({ role: "user", content: prompt });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`  // 👈🔥 已修正！
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: gptMessages
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "(GPT 回傳錯誤)";
    gptMessages.push({ role: "assistant", content: reply });

    return reply;

  } catch (err) {
    return "(GPT API Error)";
  }
}



// ====== Gemini 多輪對話 ======
async function callGemini(prompt) {
  geminiHistory.push({
    role: "user",
    parts: [{ text: prompt }]
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: geminiHistory })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(Gemini 回傳錯誤)";

    geminiHistory.push({
      role: "model",
      parts: [{ text: reply }]
    });

    return reply;

  } catch (err) {
    return "(Gemini API Error)";
  }
}



// ====== 主流程 ======
sendBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  appendBubble("user", prompt);

  const mode = engineSelect.value;

  if (mode === "gpt") {
    appendBubble("gpt", await callGPT(prompt));

  } else if (mode === "gemini") {
    appendBubble("gemini", await callGemini(prompt));

  } else if (mode === "both") {
    const [gpt, ge] = await Promise.all([
      callGPT(prompt),
      callGemini(prompt)
    ]);

    appendBubble("gpt", gpt);
    appendBubble("gemini", ge);
  }

  promptInput.value = "";
});