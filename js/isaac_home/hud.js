const HUD={
  init(){
    console.log("📊 HUD ready");
    this.stats={C:0,E:0,T:0};
  },
  update(id,val){
    this.stats[id]+=val;
    const el=document.getElementById("hud"+id);
    const num=el.querySelector("b");
    num.textContent=this.stats[id];
    el.classList.add("gain");
    setTimeout(()=>el.classList.remove("gain"),1000);
    this.floatText(id,val);
  },
  floatText(id,val){
    const txt=document.createElement("div");
    txt.className="stat-float";
    let label="";
    if(id==="C")label="+勇氣";
    if(id==="E")label="+同理";
    if(id==="T")label="+真實";
    txt.textContent=label+" "+val;
    txt.style.left=(window.innerWidth-150)+"px";
    txt.style.top="40px";
    document.body.appendChild(txt);
    setTimeout(()=>txt.remove(),1200);
  }
};
