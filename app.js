const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdmbhWQe3BVNoywWUSVSK1Gng4M6OCaeUflRI4r6nMgZFd5ZSC6oCKzY3YYF9JTyQWWA/exec";

const form = document.getElementById("quoteForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const eventDate = document.getElementById("eventDate");
const foodPicker = document.getElementById("foodPicker");
const foodError = document.getElementById("foodError");

setupBarsCarousel();

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

  if (data.getAll("foodInterest").length === 0) {
    foodError.hidden = false;
    foodPicker.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  foodError.hidden = true;

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
    foodError.hidden = true;
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

function setupBarsCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector(".carousel-track");
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver fotografía ${index + 1}`);
    dot.addEventListener("click", () => goTo(index, true));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function visibleSlides() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 920) return 2;
    return 3;
  }

  function updateDots() {
    dots.forEach((dot, index) => dot.setAttribute("aria-current", index === current ? "true" : "false"));
  }

  function goTo(index, userAction = false) {
    const maximum = Math.max(0, slides.length - visibleSlides());
    current = index > maximum ? 0 : index < 0 ? maximum : index;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = current * (slides[0].getBoundingClientRect().width + gap);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    if (userAction) restartTimer();
  }

  function restartTimer() {
    window.clearInterval(timer);
    if (!reduceMotion) timer = window.setInterval(() => goTo(current + 1), 4500);
  }

  previousButton.addEventListener("click", () => goTo(current - 1, true));
  nextButton.addEventListener("click", () => goTo(current + 1, true));
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(current - 1, true);
    if (event.key === "ArrowRight") goTo(current + 1, true);
  });
  carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
  carousel.addEventListener("mouseleave", restartTimer);
  carousel.addEventListener("focusin", () => window.clearInterval(timer));
  carousel.addEventListener("focusout", restartTimer);
  window.addEventListener("resize", () => goTo(current));

  goTo(0);
  restartTimer();
}
