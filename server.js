const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const listings = [
  { id: "sw-001", title: "Creative Office Tower — CBD", location: "Jakarta Pusat", price: 27500000000, type: "Office", status: "For Sale", areaSqm: 820, cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80" },
  { id: "sw-002", title: "Modern Residence — Private Cluster", location: "BSD, Tangerang", price: 6900000000, type: "Residential", status: "For Sale", areaSqm: 210, cover: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80" },
  { id: "sw-003", title: "Mixed-Use Shophouse — Main Road", location: "Kemang, Jakarta Selatan", price: 12500000000, type: "Mixed-Use", status: "For Lease", areaSqm: 360, cover: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1600&q=80" }
];

app.get("/api/listings", (req, res) => {
  const { q, type, status } = req.query;
  const filtered = listings.filter(item => {
    const okQ = !q ? true : `${item.title} ${item.location}`.toLowerCase().includes(String(q).toLowerCase());
    const okType = !type ? true : item.type.toLowerCase() === String(type).toLowerCase();
    const okStatus = !status ? true : item.status.toLowerCase() === String(status).toLowerCase();
    return okQ && okType && okStatus;
  });
  res.json({ ok: true, total: filtered.length, data: filtered });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || String(name).trim().length < 2) return res.status(400).json({ ok: false, error: "Name minimal 2 karakter." });
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
  if (!emailOk) return res.status(400).json({ ok: false, error: "Email tidak valid." });
  const phoneOk = /^[0-9+\-\s()]{8,}$/.test(String(phone || ""));
  if (!phoneOk) return res.status(400).json({ ok: false, error: "Phone minimal 8 karakter." });
  if (!message || String(message).trim().length < 10) return res.status(400).json({ ok: false, error: "Message minimal 10 karakter." });
  return res.json({ ok: true, message: "Terkirim. Tim kami akan menghubungi Anda." });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
