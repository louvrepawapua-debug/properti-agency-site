const $ = (q) => document.querySelector(q);

const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
const navShell = $("#navShell");
const scrollProgress = $("#scrollProgress");
const themeBtn = $("#themeBtn");

const qInput = $("#qInput");
const typeSelect = $("#typeSelect");
const statusSelect = $("#statusSelect");
const listingsGrid = $("#listingsGrid");
const listingsMeta = $("#listingsMeta");
const listingsEmpty = $("#listingsEmpty");

// Contact form
const form = $("#contactForm");
const submitBtn = $("#submitBtn");
const formStatus = $("#formStatus");

const nameEl = $("#name");
const emailEl = $("#email");
const phoneEl = $("#phone");
const messageEl = $("#message");
const msgCounter = $("#msgCounter");

const errName = $("#errName");
const errEmail = $("#errEmail");
const errPhone = $("#errPhone");
const errMessage = $("#errMessage");

// ---------- DOM manipulation: mobile menu ----------
menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu on link click
mobileMenu?.addEventListener("click", (e) => {
  if (e.target?.tagName === "A") mobileMenu.classList.add("hidden");
});

// ---------- DOM manipulation: navbar on scroll ----------
window.addEventListener("scroll", () => {
  const y = window.scrollY || 0;
  navShell.style.transform = y > 10 ? "translateY(-2px)" : "translateY(0)";
  navShell.style.transition = "transform .25s ease";

  const h = document.documentElement.scrollHeight - window.innerHeight;
  const p = h > 0 ? Math.min(1, y / h) : 0;
  scrollProgress.style.width = `${p * 100}%`;
});

// ---------- Theme accent toggle (DOM + CSS var) ----------
let accentMode = 0;
themeBtn?.addEventListener("click", () => {
  accentMode = (accentMode + 1) % 3;
  const root = document.documentElement;

  if (accentMode === 0) root.style.setProperty("--accent", "255,255,255");
  if (accentMode === 1) root.style.setProperty("--accent", "164,255,214"); // minty
  if (accentMode === 2) root.style.setProperty("--accent", "255,214,164"); // warm
});

// ---------- Animation: reveal on scroll (IntersectionObserver) ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- Fetch API: load listings ----------
function rupiah(n){
  try{
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  }catch{
    return `Rp ${n}`;
  }
}

function listingCard(item){
  const div = document.createElement("article");
  div.className = "reveal rounded-3xl border border-white/10 overflow-hidden hover:border-white/25 transition";
  div.innerHTML = `
    <div class="relative">
      <img class="h-44 w-full object-cover opacity-90" src="${item.cover}" alt="${item.title}" loading="lazy" />
      <div class="absolute top-3 left-3 flex gap-2">
        <span class="text-[11px] rounded-full bg-black/55 border border-white/15 px-3 py-1">${item.type}</span>
        <span class="text-[11px] rounded-full bg-white text-black px-3 py-1">${item.status}</span>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-lg font-light">${item.title}</h3>
      <p class="mt-2 text-sm text-white/70">${item.location} • ${item.areaSqm} sqm</p>
      <p class="mt-4 text-sm text-white/90">${rupiah(item.price)}</p>
      <button data-id="${item.id}" class="mt-5 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:border-white/30 transition">
        Quick view
      </button>
    </div>
  `;
  return div;
}

async function loadListings(){
  listingsMeta.textContent = "Loading listings…";
  listingsEmpty.classList.add("hidden");
  listingsGrid.innerHTML = "";

  const params = new URLSearchParams();
  if (qInput.value.trim()) params.set("q", qInput.value.trim());
  if (typeSelect.value) params.set("type", typeSelect.value);
  if (statusSelect.value) params.set("status", statusSelect.value);

  const res = await fetch(`/api/listings?${params.toString()}`);
  const json = await res.json();

  if (!json.ok) {
    listingsMeta.textContent = "Gagal memuat data.";
    return;
  }

  listingsMeta.textContent = `${json.total} listing ditemukan.`;

  if (json.total === 0){
    listingsEmpty.classList.remove("hidden");
    return;
  }

  const frag = document.createDocumentFragment();
  json.data.forEach((item) => frag.appendChild(listingCard(item)));
  listingsGrid.appendChild(frag);

  // re-observe newly added cards for reveal animation
  listingsGrid.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

[qInput, typeSelect, statusSelect].forEach((el) => {
  el?.addEventListener("input", debounce(loadListings, 250));
  el?.addEventListener("change", loadListings);
});

function debounce(fn, wait){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Quick view (DOM manipulation)
listingsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  formStatus.textContent = `Saya tertarik listing ${id}. (Contoh: bisa buka modal detail di sini.)`;
  formStatus.className = "text-sm text-white/80";
  window.location.hash = "#contact";
});

// ---------- Real-time validation ----------
const validators = {
  name: (v) => (v.trim().length >= 2) ? "" : "Name minimal 2 karakter.",
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) ? "" : "Email tidak valid.",
  phone: (v) => (/^[0-9+\-\s()]{8,}$/.test(v.trim())) ? "" : "Phone minimal 8 karakter.",
  message: (v) => (v.trim().length >= 10) ? "" : "Message minimal 10 karakter."
};

function setError(elErr, msg){
  if (!msg){
    elErr.textContent = "";
    elErr.classList.add("hidden");
  }else{
    elErr.textContent = msg;
    elErr.classList.remove("hidden");
  }
}

function updateSubmitState(){
  const ok =
    !validators.name(nameEl.value) &&
    !validators.email(emailEl.value) &&
    !validators.phone(phoneEl.value) &&
    !validators.message(messageEl.value);
  submitBtn.disabled = !ok;
}

function bindValidation(inputEl, errEl, fn){
  const run = () => {
    const msg = fn(inputEl.value);
    setError(errEl, msg);

    // DOM manipulation: highlight invalid fields
    inputEl.classList.toggle("border-red-300/60", Boolean(msg));
    inputEl.classList.toggle("border-white/10", !msg);

    updateSubmitState();
  };
  inputEl.addEventListener("input", run);
  inputEl.addEventListener("blur", run);
  run();
}

bindValidation(nameEl, errName, validators.name);
bindValidation(emailEl, errEmail, validators.email);
bindValidation(phoneEl, errPhone, validators.phone);
bindValidation(messageEl, errMessage, validators.message);

messageEl.addEventListener("input", () => {
  const len = messageEl.value.length;
  msgCounter.textContent = `${len} / 500`;
  if (len > 500) {
    msgCounter.classList.add("text-red-300");
    messageEl.value = messageEl.value.slice(0, 500);
  } else {
    msgCounter.classList.remove("text-red-300");
  }
});

// ---------- AJAX submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formStatus.textContent = "Sending…";
  formStatus.className = "text-sm text-white/70";

  const payload = {
    name: nameEl.value.trim(),
    email: emailEl.value.trim(),
    phone: phoneEl.value.trim(),
    message: messageEl.value.trim()
  };

  try{
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (!res.ok || !json.ok){
      formStatus.textContent = json?.error || "Gagal mengirim.";
      formStatus.className = "text-sm text-red-300";
      return;
    }

    formStatus.textContent = json.message;
    formStatus.className = "text-sm text-emerald-200";

    form.reset();
    msgCounter.textContent = "0 / 500";
    updateSubmitState();
  }catch{
    formStatus.textContent = "Network error. Coba lagi.";
    formStatus.className = "text-sm text-red-300";
  }
});

// initial load
loadListings();
