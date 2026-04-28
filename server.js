const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "kunder.json");

app.use(express.json());
app.use(express.static(__dirname));

function lesKunder() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function lagreKunder(kunder) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(kunder, null, 2), "utf8");
}

function rensTekst(tekst) {
  if (!tekst) return "";
  return String(tekst).replace(/[<>]/g, "");
}

function sendEmail(kunde) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    console.log("E-post er ikke satt opp. Kunden ble lagret.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass }
  });

  transporter.sendMail({
    from: emailUser,
    to: "kilwe501@hotmail.com",
    subject: "Ny kunde fra IT-hjelp Oslo",
    text: `Ny kunde:\n\nNavn: ${kunde.navn}\nTelefon: ${kunde.telefon}\nE-post: ${kunde.epost}\n\nBehov:\n${kunde.behov}`
  });
}

app.post("/api/leads", function(req, res) {
  const kunde = {
    navn: rensTekst(req.body.navn),
    telefon: rensTekst(req.body.telefon),
    epost: rensTekst(req.body.epost),
    behov: rensTekst(req.body.behov)
  };

  if (!kunde.navn || !kunde.telefon || !kunde.behov) {
    return res.status(400).json({ melding: "Navn, telefon og behov må fylles ut." });
  }

  const kunder = lesKunder();
  kunde.id = kunder.length + 1;
  kunde.dato = new Date().toLocaleString("no-NO");
  kunder.push(kunde);
  lagreKunder(kunder);
  sendEmail(kunde);
  res.json({ melding: "Kunde lagret." });
});

app.post("/api/login", function(req, res) {
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS || "1234";

  if (req.body.username === adminUser && req.body.password === adminPass) {
    return res.json({ token: "admin-token-ok" });
  }
  res.status(401).json({ melding: "Feil brukernavn eller passord." });
});

app.get("/api/admin/leads", function(req, res) {
  const auth = req.headers.authorization || "";
  if (auth !== "Bearer admin-token-ok") return res.status(401).json({ melding: "Ikke tilgang." });
  res.json(lesKunder().reverse());
});

app.listen(PORT, function() {
  console.log("Server kjører på http://localhost:" + PORT);
  console.log("Admin login: http://localhost:" + PORT + "/login.html");
});
