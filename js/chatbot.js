document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const panel = $('chat-panel'), toggle = $('chat-toggle'), input = $('chat-input');
  const log = $('chat-messages'), status = $('chat-status'), suggestions = $('chat-suggestions');
  const copy = {
    es: { title: 'Asistente de Zahir', subtitle: 'Conoce mi perfil profesional', toggle: 'Pregúntame sobre mi CV', placeholder: 'Pregunta sobre mi experiencia…', close: 'Cerrar chat', send: 'Enviar pregunta', label: 'Tu pregunta sobre Zahir', log: 'Conversación', reset: 'Nuevo chat', notice: 'Asistente con IA', welcome: '¡Hola! Soy el asistente virtual de Zahir. Puedo contarte sobre su experiencia, proyectos, habilidades y formación. ¿Qué te gustaría conocer?', chips: ['Experiencia TI', 'Proyectos web', 'Formación', 'Contacto'], questions: ['¿Qué experiencia tiene Zahir en soporte TI?', '¿Qué proyectos web ha desarrollado?', '¿Cuál es su formación y qué certificaciones tiene?', '¿Cómo puedo contactar a Zahir?'], waiting: 'Consultando el CV…', offline: 'El portafolio está disponible sin conexión, pero el asistente necesita internet. Reconéctate y vuelve a intentar.', error: 'No pude responder en este momento. Intenta nuevamente o escribe a andres_prog1@outlook.com.', file: 'Abre el sitio desde su servidor para usar el asistente. Puedes contactar a Zahir en andres_prog1@outlook.com.' },
    en: { title: 'Zahir’s assistant', subtitle: 'Explore my professional profile', toggle: 'Ask about my résumé', placeholder: 'Ask about my experience…', close: 'Close chat', send: 'Send question', label: 'Your question about Zahir', log: 'Conversation', reset: 'New chat', notice: 'AI assistant', welcome: 'Hi! I’m Zahir’s virtual assistant. I can tell you about his experience, projects, skills and education. What would you like to know?', chips: ['IT experience', 'Web projects', 'Education', 'Contact'], questions: ['What IT support experience does Zahir have?', 'What web projects has he developed?', 'What is his education and what certifications does he have?', 'How can I contact Zahir?'], waiting: 'Checking the résumé…', offline: 'The portfolio is available offline, but the assistant needs an internet connection. Reconnect and try again.', error: 'I couldn’t answer right now. Try again or email andres_prog1@outlook.com.', file: 'Open the site through its server to use the assistant. You can contact Zahir at andres_prog1@outlook.com.' }
  };
  let history = [], busy = false, controller;
  const texts = () => copy[window.currentLanguage === 'en' ? 'en' : 'es'];
  const addMessage = (text, role) => {
    const message = document.createElement('p');
    message.className = `cv-chat__message${role === 'user' ? ' cv-chat__message--user' : ''}`;
    // Construir nodos de texto, nunca interpretar HTML devuelto por el modelo.
    const links = /(https:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,})/g;
    let start = 0;
    for (const match of text.matchAll(links)) {
      message.append(document.createTextNode(text.slice(start, match.index)));
      const value = match[0].replace(/[.,;)]+$/, '');
      const link = document.createElement('a');
      link.textContent = value; link.href = value.startsWith('https://') ? value : `mailto:${value}`;
      if (value.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      message.append(link, document.createTextNode(match[0].slice(value.length)));
      start = match.index + match[0].length;
    }
    message.append(document.createTextNode(text.slice(start))); log.append(message); log.scrollTop = log.scrollHeight;
  };
  const setBusy = value => {
    busy = value; $('chat-send').disabled = value; $('chat-reset').disabled = value;
    suggestions.querySelectorAll('button').forEach(button => button.disabled = value);
    log.setAttribute('aria-busy', String(value)); status.textContent = value ? texts().waiting : '';
  };
  const setOpen = open => {
    panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus(); else toggle.focus();
  };
  const translate = () => {
    const t = texts();
    $('chat-title').textContent = t.title; $('chat-subtitle').textContent = t.subtitle;
    $('chat-toggle-label').textContent = t.toggle; input.placeholder = t.placeholder;
    toggle.setAttribute('aria-label',t.toggle);
    $('chat-close').setAttribute('aria-label', t.close); $('chat-send').setAttribute('aria-label', t.send);
    document.querySelector('label[for="chat-input"]').textContent = t.label; log.setAttribute('aria-label', t.log);
    $('chat-reset').textContent = t.reset; $('chat-notice').textContent = t.notice;
    suggestions.replaceChildren();
    t.chips.forEach((label, i) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.disabled = busy; button.addEventListener('click', () => { input.value = texts().questions[i]; $('chat-form').requestSubmit(); }); suggestions.append(button); });
    if (!history.length && !busy) { log.replaceChildren(); addMessage(t.welcome, 'model'); }
    if (busy) status.textContent = t.waiting;
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  $('chat-close').addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); } });
  $('chat-reset').addEventListener('click', () => { controller?.abort(); history = []; log.replaceChildren(); status.textContent = ''; input.value = ''; translate(); input.focus(); });
  $('chat-form').addEventListener('submit', async event => {
    event.preventDefault(); const text = input.value.trim();
    if (busy || !text) return;
    addMessage(text, 'user'); input.value = ''; setBusy(true);
    const messages = [...history.slice(-10), { role: 'user', text }];
    controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 30000);
    try {
      if (location.protocol === 'file:') throw new Error(texts().file);
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }), signal: controller.signal });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.answer) throw new Error(window.currentLanguage === 'en' ? texts().error : data?.error || texts().error);
      addMessage(data.answer, 'model'); history = [...messages, { role: 'model', text: data.answer }];
    } catch (error) { addMessage(!navigator.onLine ? texts().offline : error.name === 'AbortError' ? texts().error : error.message || texts().error, 'model'); input.value = text; }
    finally { clearTimeout(timer); setBusy(false); if (!panel.hidden) input.focus(); }
  });
  document.addEventListener('languagechange', translate); translate();
});
