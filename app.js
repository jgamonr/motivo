const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdmbhWQe3BVNoywWUSVSK1Gng4M6OCaeUflRI4r6nMgZFd5ZSC6oCKzY3YYF9JTyQWWA/exec";

const form = document.getElementById("quoteForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const eventDate = document.getElementById("eventDate");

document.getElementById("year").textContent = new Date().getFullYear();
eventDate.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!APPS_SCRIPT_URL.startsWith("https://script.google.com/macros/s/") || !APPS_SCRIPT_URL.endsWith("/exec")) {
    showMessage("Falta conectar el formulario con Google Apps Script. Revisa la guía incluida en el paquete.", "error");
    return;
  }

  const data = new FormData(form);
  if (data.get("website")) return;

  submitButton.disabled = true;
  submitButton.firstChild.textContent = "Enviando… ";
  formMessage.hidden = true;

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: data,
    });

    form.reset();
    eventDate.min = new Date().toISOString().split("T")[0];
    showMessage("¡Gracias! Recibimos tu solicitud. A la brevedad te contactaremos para ver los detalles de tu evento.", "success");
  } catch (error) {
    showMessage("No fue posible enviar la solicitud. Revisa tu conexión e intenta nuevamente.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.textContent = "Enviar solicitud ";
  }
});

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message field-wide ${type}`;
  formMessage.hidden = false;
}
