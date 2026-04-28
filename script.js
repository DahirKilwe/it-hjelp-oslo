const form = document.getElementById("leadForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const kunde = {
    navn: document.getElementById("navn").value,
    telefon: document.getElementById("telefon").value,
    epost: document.getElementById("epost").value,
    behov: document.getElementById("behov").value
  };

  message.textContent = "Sender...";

  const svar = await fetch("/api/leads", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(kunde)
  });

  const data = await svar.json();

  if (svar.ok) {
    message.textContent = "Takk! Forespørselen er sendt.";
    message.style.color = "#0d8a4b";
    form.reset();
  } else {
    message.textContent = data.melding || "Noe gikk feil.";
    message.style.color = "#c62828";
  }
});
