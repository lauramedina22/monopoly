const API_BASE = "http://127.0.0.1:5000";

let players = JSON.parse(localStorage.getItem("players")) || [];

// === Mostrar mensaje en la página ===
function mostrarMensaje(texto, tipo = "success", tiempo = 3000) {
  const statusDiv = document.getElementById("statusMessage");

  statusDiv.innerHTML = `
    <div class="alert alert-${tipo} text-center fw-bold" role="alert">
      ${texto}
    </div>
  `;
  // Ocultar automáticamente después de "tiempo" milisegundos
  setTimeout(() => {
    statusDiv.innerHTML = "";
  }, tiempo);
}

// === Calcular patrimonio final ===
function calcularPatrimonio(player) {
  let patrimonio = player.cash || 0;

  if (player.properties && player.properties.length > 0) {
    player.properties.forEach((prop) => {
      patrimonio += prop.price || 0;
    });
  }

  if (player.mortgages && player.mortgages.length > 0) {
    player.mortgages.forEach((mort) => {
      patrimonio -= mort.amount || 0;
    });
  }

  return patrimonio;
}

// === Enviar resultados ===
async function enviarResultados() {
  if (players.length === 0) {
    mostrarMensaje(
      "No hay jugadores registrados para finalizar el juego.",
      "warning"
    );
    return;
  }

  try {
    for (const player of players) {
      const payload = {
        nick_name: player.nickname,
        score: calcularPatrimonio(player),
        country_code: player.countryCode,
      };

      const res = await fetch(`${API_BASE}/score-recorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al registrar al jugador " + player.nickname);
      }

      const data = await res.json();
      console.log("Jugador registrado:", data);
    }

    mostrarMensaje(
      "✅ Resultados enviados correctamente. El juego ha finalizado.",
      "success"
    );

    localStorage.removeItem("players");
    players = [];

    cargarRanking();
  } catch (err) {
    console.error("Error al enviar resultados:", err);
    mostrarMensaje("❌ Ocurrió un error al enviar los resultados.", "danger");
  }
}

// === Cargar ranking ===
async function cargarRanking() {
  try {
    const res = await fetch(`${API_BASE}/ranking`);
    if (!res.ok) throw new Error("Error al obtener el ranking");

    const data = await res.json();
    console.log("Ranking global:", data);

    const tbody = document.querySelector("#rankingPanel tbody");
    tbody.innerHTML = "";

    data.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.nick_name}</td>
        <td>${entry.score}</td>
        <td><img src="https://flagsapi.com/${entry.country_code}/flat/24.png" alt="Bandera"></td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error cargando ranking:", err);
    const tbody = document.querySelector("#rankingPanel .table");
    tbody.innerHTML = `<tr><td colspan="3" class="text-danger">No se pudo cargar el ranking</td></tr>`;
  }
}

// === Eventos ===
document
  .getElementById("finalizarBtn")
  .addEventListener("click", enviarResultados);

// === Ranking inicial ===
cargarRanking();
