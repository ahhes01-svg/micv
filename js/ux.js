document.addEventListener('DOMContentLoaded',()=>{
  const selector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]';
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const menu=document.getElementById('nav-panel');
    const container=menu.classList.contains('open')?menu:document.querySelector('#project-modal:not([hidden]),#certificate-lightbox:not([hidden])');
    if(!container)return;
    const controls=[...container.querySelectorAll(selector)].filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
    if(!controls.length)return;
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&(document.activeElement===first||!container.contains(document.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||!container.contains(document.activeElement))){event.preventDefault();first.focus();}
  });
  let refreshFrame;
  document.querySelectorAll('details.skill-group').forEach(details=>details.addEventListener('toggle',()=>{
    cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>window.ScrollTrigger?.refresh());
  }));
  document.querySelectorAll('.expand-btn,.filter-btn').forEach(button=>button.addEventListener('click',()=>{
    setTimeout(()=>window.ScrollTrigger?.refresh(),460);
  }));
});
