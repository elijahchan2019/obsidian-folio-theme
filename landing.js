const header = document.querySelector("[data-header]");
const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");
const revealItems = document.querySelectorAll(".reveal");

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

copyButton?.addEventListener("click", async () => {
  const value = copyButton.getAttribute("data-copy") || "Folio";

  try {
    await navigator.clipboard.writeText(value);
    if (copyStatus) {
      copyStatus.textContent = "Copied. Search for Folio in Obsidian's theme browser.";
    }
  } catch {
    if (copyStatus) {
      copyStatus.textContent = "Theme name: Folio";
    }
  }
});
