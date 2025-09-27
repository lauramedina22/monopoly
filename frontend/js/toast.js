function mostrarToast(mensaje) {
  // Crear contenedor de toasts si no existe
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Crear el toast
  const toastEl = document.createElement("div");
  toastEl.className = "toast bg-primary text-white show";
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");
  toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${mensaje}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
  toastContainer.appendChild(toastEl);

  // Cerrar el toast al hacer click en el botón
  toastEl.querySelector(".btn-close").onclick = () => {
    toastEl.classList.remove("show");
    setTimeout(() => toastEl.remove(), 300);
  };

  // Ocultar automáticamente después de 5 segundos
  setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => toastEl.remove(), 300);
  }, 5000);
}
export { mostrarToast };
