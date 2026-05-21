require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { createHotspotUser } = require("./config");

const app = express();

// ========================
// 🔥 MIDDLEWARES
// ========================

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use((req, res, next) => {
  console.log("➡️ REQUEST:", req.url);
  console.log("📦 BODY:", req.body);
  next();
});

// ========================
// 🔑 CONFIG
// ========================

const API_KEY = process.env.API_KEY || "1A2B3C"; // ← une seule déclaration

const tarifs = {
  "100":  { profile: "default", duration: "2m" },
  "200":  { profile: "default", duration: "4h" },
  "300":  { profile: "default", duration: "1d" },
  "500":  { profile: "default", duration: "2d" },
  "1000": { profile: "default", duration: "7d" }
};

// ========================
// 🚀 ROUTE : GENERATE TICKET
// ========================
app.post("/generate-ticket", async (req, res) => {
  console.log("🔥 HIT /generate-ticket");

  try {
    const { tarif, apiKey } = req.body;

    console.log("💰 TARIF:", tarif);

    const data = tarifs[tarif];

    if (!data) {
      return res.status(400).json({ error: "Tarif invalide" });
    }

    console.log("⚙️ CALL MIKROTIK...");

    const ticket = await createHotspotUser(data.profile, data.duration);

    console.log("🎟️ TICKET OK:", ticket);

    return res.json({
      success: true,
      ticket,
      password: ticket
    });

  } catch (err) {
    console.error("💥 FULL ERROR START");
    console.error(err);
    console.error("💥 FULL ERROR END");

    return res.status(500).json({
      error: "Erreur serveur",
      message: err.message,
      stack: err.stack
    });
  }
});

// ========================
// 🚀 ROUTE TEST MIKROTIK
// ========================


// ========================
// 🚀 START SERVER
// ========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("✅ SERVER RUNNING");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🌐 http://35.205.120.100:${PORT}`);
});