# Portafolio profesional de Zahir Huamán

Sitio construido con HTML5, CSS3 y JavaScript puro. Incluye animaciones GSAP, Typed.js, Swiper, iconos Lucide, tema claro/oscuro, español/inglés, galería de certificados, SEO, contacto por WhatsApp/correo y chatbot Gemini con backend.

## Chatbot del CV con Gemini

## Foto, tecnologías y habilidades

La foto principal es `assets/images/profile/zahir-profile-mirada-natural.png`: conserva el encuadre y la expresión amable y ajusta los ojos hacia la cámara. Se conservan las versiones anteriores. Los logos se sirven localmente desde `assets/images/technologies`; las fuentes están en `sources.json`. Se presentan como ecosistema tecnológico, sin asignar nuevos niveles de competencia a React, TypeScript o herramientas de IA. Las habilidades conservan sus niveles documentados en cinco categorías desplegables. Estilos: `css/refinements.css`.

Los proyectos conservan sus casos (necesidad, aporte y entregable) en `js/project-cases.js`. El laboratorio y el comparador de vacantes se retiraron de la página.

## Configuración del chatbot

El botón flotante abre un asistente que responde sobre experiencia, formación, habilidades, proyectos y contacto. El contexto profesional está en `server/cv-context.mjs`, basado en los datos públicos del portafolio. Actualícelo cuando cambie el CV. No añadir datos privados. Las consultas y el historial reciente se envían a Google; la conversación se mantiene solo en memoria del navegador y se borra al recargar o pulsar **Nuevo chat**.

### Activar localmente

Requiere Node.js 22 o superior. No necesita instalar paquetes.

1. Obtenga una clave en [Google AI Studio](https://aistudio.google.com/apikey).
2. Dentro de `cv-zahir`, copie `.env.example` a `.env`.
3. Complete `GEMINI_API_KEY` en `.env`. `GEMINI_MODEL` permite cambiar el modelo; el predeterminado es `gemini-3.5-flash-lite`.
4. Ejecute `npm start` y abra `http://localhost:8080`.

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

La clave queda en el servidor y nunca se entrega al navegador. `.env` está excluido de Git. Sin clave, el chat informa que todavía no está disponible y ofrece el correo de Zahir. No pegue la clave en este chat, HTML o JavaScript público.

### Publicar con el chatbot en Netlify

Conecte el repositorio y seleccione `cv-zahir` como directorio base si el repositorio contiene la carpeta superior. `netlify.toml` configura el build (`npm run build`), la carpeta pública (`dist`) y la función `/api/chat`. Cree `GEMINI_API_KEY` y opcionalmente `GEMINI_MODEL` en las variables de entorno de Netlify con alcance **Functions**, y vuelva a desplegar. La función tiene límite de 12 solicitudes por minuto por visitante. Configure las cuotas de Gemini en su propia cuenta.

El build copia solo archivos públicos: no incluye `.env`, código del servidor ni pruebas. Use despliegue desde repositorio/CLI con funciones; arrastrar únicamente `dist` publica la página pero no el backend.

GitHub Pages y `python -m http.server` sirven únicamente los archivos estáticos; el chatbot requiere el servidor Node o la función de Netlify. Para un servidor Node detrás de un proxy HTTPS, configure `PUBLIC_ORIGIN` con el dominio público y adapte la interfaz de escucha del servidor a su alojamiento.

### Verificar

```powershell
npm test
npm run build
```

Las pruebas usan respuestas simuladas para verificar contexto, historial, validaciones y errores sin gastar cuota. Para validar una respuesta real, configure su clave y consulte el chat. Documentación: [API Gemini](https://ai.google.dev/api/generate-content), [modelos](https://ai.google.dev/gemini-api/docs/models), [funciones Netlify](https://docs.netlify.com/build/functions/api/).

## 1. Abrir el proyecto

La forma más rápida es abrir `index.html` con un navegador moderno. Para probar rutas y comportamiento HTTP, puede usarse un servidor local:

```powershell
python -m http.server 8080
```

Después, visitar `http://localhost:8080/cv-zahir/` si el servidor se inicia desde la carpeta superior, o `http://localhost:8080/` si se inicia dentro de `cv-zahir`.

## 2. Modificar los datos

- Contenido principal: `index.html`.
- Traducciones principales: `js/translations.js`.
- Certificaciones y enlaces de verificación: `js/certificates.js`.
- Datos del modal de proyectos: objeto `projectData` en `js/main.js`.
- Estilos: `css/styles.css`, `css/responsive.css` y `css/animations.css`.

No publique DNI, teléfonos de validación laboral, firmas u otros datos privados.

## 3. Reemplazar imágenes

Reemplace los archivos dentro de:

- `assets/images/profile/`
- `assets/images/projects/`
- `assets/images/certificates/`

Mantenga los mismos nombres o actualice sus rutas en HTML/JavaScript. Se recomienda WebP, relación 16:9 para proyectos y un ancho máximo aproximado de 1600 px para certificados.

## 4. Contacto operativo

El menú Contacto dirige a `#contacto` y cierra la navegación móvil. El formulario valida nombre, correo, asunto y mensaje y permite seleccionar WhatsApp o correo electrónico.

WhatsApp abre el número público `+51 963 488 520` con los datos del visitante y su mensaje preparados. Correo abre la aplicación de correo hacia `andres_prog1@outlook.com`. El visitante revisa y pulsa Enviar en el canal elegido. La página no afirma que el mensaje se haya entregado ni vacía los campos; conserva un enlace para abrir el mensaje y un botón para copiarlo si la aplicación o ventana no se abre. No requiere clave ni cuenta adicional de formularios.

Lógica y textos español/inglés: `js/contact.js`. Para enviar correos directamente desde la página, se debe conectar un servicio de formularios o un backend de correo con credenciales. Actualmente no se realizan envíos automáticos de correo.

## 5. Publicar en GitHub Pages

1. Cree un repositorio y suba el contenido de `cv-zahir`.
2. En **Settings > Pages**, seleccione **Deploy from a branch**.
3. Seleccione `main` y `/ (root)`.
4. Ajuste `canonical`, `og:url`, `robots.txt` y `sitemap.xml` si la URL final difiere de `https://zahirhuaman.github.io/cv-zahir/`.

## 6. Publicar en Netlify

Arrastre la carpeta `cv-zahir` al panel **Deploys** de Netlify o conecte el repositorio. No requiere comando de build y el directorio publicado es la raíz del proyecto.

## 7. Publicar en cPanel

Comprima el contenido de `cv-zahir`, súbalo a `public_html` con el Administrador de archivos y extráigalo. Verifique que `index.html` quede directamente dentro del directorio público.

## 8. Actualizar proyectos y certificados

- Proyectos: actualice la tarjeta correspondiente en `index.html`, el objeto `projectData` en `js/main.js` y su imagen WebP.
- Certificados: agregue o edite un elemento de `certificatesData` en `js/certificates.js` y coloque la imagen sanitizada en `assets/images/certificates/`.
- Si una URL no está disponible, conserve una imagen de respaldo local para evitar recursos rotos.

## Interfaz y fluidez

La pantalla de carga ya no impone una espera de 1.35 segundos. Las apariciones son más breves; el progreso de lectura y los efectos del puntero se actualizan como máximo una vez por fotograma. Se eliminó la inclinación del retrato y el barrido decorativo de la foto. El modo de movimiento reducido muestra el rol sin escritura animada.

En móvil, la presentación y las acciones aparecen antes de la foto; el acceso al chat se reduce a su icono y los campos usan texto de 16 px para evitar el zoom automático. Menú móvil y modales mantienen el foco de teclado; los enlaces del menú cerrado no reciben foco. Los acordeones actualizan las posiciones de las animaciones al abrirse.

Refinamientos visuales: `css/ux-polish.css`. Comportamiento de teclado y actualización de posiciones: `js/ux.js`.

## Librerías locales

## Precaché y carga rápida

- La foto principal tiene `preload` y prioridad alta; las imágenes se decodifican de forma asíncrona y los proyectos/certificados conservan carga diferida.
- `scripts/generate-cache.mjs` calcula huellas del contenido y añade `?v=...` a los recursos del HTML. Se ejecuta en `npm run build` y antes de `npm start`. Tras modificar CSS, JavaScript o imágenes, ejecutar el build o reiniciar con `npm start` para renovar las versiones. No editar `sw.js` a mano.
- `js/performance.js` registra el service worker después de la carga inicial, cuando el navegador está libre. Precaché: HTML, estilos, scripts, bibliotecas, foto principal, logos y archivos esenciales (39 recursos en esta versión). Requiere HTTPS o localhost.
- El HTML consulta la red primero y usa el último HTML guardado sin conexión o tras un fallo/espera de cuatro segundos. Los recursos versionados se recuperan de caché; las imágenes visitadas sin versión se actualizan en segundo plano, con un máximo de 48 entradas. Las fuentes externas conservan sus alternativas locales.
- Una publicación nueva prepara su propia caché. Si hay una versión esperando, aparece «Nueva versión disponible · Actualizar». El usuario decide cuándo recargar; no se interrumpen formularios o chats automáticamente. Al activarse se borran las versiones antiguas de este portafolio.
- `/api/`, las funciones de Netlify, peticiones POST, formularios y servicios externos quedan fuera de la caché. El chatbot necesita internet y lo indica cuando el navegador está sin conexión. La caché no guarda conversaciones ni datos del formulario.
- El servidor Node utiliza ETag/304, Brotli o gzip para recursos de texto y una caché en memoria limitada a 16 MiB. Solo usa caché HTTP de larga duración cuando la huella de la URL coincide con el archivo. HTML, service worker y archivos sin versión se revalidan. `netlify.toml` configura revalidación para archivos estáticos y `no-store` para la API.

Verificación: `npm test` incluye compresión y revalidación; `tmp/verify-precache.cjs` (en la carpeta superior) prueba precaché, navegación offline, exclusión del chatbot y actualización/limpieza de versiones con Chrome y Playwright. Referencia del enfoque: [Service Workers en MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Bibliotecas incluidas

- GSAP + ScrollTrigger
- Typed.js
- Swiper
- Lucide Icons

Las bibliotecas se sirven desde `assets/vendor`, con versiones fijas y fuentes registradas en `sources.json`. Esto evita que los controles esperen a un CDN externo. Se pueden volver a descargar con `node scripts/download-vendor.mjs`. Las fuentes tipográficas siguen usando Google Fonts con `display=swap` y alternativas locales. El chatbot necesita conexión a Gemini.
