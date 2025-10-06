// Simple accessible client-side validation for the contact form
const cForm = document.getElementById("contact-form");
if (cForm) {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("message");
  const errorsEl = document.getElementById("contact-errors");

  function clearErrors() {
    errorsEl.innerHTML = "";
    errorsEl.classList.remove("has-errors");
    cForm.querySelectorAll("[aria-invalid='true']").forEach(el => {
      el.removeAttribute("aria-invalid");
      const id = el.id + "-error";
      const node = document.getElementById(id);
      if (node) node.remove();
      const dby = (el.getAttribute("aria-describedby") || "")
        .split(" ").filter(x => x && x !== id).join(" ");
      if (dby) el.setAttribute("aria-describedby", dby);
      else el.removeAttribute("aria-describedby");
    });
  }

  function addFieldError(el, message) {
    el.setAttribute("aria-invalid", "true");
    const id = el.id + "-error";
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement("div");
      node.id = id;
      node.className = "field-error";
      node.style.marginTop = "4px";
      node.style.color = "#ffb4b4";
      el.insertAdjacentElement("afterend", node);
    }
    node.textContent = message;
    const dby = el.getAttribute("aria-describedby") || "";
    el.setAttribute("aria-describedby", dby ? dby + " " + id : id);

    errorsEl.classList.add("has-errors");
    const row = document.createElement("div");
    row.textContent = message;
    errorsEl.appendChild(row);
  }

  function validEmail(v) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  }

  cForm.addEventListener("submit", e => {
    clearErrors();
    let first = null;

    if (!nameEl.value.trim()) { addFieldError(nameEl, "Name is required"); first = first || nameEl; }
    if (!emailEl.value.trim()) { addFieldError(emailEl, "Email is required"); first = first || emailEl; }
    else if (!validEmail(emailEl.value)) { addFieldError(emailEl, "Enter a valid email"); first = first || emailEl; }
    if (!msgEl.value.trim()) { addFieldError(msgEl, "Message is required"); first = first || msgEl; }

    if (first) { e.preventDefault(); first.focus(); return; }

    // Simulate success for now
    e.preventDefault();
    alert("Thanks for your message. We will reply by email.");
    cForm.reset();
  });
}
