/* =========================
   Contact JS • MAKO
   File: js/contact.js
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const success = document.getElementById("success-msg");

  // Helpers
  const q = (sel, root = document) => root.querySelector(sel);
  const all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^\S+@\S+\.\S+$/.test(v.trim()),
    message: (v) => v.trim().length > 0,
    subject: (_) => true
  };

  function setFieldState(input, ok) {
    const field = input.closest(".field");
    if (!field) return;
    field.classList.toggle("invalid", !ok);
  }

  function validateField(input) {
    const fn = validators[input.name] || (() => true);
    const valid = fn(input.value);
    setFieldState(input, valid);
    return valid;
  }

  // Live validation on input and blur
  all("input, textarea", form).forEach((el) => {
    el.addEventListener("input", () => validateField(el));
    el.addEventListener("blur", () => validateField(el));
  });

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = {
      name: q("#name", form),
      email: q("#email", form),
      subject: q("#subject", form),
      message: q("#message", form)
    };

    // Validate all
    const results = Object.values(inputs).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      // Focus first invalid field
      const firstInvalid = Object.values(inputs).find((i) => !validateField(i));
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate async submission
    try {
      // Replace this block with your real endpoint if needed
      await new Promise((res) => setTimeout(res, 500));

      // Success UI
      if (success) {
        success.classList.add("show");
        success.textContent = "Message sent successfully. We will get back to you soon.";
      }

      form.reset();
      // Clear error states after reset
      all(".field", form).forEach((f) => f.classList.remove("invalid"));
    } catch (err) {
      // Fallback error notice
      if (success) {
        success.classList.add("show");
        success.textContent = "Sorry, something went wrong. Please try again.";
      }
    }
  });
});
