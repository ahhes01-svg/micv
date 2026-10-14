window.certificatesData=[
  {title:"Ingeniería de Software con Inteligencia Artificial",institution:"SENATI",date:"5 de mayo de 2025",category:"ai",categoryLabel:"Título profesional",image:"assets/images/certificates/titulo-senati.webp",duration:"",code:"R.D. N° RD-197534-2025",verify:""},
  {title:"Certificado de Labores como Soporte Técnico TI",institution:"Cámara de Comercio, Industria y Turismo de Ica",date:"Periodo 2022–2024",category:"support",categoryLabel:"Soporte TI",image:"assets/images/certificates/certificado-camara-ica.webp",duration:"",code:"Vista pública sanitizada",verify:""},
  {title:"Soporte Técnico para Windows 10 y Linux Debian 12",institution:"Udemy · Instructor Beny Blanco",date:"19 de noviembre de 2025",category:"support",categoryLabel:"Soporte TI",image:"assets/images/certificates/udemy-soporte-windows-linux.webp",duration:"3.5 horas",code:"UC-1a258b24-3f53-4cb8-ac93-d8fd91e59a91",verify:"https://ude.my/UC-1a258b24-3f53-4cb8-ac93-d8fd91e59a91"},
  {title:"Intel AI Fundamentals",institution:"Intel y Coursera",date:"15 de octubre de 2024",category:"ai",categoryLabel:"Inteligencia artificial",image:"assets/images/certificates/intel-ai-fundamentals.webp",duration:"",code:"HC2NEJCWS4MH",verify:"https://coursera.org/verify/specialization/HC2NEJCWS4MH"},
  {title:"Administración de sistemas y servicios de infraestructura de TI",institution:"Google y Coursera",date:"10 de octubre de 2024",category:"support",categoryLabel:"Soporte TI",image:"assets/images/certificates/google-administracion-sistemas.webp",duration:"",code:"1UD5AVB7ZJ89",verify:"https://coursera.org/verify/1UD5AVB7ZJ89"},
  {title:"IT Security: Defense Against the Digital Dark Arts",institution:"Google y Coursera",date:"8 de octubre de 2024",category:"security",categoryLabel:"Ciberseguridad",image:"assets/images/certificates/google-it-security.webp",duration:"",code:"FVCTL8W40BYB",verify:"https://coursera.org/verify/FVCTL8W40BYB"},
  {title:"Responsive Web Design",institution:"freeCodeCamp",date:"14 de julio de 2023",category:"web",categoryLabel:"Desarrollo web",image:"assets/images/certificates/freecodecamp-responsive-web-design.webp",duration:"Aprox. 300 horas",code:"fccd5ecd3a7-7f2a-44c7-84c7-73804fab443e",verify:"https://freecodecamp.org/certification/fccd5ecd3a7-7f2a-44c7-84c7-73804fab443e/responsive-web-design"},
  {title:"Power BI Intermedio-Avanzado",institution:"Netzun y San Ignacio University",date:"29 de enero de 2025",category:"data",categoryLabel:"Datos",image:"assets/images/certificates/power-bi.webp",duration:"1 hora 50 minutos",code:"5BFE7711",verify:""},
  {title:"Aplicaciones Android con Kotlin: Básico-Intermedio",institution:"Netzun y San Ignacio University",date:"19 de enero de 2025",category:"mobile",categoryLabel:"Desarrollo móvil",image:"assets/images/certificates/kotlin.webp",duration:"4 horas 8 minutos",code:"8EBC464E",verify:""},
  {title:"Software Malicioso: tipos y prevención",institution:"Netzun y San Ignacio University",date:"25 de enero de 2025",category:"security",categoryLabel:"Ciberseguridad",image:"assets/images/certificates/software-malicioso.webp",duration:"1 hora 22 minutos",code:"702BF41D",verify:""},
  {title:"Machine Learning aplicado a Python y Data Science",institution:"Udemy",date:"8 de octubre de 2024",category:"ai",categoryLabel:"Inteligencia artificial",image:"assets/images/certificates/machine-learning.webp",duration:"2.5 horas",code:"UC-ee961390-d2e3-47be-83e6-bacf865ae87a",verify:"https://ude.my/UC-ee961390-d2e3-47be-83e6-bacf865ae87a"}
];

window.initCertificates=function(){
  const wrapper=document.getElementById("certificate-list");
  if(!wrapper)return;
  const statusFor=cert=>{
    if(cert.code.toLowerCase().includes("sanitizada"))return "Vista pública sanitizada";
    if(cert.verify)return "Verificable";
    if(cert.categoryLabel.toLowerCase().includes("título"))return "Documento académico";
    return "Código disponible";
  };
  const render=filter=>{
    wrapper.innerHTML="";
    window.certificatesData.forEach((cert,index)=>{
      if(filter!=="all"&&cert.category!==filter)return;
      const card=document.createElement("article");
      card.className="certificate-card";
      card.dataset.category=cert.category;
      card.innerHTML=`<button class="certificate-preview certificate-open" type="button" data-cert-index="${index}" aria-label="Ver certificado completo: ${cert.title}"><img src="${cert.image}" width="900" height="635" loading="lazy" decoding="async" alt="Vista previa del certificado: ${cert.title}"><span class="certificate-preview-overlay"><i data-lucide="maximize-2"></i> Ver certificado</span></button><div class="certificate-content"><p class="certificate-category">${cert.categoryLabel}</p><h3>${cert.title}</h3><p class="certificate-institution">${cert.institution}</p><p class="certificate-date">${cert.date}${cert.duration?` · ${cert.duration}`:""}</p><div class="certificate-status"><i data-lucide="badge-check"></i><span>${statusFor(cert)}</span></div><p class="certificate-code" title="${cert.code}">${cert.code}</p><div class="certificate-actions"><button class="certificate-view certificate-open" type="button" data-cert-index="${index}"><i data-lucide="maximize-2"></i> Ver certificado</button>${cert.verify?`<a class="certificate-verify" href="${cert.verify}" target="_blank" rel="noopener noreferrer">Verificar <i data-lucide="external-link"></i></a>`:`<span class="certificate-verify is-disabled" aria-disabled="true" title="Sin enlace público de verificación">Sin enlace público</span>`}</div></div>`;
      wrapper.appendChild(card);
    });
    if(window.lucide)lucide.createIcons();
  };
  render("all");
  document.querySelectorAll(".filter-btn").forEach(button=>button.addEventListener("click",()=>{
    document.querySelectorAll(".filter-btn").forEach(item=>{item.classList.remove("active");item.setAttribute("aria-pressed","false");});
    button.classList.add("active");button.setAttribute("aria-pressed","true");render(button.dataset.filter);
  }));
  document.querySelector(".filter-btn.active")?.setAttribute("aria-pressed","true");
};
