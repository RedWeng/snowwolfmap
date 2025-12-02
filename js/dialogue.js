// js/dialogue.js
import { playSfx, setScene } from "./core.js";

const dialog = document.getElementById("dialogBox");
const who = document.getElementById("who");
const line = document.getElementById("line");
const next = document.getElementById("next");
const ava = document.getElementById("ava");

const openingScene = [
  {n:"校長‧羅倫斯",a:"img/npc/principal.png",t:"歡迎回到蘭薩爾小學……孩子們，這裡，是你們夢想與勇氣的起點。"},
  {n:"校長‧羅倫斯",a:"img/npc/principal.png",t:"在這座學園裡，勇氣、同理與真實，將是你們成長的三把鑰匙。"},
  {n:"校長‧羅倫斯",a:"img/npc/principal.png",t:"去吧，從校門口出發，開啟屬於你們的冒險。"},
  {n:"系統",a:"img/npc/system.png",t:"任務【序章：踏入蘭薩爾】已啟動！請前往『音樂教室』開始第一個挑戰。"}
];

let cur=0;

export function showLine(o){who.textContent=o.n;line.textContent=o.t;ava.src=o.a;}

export function startOpening(){
  dialog.classList.remove("hidden");
  cur=0; showLine(openingScene[cur]);
}

next.addEventListener("click",()=>{
  playSfx();
  cur++;
  if(cur<openingScene.length){
    showLine(openingScene[cur]);
  } else {
    dialog.classList.add("hidden");
    setScene("gate");
  }
});
