(() => {
  if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
  const base=new URL('../',document.currentScript.src);
  let refreshing=false;
  const showUpdate=registration=>{
    if(!registration.waiting||document.getElementById('site-update'))return;
    const button=document.createElement('button');button.id='site-update';button.type='button';button.className='site-update';
    const translate=()=>button.textContent=window.currentLanguage==='en'?'New version available · Update':'Nueva versión disponible · Actualizar';
    translate();document.addEventListener('languagechange',translate);document.body.append(button);
    button.addEventListener('click',()=>{if(!registration.waiting)return;refreshing=true;button.disabled=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});});
  };
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)location.reload();});
  const register=async()=>{
    try{
      const registration=await navigator.serviceWorker.register(new URL('sw.js',base),{scope:base.pathname,updateViaCache:'none'});
      showUpdate(registration);
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;if(!worker)return;
        worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate(registration);});
      });
    }catch(error){console.warn('Caché offline no disponible:',error.name);}
  };
  const schedule=()=>{if('requestIdleCallback' in window)requestIdleCallback(register,{timeout:3000});else setTimeout(register,1000);};
  if(document.readyState==='complete')schedule();else addEventListener('load',schedule,{once:true});
})();
