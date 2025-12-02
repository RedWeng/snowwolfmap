const Dialogue={
  init(){
    this.box=document.getElementById("dialogueBox");
    this.char=document.getElementById("dialogueCharacter");
    this.text=document.getElementById("dialogueText");
    this.portrait=document.getElementById("dialoguePortrait");
    this.img=document.getElementById("portraitImg");
    this.next=document.getElementById("nextBtn");
    console.log("💬 Dialogue ready");
  },

  play(lines,onFinish){
    const b=this.box,c=this.char,t=this.text,p=this.portrait,i=this.img,n=this.next;
    let idx=0;
    const showLine=()=>{
      if(idx>=lines.length){b.style.display="none";p.style.display="none";if(onFinish)onFinish();return;}
      const l=lines[idx];
      b.style.display="block";p.style.display="block";
      c.textContent=l.n;t.textContent="";i.src=l.a||"img/isaac_home/isaac_portrait.png";
      let j=0;
      const s=setInterval(()=>{
        t.textContent=l.t.slice(0,j);
        j++;if(j>l.t.length){clearInterval(s);}
      },40);
      idx++;
    };
    n.onclick=showLine;
    showLine();
  }
};
