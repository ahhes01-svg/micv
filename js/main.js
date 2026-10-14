document.addEventListener("DOMContentLoaded",()=>{
  const $=(selector,scope=document)=>scope.querySelector(selector);
  const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const storedLanguage=localStorage.getItem("portfolio-language")||"es";
  const storedTheme=localStorage.getItem("portfolio-theme")||"dark";
  document.documentElement.dataset.theme=storedTheme;
  applyTranslations(storedLanguage);
  if(window.lucide)window.lucide?.createIcons();

  const loaderTexts=getTranslation("loader",storedLanguage);let loaderStep=0;
  const loaderTimer=setInterval(()=>{$("#loader-text").textContent=loaderTexts[++loaderStep%loaderTexts.length];},400);
  setTimeout(()=>{clearInterval(loaderTimer);$("#loader").classList.add("is-hidden");},reduced?0:180);

  let typedInstance;
  const startTyped=language=>{if(typedInstance)typedInstance.destroy();if(window.Typed&&!reduced)typedInstance=new Typed("#typed-role",{strings:getTranslation("hero.roles",language),typeSpeed:48,backSpeed:28,backDelay:2000,loop:true,smartBackspace:true});else $("#typed-role").textContent=getTranslation("hero.roles",language)[0];};
  startTyped(storedLanguage);
  document.addEventListener("languagechange",event=>startTyped(event.detail.language));
  $("#language-toggle").addEventListener("click",()=>applyTranslations(window.currentLanguage==="es"?"en":"es"));

  const themeToggle=$("#theme-toggle");
  const updateThemeIcon=()=>{themeToggle.innerHTML=`<i data-lucide="${document.documentElement.dataset.theme==="dark"?"sun":"moon"}"></i>`;window.lucide?.createIcons();};
  updateThemeIcon();
  themeToggle.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("portfolio-theme",next);updateThemeIcon();});

  const header=$("#site-header"),progress=$(".reading-progress span");
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max?Math.min(scrollY/max,1):0})`;header.classList.toggle("scrolled",scrollY>20);};
  let scrollFrame=0;const queueScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateScroll();});};
  addEventListener("scroll",queueScroll,{passive:true});addEventListener("resize",queueScroll,{passive:true});updateScroll();

  const navPanel=$("#nav-panel"),navOverlay=$("#nav-overlay"),menuToggle=$("#menu-toggle");
  const mobileNav=matchMedia("(max-width:900px)");
  const setMenu=(open,restoreFocus=false)=>{const closeButton=$("#nav-close");closeButton.hidden=!open;navPanel.inert=mobileNav.matches&&!open;navPanel.classList.toggle("open",open);navOverlay.classList.toggle("open",open);document.body.classList.toggle("menu-open",open);menuToggle.setAttribute("aria-expanded",String(open));if(open)closeButton.focus();else if(restoreFocus)menuToggle.focus();};
  setMenu(false);mobileNav.addEventListener("change",()=>setMenu(false));
  menuToggle.addEventListener("click",()=>setMenu(true));$("#nav-close").addEventListener("click",()=>setMenu(false,true));navOverlay.addEventListener("click",()=>setMenu(false,true));$$('.nav-links a').forEach(link=>link.addEventListener("click",()=>setMenu(false)));

  const sections=$$("main section[id]");
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.nav-links a').forEach(link=>{const active=link.getAttribute("href")==="#"+entry.target.id;link.classList.toggle("active",active);if(active)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");});}}),{rootMargin:"-25% 0px -55%",threshold:0});sections.forEach(section=>sectionObserver.observe(section));

  $$(".expand-btn").forEach(button=>button.addEventListener("click",()=>{const content=button.nextElementSibling;const open=button.getAttribute("aria-expanded")==="true";button.setAttribute("aria-expanded",String(!open));content.setAttribute("aria-hidden",String(open));content.classList.toggle("open",!open);button.querySelector("span").textContent=!open?(window.currentLanguage==="es"?"Ver menos":"View less"):getTranslation("viewMore");button.querySelector("svg")?.setAttribute("data-lucide",!open?"minus":"plus");window.lucide?.createIcons();}));

  const statObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const element=entry.target,target=Number(element.dataset.target),start=performance.now();const animate=now=>{const p=Math.min((now-start)/900,1);element.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(animate);};requestAnimationFrame(animate);statObserver.unobserve(element);}),{threshold:.6});$$('.counter').forEach(counter=>statObserver.observe(counter));

  if(!reduced&&matchMedia("(pointer:fine)").matches){const glow=$(".cursor-glow");let pointerFrame=0,pointerX=0,pointerY=0;addEventListener("pointermove",event=>{pointerX=event.clientX;pointerY=event.clientY;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;glow.style.transform=`translate3d(${pointerX-160}px,${pointerY-160}px,0)`;});},{passive:true});}

  initCertificates();initAnimations();

  const showProjectFallback=image=>{
    const preview=image.closest(".project-preview"),screenshot=image.closest(".project-screenshot");
    if(!preview||!screenshot||preview.classList.contains("has-fallback"))return;
    preview.classList.add("has-fallback");
    screenshot.innerHTML=`<div class="project-fallback" role="img" aria-label="Vista previa no disponible para ${preview.dataset.fallbackTitle}"><i data-lucide="panel-top"></i><strong>${preview.dataset.fallbackTitle}</strong><span>${preview.dataset.fallbackCategory}</span><small>Vista previa no disponible</small></div>`;
    if(window.lucide)window.lucide?.createIcons();
  };
  $$(".project-screenshot img").forEach(image=>{
    image.addEventListener("error",()=>showProjectFallback(image),{once:true});
    if(image.complete&&image.naturalWidth===0)showProjectFallback(image);
  });

  const toast=$("#toast");let toastTimer;const showToast=message=>{toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);};
  $$(".copy-btn").forEach(button=>button.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(button.dataset.copy);showToast(window.currentLanguage==="es"?"Copiado al portapapeles":"Copied to clipboard");}catch{showToast(button.dataset.copy);}}));

  const projectData={camara:{type:"Portal institucional",title:"Cámara de Comercio de Ica",description:"Desarrollo, administración, mantenimiento, seguridad y optimización web institucional.",tags:["WordPress","Hosting","SSL","Optimización"],url:"https://camaraica.org.pe"},travel:{type:"Portal turístico institucional",title:"TravelVista",description:"Implementación y mantenimiento del portal turístico institucional.",tags:["WordPress","Responsive","Contenido"],url:"https://travelvista.camaraica.org.pe"},rio:{type:"Portal institucional",title:"Río Ica",description:"Desarrollo y administración web del portal institucional.",tags:["Web","Hosting","Administración"],url:"https://rioica.camaraica.org.pe"},vino:{type:"Portal para evento institucional",title:"Concurso del Vino",description:"Implementación, actualización y mantenimiento del portal del evento.",tags:["Web","Eventos","Responsive"],url:"https://concursovino.camaraica.org.pe"},bitel:{type:"Plataforma de incidencias y solicitudes",title:"Plataforma de Soporte IT Bitel",description:"Diseño y desarrollo de una solución para agilizar solicitudes técnicas.",tags:["HTML","CSS","JavaScript","PHP"],url:"https://it-bitelz.kesug.com"}};
  const projectModal=$("#project-modal");let lastFocus;
  const closeProject=()=>{projectModal.hidden=true;document.body.classList.remove("modal-open");lastFocus?.focus();};
  $$(".project-details").forEach(button=>button.addEventListener("click",()=>{lastFocus=button;const data=projectData[button.closest(".project-card").dataset.project];$("#project-modal-type").textContent=data.type;$("#project-modal-title").textContent=data.title;$("#project-modal-description").textContent=data.description;$("#project-modal-tags").innerHTML=data.tags.map(tag=>`<span>${tag}</span>`).join("");$("#project-modal-link").href=data.url;projectModal.hidden=false;document.body.classList.add("modal-open");$(".modal-close",projectModal).focus();}));
  $(".modal-close",projectModal).addEventListener("click",closeProject);$(".modal-backdrop",projectModal).addEventListener("click",closeProject);

  const lightbox=$("#certificate-lightbox"),lightboxImage=$("#lightbox-image"),lightboxVerify=$("#lightbox-verify");let activeCert=0,zoom=1;
  const updateLightbox=()=>{const cert=certificatesData[activeCert];lightboxImage.src=cert.image;lightboxImage.alt=`Certificado: ${cert.title}`;$("#lightbox-title").textContent=cert.title;$("#lightbox-meta").textContent=`${cert.institution} · ${cert.date}${cert.duration?` · ${cert.duration}`:""}`;lightboxVerify.hidden=!cert.verify;if(cert.verify)lightboxVerify.href=cert.verify;else lightboxVerify.removeAttribute("href");zoom=1;applyZoom();};
  const applyZoom=()=>{lightboxImage.style.transform=`scale(${zoom})`;$("#zoom-value").textContent=Math.round(zoom*100)+"%";};
  const openLightbox=index=>{lastFocus=document.activeElement;activeCert=Number(index);updateLightbox();lightbox.hidden=false;document.body.classList.add("modal-open");$(".lightbox-close").focus();};
  const closeLightbox=()=>{lightbox.hidden=true;document.body.classList.remove("modal-open");lastFocus?.focus();};
  document.addEventListener("click",event=>{const trigger=event.target.closest(".certificate-open");if(trigger)openLightbox(trigger.dataset.certIndex);});
  $(".lightbox-close").addEventListener("click",closeLightbox);$(".lightbox-backdrop").addEventListener("click",closeLightbox);$(".lightbox-prev").addEventListener("click",()=>{activeCert=(activeCert-1+certificatesData.length)%certificatesData.length;updateLightbox();});$(".lightbox-next").addEventListener("click",()=>{activeCert=(activeCert+1)%certificatesData.length;updateLightbox();});$("#zoom-in").addEventListener("click",()=>{zoom=Math.min(zoom+.25,2.5);applyZoom();});$("#zoom-out").addEventListener("click",()=>{zoom=Math.max(zoom-.25,.75);applyZoom();});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"){if(!lightbox.hidden)closeLightbox();else if(!projectModal.hidden)closeProject();else if(navPanel.classList.contains("open"))setMenu(false,true);}if(!lightbox.hidden&&event.key==="ArrowRight")$(".lightbox-next").click();if(!lightbox.hidden&&event.key==="ArrowLeft")$(".lightbox-prev").click();});

  $("#year").textContent=new Date().getFullYear();
});
