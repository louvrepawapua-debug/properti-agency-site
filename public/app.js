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
