const API_BASE = "http://127.0.0.1:5000";

// 1. Simular jugadores desde localStorage
let players = JSON.parse(localStorage.getItem("players")) || [];

// 2. Calcular patrimonio final
function calcularPatrimonio(player) {
  // Por ahora simplificado: solo dinero
  // Aquí luego podrías sumar propiedades y restar hipotecas
  return player.cash;
}

// 3. Enviar al backend
async function enviarResultados() {
  for (const player of players) {
    const payload = {
      nick_name: player.nickname,
      score: calcularPatrimonio(player),
      country_code: player.countryCode
    };

    await fetch(`${API_BASE}/score-recorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => console.log("Jugador registrado:", data))
      .catch(err => console.error("Error:", err));
  }

  // Luego de enviar, refrescamos el ranking
  cargarRanking();
}

// 4. Cargar ranking global
async function cargarRanking() {
  const res = await fetch(`${API_BASE}/ranking`);
  const data = await res.json();

  const tbody = document.querySelector("#rankingPanel tbody");
  tbody.innerHTML = "";

  data.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.nick_name}</td>
      <td>${entry.score}</td>
      <td><img src="https://flagsapi.com/${entry.country_code}/flat/24.png"></td>
    `;
    tbody.appendChild(row);
  });
}

// 5. Eventos
document.getElementById("btnEndGame").addEventListener("click", enviarResultados);

// Al abrir la página, cargamos ranking inicial
cargarRanking();
