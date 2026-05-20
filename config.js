require('dotenv').config();
const { RouterOSAPI } = require("node-routeros");

const config = {
  host: process.env.MIKROTIK_HOST,
  user: process.env.MIKROTIK_USER,
  password: process.env.MIKROTIK_PASS,
  port: parseInt(process.env.MIKROTIK_PORT)
};

async function connect() {
  const conn = new RouterOSAPI(config);
  await conn.connect();
  console.log("🔌 Connecté au MikroTik");
  return conn;
}

async function createHotspotUser(profile, duration) {
  const username = "RST" + Math.floor(10000 + Math.random() * 90000);
  const password = username;

  console.log("Création ticket :", username);
  const conn = await connect();

  try {
    await conn.write("/ip/hotspot/user/add", [
      `=name=${username}`,
      `=password=${password}`,
      `=profile=${profile}`,
      `=limit-uptime=${duration}`
      
       `=shared-users=1`

    ]);
    console.log("✅ Ticket créé :", username);
    return username;

  } catch (err) {
    console.error("❌ ERREUR MIKROTIK", err);
    throw new Error("Erreur création ticket MikroTik");

  } finally {
    conn.close();
    console.log("🔌 Connexion fermée");
  }
}

module.exports = { config, createHotspotUser };