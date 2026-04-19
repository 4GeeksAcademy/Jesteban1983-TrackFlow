const form = document.getElementById("infoForm");

const empresa = document.getElementById("empresa");
const contacto = document.getElementById("contacto");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const web = document.getElementById("web");
const pais = document.getElementById("pais");
const producto = document.getElementById("producto");
const volumen = document.getElementById("volumen");
const comentarios = document.getElementById("comentarios");
const privacidad = document.getElementById("privacidad");

const contador = document.getElementById("contador");
const advertencia = document.getElementById("advertencia");
const exito = document.getElementById("exito");

// Contador de caracteres
comentarios.addEventListener("input", () => {
  contador.textContent = comentarios.value.length;

  if (comentarios.value.length > 500) {
    document.getElementById("err-comentarios").textContent =
      `Los comentarios no pueden exceder 500 caracteres (quedan ${comentarios.value.length - 500})`;
  } else {
    document.getElementById("err-comentarios").textContent = "";
  }
});

// Validación principal
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valido = true;

  // Reset errores
  document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

  // Nombre empresa
  if (empresa.value.trim().length < 2) {
    valido = false;
    document.getElementById("err-empresa").textContent =
      "El nombre de la empresa debe tener al menos 2 caracteres";
  }

  // Persona contacto
  if (!contacto.value.trim().includes(" ")) {
    valido = false;
    document.getElementById("err-contacto").textContent =
      "Ingresa nombre y apellido del contacto";
  }

  // Email
  if (!email.value.includes("@") || !email.value.includes(".")) {
    valido = false;
    document.getElementById("err-email").textContent =
      "Ingresa un email corporativo válido (ejemplo: nombre@empresa.com)";
  }

  // Teléfono
  if (!telefono.value.startsWith("+")) {
    valido = false;
    document.getElementById("err-telefono").textContent =
      "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)";
  }

  // Web
  if (web.value && !(web.value.startsWith("http://") || web.value.startsWith("https://"))) {
    valido = false;
    document.getElementById("err-web").textContent =
      "Si incluyes sitio web, debe ser una URL válida";
  }

  // País
  if (pais.value === "") {
    valido = false;
    document.getElementById("err-pais").textContent =
      "Selecciona el país de operación principal";
  }

  // Producto
  if (producto.value === "") {
    valido = false;
    document.getElementById("err-producto").textContent =
      "Selecciona el tipo de producto que manejas";
  }

  // Volumen
  if (volumen.value === "") {
    valido = false;
    document.getElementById("err-volumen").textContent =
      "Selecciona el volumen mensual estimado";
  }

  // Servicios
  const servicios = [...document.querySelectorAll(".servicio")].filter(s => s.checked);
  if (servicios.length === 0) {
    valido = false;
    document.getElementById("err-servicios").textContent =
      "Selecciona al menos un servicio de interés";
  }

  // 3PL
  const trespl = document.querySelector("input[name='trespl']:checked");
  if (!trespl) {
    valido = false;
    document.getElementById("err-3pl").textContent =
      "Indica si actualmente trabajas con otro proveedor logístico";
  }

  // Comentarios
  if (comentarios.value.length > 500) {
    valido = false;
  }

  // Política
  if (!privacidad.checked) {
    valido = false;
    document.getElementById("err-privacidad").textContent =
      "Debes aceptar la política de privacidad para continuar";
  }

  // Advertencia especial
  if (volumen.value === "0-100") {
    advertencia.classList.remove("hidden");
  } else {
    advertencia.classList.add("hidden");
  }

  // Si todo está OK
  if (valido) {
    exito.classList.remove("hidden");
    form.reset();
    contador.textContent = "0";
  }
});
