const token = localStorage.getItem("adminToken");
const kundeListe = document.getElementById("kundeListe");
const adminMessage = document.getElementById("adminMessage");
const logoutBtn = document.getElementById("logoutBtn");

if (!token) window.location.href = "/login.html";

logoutBtn.addEventListener("click", function() {
  localStorage.removeItem("adminToken");
  window.location.href = "/login.html";
});

async function hentKunder() {
  const svar = await fetch("/api/admin/leads", {
    headers: {"Authorization": "Bearer " + token}
  });

  if (svar.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "/login.html";
    return;
  }

  const kunder = await svar.json();
  if (kunder.length === 0) {
    adminMessage.textContent = "Ingen kunder er registrert enda.";
    return;
  }

  kundeListe.innerHTML = "";
  kunder.forEach(function(kunde) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${kunde.id}</td><td>${kunde.navn}</td><td>${kunde.telefon}</td><td>${kunde.epost || ""}</td><td>${kunde.behov}</td><td>${kunde.dato}</td>`;
    kundeListe.appendChild(tr);
  });
}
hentKunder();
