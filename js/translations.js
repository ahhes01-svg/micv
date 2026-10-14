window.PORTFOLIO_TRANSLATIONS={
  es:{
    skip:"Saltar al contenido",downloadCv:"Descargar CV",scroll:"Desplazar",viewMore:"Ver más",current:"ABR 2025 — ACTUALIDAD",footer:"Diseñado y desarrollado como portafolio profesional.",
    nav:{home:"Inicio",profile:"Perfil",experience:"Experiencia",projects:"Proyectos",skills:"Habilidades",education:"Educación",certificates:"Certificaciones",contact:"Contacto"},
    technologyLabel:"Ecosistema tecnológico",
    professionalRoles:"Analista de datos · Desarrollador web · Auxiliar de TI",
    hero:{available:"Disponible inmediatamente",hello:"Hola, soy",summary:"Analista de datos, desarrollador web y auxiliar de TI. Conocimientos intermedios en Power BI y experiencia en desarrollo web institucional, soporte técnico N1/N2, atención a usuarios y mantenimiento de equipos.",spanish:"Español nativo",english:"Inglés intermedio",viewExperience:"Ver experiencia",exploreProjects:"Explorar proyectos",roles:["Analista de datos","Desarrollador web","Auxiliar de TI"]},
    profile:{label:"PERFIL PROFESIONAL",title:"Datos, web y soporte<br><span>para resolver desafíos.</span>",p1:"Analista de datos, desarrollador web y auxiliar de TI, con conocimientos intermedios en Power BI y experiencia en soporte técnico de primer y segundo nivel, mantenimiento de equipos, atención a usuarios y desarrollo web institucional. Experiencia en resolución de incidencias de hardware y software, gestión de inventarios TI y soporte presencial y remoto.",p2:"Experiencia en entornos de alta demanda, comunicación técnica, diagnóstico y resolución de problemas. Conocimientos en redes LAN/WLAN, Office 365, sistemas Windows y Linux, fundamentos de ciberseguridad e ITIL.",cards:{support:"Soporte técnico N1/N2",supportDesc:"Diagnóstico y resolución de incidencias presenciales y remotas.",web:"Desarrollo web",webDesc:"Creación, administración y mantenimiento de portales institucionales.",network:"Redes e infraestructura",networkDesc:"Conectividad LAN/WLAN, servicios y despliegue tecnológico.",maintenance:"Mantenimiento de equipos",maintenanceDesc:"Mantenimiento preventivo y correctivo de hardware y periféricos.",remote:"Atención presencial y remota",remoteDesc:"Acompañamiento claro al usuario hasta el cierre de cada caso.",assets:"Gestión de activos TI",assetsDesc:"Inventario, seguimiento, documentación y control tecnológico."}},
    stats:{experiences:"Experiencias profesionales",projects:"Proyectos web destacados",certificates:"Certificaciones y credenciales",areas:"Datos · Web · Soporte"},
    experience:{label:"TRAYECTORIA",title:"Experiencia<br><span>profesional.</span>",digitalIntro:"Captación y asesoría personalizada en servicios de telecomunicaciones, con soporte inicial para la instalación y configuración.",camaraIntro:"Soporte técnico N1/N2 y gestión integral de portales, infraestructura y activos tecnológicos institucionales.",dpsSupportIntro:"Atención técnica presencial y remota, conectividad, activos, tickets y desarrollo de una plataforma de soporte.",dpsInfraIntro:"Gestión documental y seguimiento técnico para el despliegue de infraestructura de telecomunicaciones."},
    projects:{label:"PROYECTOS",title:"Productos web<br><span>en operación.</span>"},skills:{label:"CAPACIDADES",title:"Habilidades<br><span>técnicas.</span>",soft:"HABILIDADES BLANDAS"},education:{label:"FORMACIÓN",title:"Educación<br><span>continua.</span>"},certs:{label:"CREDENCIALES",title:"Certificaciones<br><span>verificables.</span>"},contact:{label:"CONTACTO",title:"Construyamos<br><span>algo confiable.</span>",intro:"Estoy disponible para oportunidades en análisis de datos, desarrollo web y soporte TI. Escríbeme por el canal que prefieras."},
    loader:["Inicializando portafolio","Cargando experiencia","Preparando infraestructura"]
  },
  en:{
    skip:"Skip to content",downloadCv:"Download CV",scroll:"Scroll",viewMore:"View more",current:"APR 2025 — PRESENT",footer:"Designed and developed as a professional portfolio.",
    nav:{home:"Home",profile:"Profile",experience:"Experience",projects:"Projects",skills:"Skills",education:"Education",certificates:"Certificates",contact:"Contact"},
    technologyLabel:"Technology ecosystem",
    professionalRoles:"Data analyst · Web developer · IT assistant",
    hero:{available:"Available immediately",hello:"Hello, I am",summary:"Data analyst, web developer and IT assistant. Intermediate knowledge of Power BI and experience in institutional web development, N1/N2 technical support, user assistance and equipment maintenance.",spanish:"Native Spanish",english:"Intermediate English",viewExperience:"View experience",exploreProjects:"Explore projects",roles:["Data analyst","Web developer","IT assistant"]},
    profile:{label:"PROFESSIONAL PROFILE",title:"Data, web and support<br><span>to solve challenges.</span>",p1:"Data analyst, web developer and IT assistant, with intermediate knowledge of Power BI and experience in first- and second-level technical support, equipment maintenance, user assistance and institutional web development. Experience in resolving hardware and software incidents, IT inventory management and on-site and remote support.",p2:"Experienced in high-demand environments, technical communication, diagnosis, and problem solving. Knowledge of LAN/WLAN networks, Office 365, Windows and Linux systems, cybersecurity fundamentals, and ITIL.",cards:{support:"N1/N2 technical support",supportDesc:"On-site and remote incident diagnosis and resolution.",web:"Web development",webDesc:"Creation, administration, and maintenance of institutional websites.",network:"Networks and infrastructure",networkDesc:"LAN/WLAN connectivity, services, and technology deployment.",maintenance:"Equipment maintenance",maintenanceDesc:"Preventive and corrective maintenance of hardware and peripherals.",remote:"On-site and remote service",remoteDesc:"Clear user support through case resolution.",assets:"IT asset management",assetsDesc:"Technology inventory, tracking, documentation, and control."}},
    stats:{experiences:"Professional experiences",projects:"Featured web projects",certificates:"Certificates and credentials",areas:"Data · Web · Support"},
    experience:{label:"CAREER",title:"Professional<br><span>experience.</span>",digitalIntro:"Customer acquisition and personalized advice for telecommunications services, including initial installation and configuration support.",camaraIntro:"N1/N2 technical support and comprehensive management of institutional websites, infrastructure, and technology assets.",dpsSupportIntro:"On-site and remote technical support, connectivity, assets, tickets, and development of a support platform.",dpsInfraIntro:"Document management and technical follow-up for telecommunications infrastructure deployment."},
    projects:{label:"PROJECTS",title:"Web products<br><span>in operation.</span>"},skills:{label:"CAPABILITIES",title:"Technical<br><span>skills.</span>",soft:"SOFT SKILLS"},education:{label:"EDUCATION",title:"Continuous<br><span>learning.</span>"},certs:{label:"CREDENTIALS",title:"Verifiable<br><span>certificates.</span>"},contact:{label:"CONTACT",title:"Let's build something<br><span>reliable.</span>",intro:"I am available for opportunities in data analysis, web development and IT support. Contact me through your preferred channel."},
    loader:["Initializing portfolio","Loading experience","Preparing infrastructure"]
  }
};

window.getTranslation=function(path,language=window.currentLanguage||"es"){
  return path.split(".").reduce((value,key)=>value&&value[key],window.PORTFOLIO_TRANSLATIONS[language]);
};

window.applyTranslations=function(language){
  window.currentLanguage=language;
  document.documentElement.lang=language;
  document.querySelectorAll("[data-i18n]").forEach(element=>{
    const value=window.getTranslation(element.dataset.i18n,language);
    if(typeof value==="string") element.innerHTML=value;
  });
  const toggle=document.getElementById("language-toggle");
  if(toggle) toggle.querySelector("span").textContent=language==="es"?"EN":"ES";
  localStorage.setItem("portfolio-language",language);
  document.dispatchEvent(new CustomEvent("languagechange",{detail:{language}}));
};

