// ===== CUSTOM CURSOR =====
const cursor = document.getElementById("cursor");
const cursorLabel = document.getElementById("cursor-label");
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth cursor follow with RAF
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.transform = `translate(${cursorX - cursor.offsetWidth/2}px, ${cursorY - cursor.offsetHeight/2}px)`;
  cursorLabel.style.transform = `translate(${cursorX}px, ${cursorY + 36}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor state changes
document.querySelectorAll("a, button, select, input, textarea").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("hover-link");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover-link", "hover-btn");
  });
});

document.querySelectorAll(".mag-btn").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.remove("hover-link");
    cursor.classList.add("hover-btn");
    cursorLabel.textContent = "Click";
    cursorLabel.classList.add("visible");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover-btn");
    cursorLabel.classList.remove("visible");
  });
});

document.querySelectorAll(".img-hover-wrap").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.remove("hover-link");
    cursor.classList.add("hover-img");
    el.classList.add("focused");
    cursorLabel.textContent = "View";
    cursorLabel.classList.add("visible");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover-img");
    el.classList.remove("focused");
    cursorLabel.classList.remove("visible");
  });
});

// ===== MAGNETIC BUTTON =====
document.querySelectorAll(".mag-btn").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});

// ===== LINE REVEAL =====
document.querySelectorAll(".line-reveal").forEach(el => io.observe(el));
function listingCard(item){
  const div = document.createElement("article");
  div.className = "listing-card reveal overflow-hidden group cursor-pointer";
  div.innerHTML = `
    <div class="overflow-hidden">
      <img class="listing-img h-64 w-full object-cover" src="${item.cover}" alt="${item.title}" loading="lazy" />
    </div>
    <div class="pt-5 pb-2">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase tracking-widest text-[#1a1a1a]/50">${item.type} · ${item.status}</span>
      </div>
      <h3 class="font-garamond text-xl leading-snug mb-1">${item.title}</h3>
      <p class="text-sm text-[#1a1a1a]/60 mb-3">${item.location} · ${item.areaSqm} sqm</p>
      <p class="text-sm font-medium">${rupiah(item.price)}</p>
      <button data-id="${item.id}" class="mt-4 text-xs uppercase tracking-widest border-b border-[#1a1a1a]/30 pb-0.5 hover:border-[#1a1a1a] transition">
        Request Details →
      </button>
    </div>
  `;
  return div;
}
