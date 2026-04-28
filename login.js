const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(e) {
  e.preventDefault();

  const svar = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  });

  const data = await svar.json();

  if (svar.ok) {
    localStorage.setItem("adminToken", data.token);
    window.location.href = "/admin.html";
  } else {
    loginMessage.textContent = data.melding || "Feil login.";
  }
});
