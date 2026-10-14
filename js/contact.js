document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const channel = document.getElementById('contact-channel');
  const status = document.getElementById('form-status');
  const handoff = document.getElementById('contact-handoff');
  const open = document.getElementById('contact-open');
  const copy = document.getElementById('contact-copy');
  let prepared = '';
  const translations = {
    es: { channel: '¿Cómo quieres contactarme?', name: 'Nombre', email: 'Correo', company: 'Empresa (opcional)', subject: 'Asunto', message: 'Mensaje', emailOption: 'Correo electrónico', whatsappSubmit: 'Continuar en WhatsApp', emailSubmit: 'Preparar correo', whatsappNote: 'Se abrirá WhatsApp con tu mensaje preparado. Revísalo y pulsa Enviar allí.', emailNote: 'Se abrirá tu aplicación de correo con el mensaje preparado. Revísalo y pulsa Enviar allí.', open: 'Abrir mensaje preparado', copy: 'Copiar mensaje', copied: 'Mensaje copiado. Puedes pegarlo en WhatsApp o en tu correo.', copyError: 'No se pudo copiar. Abre el mensaje preparado para continuar.', ready: 'Tu mensaje está preparado. Si el canal no se abrió, usa el enlace de abajo. Completa el envío en WhatsApp o en tu aplicación de correo.', required: 'Completa los campos obligatorios sin dejarlos en blanco.', header: 'Hola Zahir, te contacto desde tu portafolio.', emailCopy: 'Copiar correo', phoneCopy: 'Copiar teléfono' },
    en: { channel: 'How would you like to contact me?', name: 'Name', email: 'Email', company: 'Company (optional)', subject: 'Subject', message: 'Message', emailOption: 'Email', whatsappSubmit: 'Continue in WhatsApp', emailSubmit: 'Prepare email', whatsappNote: 'WhatsApp will open with your prepared message. Review it and press Send there.', emailNote: 'Your email app will open with your prepared message. Review it and press Send there.', open: 'Open prepared message', copy: 'Copy message', copied: 'Message copied. You can paste it into WhatsApp or your email.', copyError: 'Unable to copy. Open the prepared message to continue.', ready: 'Your message is ready. If the app did not open, use the link below. Complete sending in WhatsApp or your email app.', required: 'Fill in the required fields without leaving them blank.', header: 'Hi Zahir, I am contacting you through your portfolio.', emailCopy: 'Copy email', phoneCopy: 'Copy phone' }
  };
  const text = () => translations[window.currentLanguage === 'en' ? 'en' : 'es'];
  const update = () => {
    const t = text();
    for (const id of ['name', 'email', 'company', 'subject', 'message']) form.querySelector(`label[for="${id}"]`).textContent = t[id];
    form.querySelector('label[for="contact-channel"]').textContent = t.channel;
    channel.querySelector('[value="email"]').textContent = t.emailOption;
    const email = channel.value === 'email';
    document.getElementById('contact-submit-label').textContent = email ? t.emailSubmit : t.whatsappSubmit;
    document.getElementById('contact-note').textContent = email ? t.emailNote : t.whatsappNote;
    form.action = email ? 'mailto:andres_prog1@outlook.com' : 'https://wa.me/51963488520';
    open.textContent = t.open; copy.textContent = t.copy;
    document.querySelector('.copy-btn[data-copy="andres_prog1@outlook.com"] span').textContent = t.emailCopy;
    document.querySelector('.copy-btn[data-copy="+51963488520"] span').textContent = t.phoneCopy;
    handoff.hidden = true; status.textContent = ''; prepared = ''; open.removeAttribute('href');
  };
  channel.addEventListener('change', update);
  document.addEventListener('languagechange', update);
  form.addEventListener('input', event => {
    if (event.target.matches('input, textarea')) {
      event.target.setCustomValidity('');
      handoff.hidden = true; status.textContent = ''; prepared = ''; open.removeAttribute('href');
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of form.querySelectorAll('[required]')) {
      field.setCustomValidity(field.value.trim() ? '' : text().required);
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form), t = text();
    const name = data.get('name').trim(), email = data.get('email').trim();
    const company = data.get('company').trim(), subject = data.get('subject').trim(), message = data.get('message').trim();
    prepared = `${t.header}\n\n${t.name}: ${name}\n${t.email}: ${email}${company ? `\n${t.company}: ${company}` : ''}\n${t.subject}: ${subject}\n\n${message}`;
    open.href = channel.value === 'email'
      ? `mailto:andres_prog1@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(prepared)}`
      : `https://wa.me/51963488520?text=${encodeURIComponent(prepared)}`;
    handoff.hidden = false; status.textContent = t.ready;
    // Abrir desde el gesto del visitante; conservar enlace y campos como respaldo.
    open.click();
  });
  copy.addEventListener('click', async () => {
    if (!prepared) return;
    try { await navigator.clipboard.writeText(prepared); status.textContent = text().copied; }
    catch { status.textContent = text().copyError; }
  });
  update();
});
