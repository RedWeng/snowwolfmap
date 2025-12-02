/* ============================================================
   SnowWolf HUB v7.0 - UI & FX 模組
   ============================================================ */

export const dialog=document.getElementById("dialogBox");

/* 對話顯示 */
export function showLine(name,avatar,text){
  document.getElementById("who").textContent=name;
  document.getElementById("line").textContent=text;
  document.getElementById("ava").src=avatar;
}

/* 任務清單 */
export function addQuest(q){
  const questList=document.getElementById("questList");
  const exist=Array.from(questList.children).some(li=>li.textContent.includes(q));
  if(!exist){
    const li=document.createElement("li");
    li.textContent="🗒 "+q;
    questList.appendChild(li);
  }
}

/* 屬性更新動畫 */
export function updateStat(id,val){
  const el=document.querySelector("#hud"+id);
  const num=el.querySelector("b");
  num.textContent=parseInt(num.textContent)+val;
  el.classList.add("gain");
  setTimeout(()=>el.classList.remove("gain"),1500);
}

/* 任務完成特效 */
export function showMissionFX(text="任務完成！"){
  const fx=document.getElementById("missionFX");
  fx.textContent=text;
  fx.classList.remove("showFX");
  void fx.offsetWidth; // reset animation
  fx.classList.add("showFX");
}
