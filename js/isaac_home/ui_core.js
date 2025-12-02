const UICore={
  init(){
    console.log("🧩 UICore loaded");
    this.current="home";
    HUD.init();
    Dialogue.init();
    this.bindButtons();
    this.renderScene();
  },

  bindButtons(){
    document.getElementById("btnHome").onclick=()=>this.switchScene("home");
    document.getElementById("btnWardrobe").onclick=()=>alert("衣櫃系統開發中");
    document.getElementById("btnInventory").onclick=()=>alert("道具系統開發中");
    document.getElementById("btnBGM").onclick=()=>alert("🎵 BGM 系統待整合 Suno 曲");
    document.getElementById("toggleQuest").onclick=()=>{
      const box=document.getElementById("questBox");
      box.classList.toggle("active");
    };
  },

  switchScene(name){
    const flash=document.getElementById("flashFX");
    flash.style.opacity="1";
    setTimeout(()=>{
      document.querySelectorAll(".scene-bg").forEach(bg=>bg.classList.remove("show"));
      const newBg=document.getElementById("bg_"+name);
      newBg.classList.add("show");
      flash.style.opacity="0";
      this.current=name;
      this.renderScene();
    },300);
  },

  renderScene(){
    document.querySelectorAll(".hotspot").forEach(h=>h.remove());
    const make=(l,t,w,h,txt,fn)=>{
      const d=document.createElement("div");
      Object.assign(d.style,{left:l+"%",top:t+"%",width:w+"%",height:h+"%",position:"absolute",cursor:"pointer",zIndex:10});
      d.className="hotspot";d.title=txt;
      d.onclick=()=>{new Audio('audio/sfx/click.wav').play().catch(()=>{});fn();};
      document.body.appendChild(d);
    };

    if(this.current==="home"){
      make(62,56,12,20,"進入書房",()=>this.switchScene("study"));
    }
    if(this.current==="study"){
      make(58,60,12,20,"父親的筆記本",()=>{
        Dialogue.play([
          {n:"艾薩克",t:"這本筆記本……是父親留下的嗎？"},
          {n:"艾薩克",t:"上面寫著：『雪狼不是敵人，而是記憶的守護者。』"},
          {n:"艾薩克",t:"父親早就知道真相了……"}
        ],()=>{
          HUD.update("T",2);
          UICore.addQuest("找到父親的筆記本");
          make(70,50,10,20,"前往地下室",()=>UICore.switchScene("basement"));
        });
      });
    }
    if(this.current==="basement"){
      make(45,55,15,25,"記憶核心",()=>{
        Dialogue.play([
          {n:"艾薩克",t:"這裡是……父親守護的記憶核心。"},
          {n:"艾薩克",t:"原來雪狼族的秘密就在這裡。"}
        ],()=>{
          HUD.update("C",3);
          UICore.addQuest("揭開雪狼族的秘密");
        });
      });
    }
  },

  addQuest(q){
    const list=document.getElementById("questList");
    const li=document.createElement("li");
    li.textContent="🗒 "+q;
    list.appendChild(li);
  }
};
