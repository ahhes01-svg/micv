// Muestra el logo de cada empresa; si la imagen no existe, queda el monograma.
document.querySelectorAll(".company-logo img").forEach(img => {
  const box = img.parentElement;
  const ok = () => box.classList.add("has-logo");
  const fail = () => { img.remove(); box.classList.remove("has-logo"); };
  if (img.complete) (img.naturalWidth ? ok : fail)();
  else { img.addEventListener("load", ok, { once: true }); img.addEventListener("error", fail, { once: true }); }
});
