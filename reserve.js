document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reserveForm");
  if (!form) return;

  const success = document.getElementById("reserve-success");
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");
  const partyEl = document.getElementById("party");
  const phoneEl = document.getElementById("phone");
  const agreeEl = document.getElementById("agree");
  const honeypot = document.getElementById("website"); // hidden spam trap

  // utils
  const q = (sel, root = document) => root.querySelector(sel);
  const all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const todayYMD = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const parseYMD = (ymd) =
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const isValidEmail = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
  const digits = (v) => v.replace(/\D/g, "");
  const isValidPhone = (v) => digits(v).length >= 10;

  function setFieldState(input, ok, overrideMsg) {
    const field = input.closest(".field");
    if (!field) return;
    field.classList.toggle("invalid", !ok);
    const err = field.querySelector(".error-text");
    if (err && overrideMsg) err.textContent = overrideMsg;
  }

  function validateDate() {
    const v = dateEl.value;
    if (!v) {
      setFieldState(dateEl, false);
      return false;
    }
    const picked = parseYMD(v);
    const min = parseYMD(dateEl.min || todayYMD());
    if (picked < min) {
      setFieldState(dateEl, false, "Date cannot be in the past.");
      return false;
    
    const now = new Date();
    const isToday =
      picked.getFullYear() === now.getFullYear() &&
      picked.getMonth() === now.getMonth() &&
      picked.getDate() === now.getDate();

    if (isToday && now.getHours() >= 18) {
      setFieldState(
        dateEl,
        false,
        "Same day bookings close at 6 pm. Please pick tomorrow or later."
      );
      return false;
    }
    setFieldState(dateEl, true);
    return true;
  }

  const validators = {
    name: (v, el) => {
      const ok = v.trim().length >= 2;
      setFieldState(el, ok);
      return ok;
    },
    email: (v, el) => {
      const ok = isValidEmail(v);
      setFieldState(el, ok);
      return ok;
    },
    phone: (v, el) => {
      const ok = isValidPhone(v);
      setFieldState(el, ok);
      return ok;
    },
    time: (v, el) => {
      const ok = v.trim().length > 0;
      setFieldState(el, ok);
      return ok;
    },
    party: (v, el) => {
      const ok = v.trim().length > 0 && v !== "13+";
      setFieldState(
        el,
        ok,
        v === "13+"
          ? "For 13 or more, please call so we can plan seating."
          : null
      );
      return ok;
    },
    agree: (_, el) => {
      const ok = el.checked;
      setFieldState(el, ok);
      return ok;
    },
  };

  function validateField(input) {
    const { name, value } = input;
    if (name === "date") return validateDate();
    const fn = validators[name];
    if (!fn) return true;
    return fn(value, input);
  }

  // min date to today if requested
  if (dateEl && dateEl.dataset.minToday === "true") {
    dateEl.min = todayYMD();
  }

  // live formatting for phone; 
  if (phoneEl) {
    phoneEl.addEventListener("input", () => {
      const raw = digits(phoneEl.value).slice(0, 10);
      const parts = [];
      if (raw.length >= 3) parts.push(raw.slice(0, 3));
      if (raw.length >= 6) parts.push(raw.slice(3, 6));
      if (raw.length > 6) parts.push(raw.slice(6));
      phoneEl.value =
        raw.length <= 3
          ? raw
          : raw.length <= 6
          ? `(${raw.slice(0, 3)}) ${raw.slice(3)}`
          : `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
      validateField(phoneEl);
    });
  }

  // validation
  all("input, select, textarea", form).forEach((el) => {
    el.addEventListener("input", () => validateField(el));
    el.addEventListener("blur", () => validateField(el));
    if (el === dateEl) {
      el.addEventListener("change", validateDate);
    }
  });

  // disable time selection
  function updateTimeAvailability() {
    if (!dateEl || !timeEl) return;
    const v = dateEl.value;
    if (!v) return;
    const picked = parseYMD(v);
    const now = new Date();
    const isToday =
      picked.getFullYear() === now.getFullYear() &&
      picked.getMonth() === now.getMonth() &&
      picked.getDate() === now.getDate();

    const cutoff = now.getHours() >= 18;
    timeEl.disabled = isToday && cutoff;
    if (timeEl.disabled) {
      setFieldState(
        timeEl,
        false,
        "Same day bookings close at 6 pm. Time selection is disabled."
      );
    } else {
      setFieldState(timeEl, true);
    }
  }
  if (dateEl) {
    updateTimeAvailability();
    dateEl.addEventListener("change", updateTimeAvailability);
  }

  // handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (honeypot && honeypot.value) return;

    // Vvalids
    const inputs = {
      name: q("#name", form),
      email: q("#email", form),
      phone: q("#phone", form),
      date: q("#date", form),
      time: q("#time", form),
      party: q("#party", form),
      agree: q("#agree", form),
    };

    const results = Object.entries(inputs).map(([key, el]) =>
      key === "date" ? validateDate() : validateField(el)
    );

    const allValid = results.every(Boolean);
    if (!allValid) {
      const firstInvalid =
        inputs.name.closest(".field").classList.contains("invalid")
          ? inputs.name
          : inputs.email.closest(".field").classList.contains("invalid")
          ? inputs.email
          : inputs.phone.closest(".field").classList.contains("invalid")
          ? inputs.phone
          : inputs.date.closest(".field").classList.contains("invalid")
          ? inputs.date
          : inputs.time.closest(".field").classList.contains("invalid")
          ? inputs.time
          : inputs.party.closest(".field").classList.contains("invalid")
          ? inputs.party
          : inputs.agree;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    try {
      form.setAttribute("aria-busy", "true");
      all("button, input, select, textarea", form).forEach((el) => (el.disabled = true));

      await new Promise((res) => setTimeout(res, 600));

      if (success) {
        success.classList.add("show");
        success.textContent = "Reservation received. We will email a confirmation shortly.";
      }

      form.reset();
      if (dateEl && dateEl.dataset.minToday === "true") {
        dateEl.min = todayYMD();
      }
      updateTimeAvailability();
      all(".field", form).forEach((f) => f.classList.remove("invalid"));
    } catch (err) {
      if (success) {
        success.classList.add("show");
        success.textContent = "Sorry, something went wrong. Please try again.";
      }
    } finally {
      form.removeAttribute("aria-busy");
      all("button, input, select, textarea", form).forEach((el) => (el.disabled = false));
      if (agreeEl) agreeEl.checked = false;
    }
  });
});

