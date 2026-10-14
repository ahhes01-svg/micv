window.initAnimations=function(){
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals=document.querySelectorAll(".reveal-up,.reveal-card");
  if(reduced||!window.gsap||!window.ScrollTrigger){reveals.forEach(el=>el.style.opacity=1);return;}
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".reveal-up").forEach(el=>gsap.fromTo(el,{y:18,opacity:0},{y:0,opacity:1,duration:.45,delay:Math.min(Number(el.dataset.delay||0),.12),ease:"power2.out",scrollTrigger:{trigger:el,start:"top 94%",once:true},onStart:()=>el.classList.add("is-visible")}));
  gsap.utils.toArray(".reveal-card").forEach((el,i)=>gsap.fromTo(el,{y:14,opacity:0},{y:0,opacity:1,duration:.4,delay:(i%3)*.025,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 96%",once:true}}));
  if(window.innerWidth>900&&matchMedia("(pointer:fine)").matches){
    document.querySelectorAll(".project-card,.skill-group").forEach(card=>{let frame=0,x=0,y=0;card.addEventListener("pointermove",event=>{const rect=card.getBoundingClientRect();x=event.clientX-rect.left;y=event.clientY-rect.top;if(!frame)frame=requestAnimationFrame(()=>{frame=0;card.style.setProperty("--mx",`${x}px`);card.style.setProperty("--my",`${y}px`);});},{passive:true});});
  }
};

