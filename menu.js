document.addEventListener("DOMContentLoaded", () => {
  const tablist = document.querySelector(".menu-cats");
  const chips = Array.from(document.querySelectorAll('.menu-cats .chip[role="tab"]'));
  const grid = document.getElementById("menuGrid");
  const items = grid ? Array.from(grid.querySelectorAll(".item")) : [];

  if (grid) {
    grid.setAttribute("aria-live", "polite");
    grid.setAttribute("aria-busy", "false");
  }

  function setActiveChip(target) {
    chips.forEach((chip) => {
      const active = chip === target;
      chip.setAttribute("aria-selected", active ? "true" : "false");
      chip.tabIndex = active ? 0 : -1;
    });
  }

  function filterGrid(cat) {
    if (!grid) return;
    grid.setAttribute("aria-busy", "true");

    items.forEach((card) => {
      const match = cat === "all" || card.dataset.cat === cat;
      card.style.display = match ? "" : "none";
      card.setAttribute("aria-hidden", match ? "false" : "true");
    });

    grid.setAttribute("aria-busy", "false");
  }

  function activate(chip, focus = false) {
    if (!chip) return;
    setActiveChip(chip);
    filterGrid(chip.dataset.cat);
    if (focus) chip.focus();
  }
  const initial = chips.find((c) => c.getAttribute("aria-selected") === "true") || chips[0];
  if (initial) {
    chips.forEach((c) => (c.tabIndex = c === initial ? 0 : -1));
    filterGrid(initial.dataset.cat);
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => activate(chip));
  });

  if (tablist) {
    tablist.addEventListener("keydown", (e) => {
      const currentIndex = chips.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (currentIndex + 1) % chips.length;
        activate(chips[next], true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (currentIndex - 1 + chips.length) % chips.length;
        activate(chips[prev], true);
      } else if (e.key === "Home") {
        e.preventDefault();
        activate(chips[0], true);
      } else if (e.key === "End") {
        e.preventDefault();
        activate(chips[chips.length - 1], true);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(document.activeElement);
      }
    });
  }
      btn.setAttribute("aria-expanded", "false");
      panel.classList.remove("open");
      panel.hidden = true;

      const toggle = () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        const next = !open;
        btn.setAttribute("aria-expanded", String(next));
        panel.classList.toggle("open", next);
        panel.hidden = !next;
      };

      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }
});

