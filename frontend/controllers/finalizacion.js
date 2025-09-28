import { mostrarToast } from "../controllers/toast.js";

const API_BASE = "http://127.0.0.1:5000";

let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

const calcularPatrimonio = (jugador) => {
  console.log("Calculando patrimonio de:", jugador);
  let patrimonio = jugador.dinero;

  jugador.propiedades.forEach((prop) => {
    patrimonio += prop.precio;
    if (prop.casas) {
      patrimonio += prop.casas * 100;
    }
    if (prop.hotel) {
      patrimonio += 200;
    }
  });

  jugador.hipotecas.forEach((prop) => {
    patrimonio -= prop.precio;
    if (prop.casas) {
      patrimonio -= prop.casas * 100;
    }
    if (prop.hotel) {
      patrimonio -= 200;
    }
  });
  return patrimonio;
};

async function enviarResultados() {
  if (jugadores.length === 0) {
    mostrarToast(
      "No hay jugadores registrados para finalizar el juego.",
      "warning",
    );
    return;
  }

  try {
    for (const jugador of jugadores) {
            const score = calcularPatrimonio(jugador);
      console.log(`Patrimonio calculado para ${jugador.nombre}:`, score, jugador);
      const jugadorData = {
        nick_name: jugador.nombre,
        score: calcularPatrimonio(jugador),
        country_code: jugador.paisCodigo,
      };

      console.log("Enviando al backend:", jugadorData);

      const res = await fetch(`${API_BASE}/score-recorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jugadorData),
      });

      if (!res.ok) {
        throw new Error("Error al registrar al jugador " + jugador.nombre);
      }
    }

    mostrarToast("✅ Resultados enviados correctamente.", "success");

    cargarRanking();
  } catch (err) {
    console.error(err);
    mostrarToast("❌ Ocurrió un error al enviar los resultados.", "danger");
  }
}

// === Cargar ranking ===
async function cargarRanking() {
  try {
    const res = await fetch(`${API_BASE}/ranking`);
    if (!res.ok) throw new Error("Error al obtener el ranking");

    const data = await res.json();
    const tbody = document.querySelector("#rankingPanel tbody");
    tbody.innerHTML = "";

    data.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.nick_name}</td>
        <td>${entry.score}</td>
        <td><img src="https://flagsapi.com/${entry.country_code.toUpperCase()}/flat/24.png" alt="Bandera"></td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    const tbody = document.querySelector("#rankingPanel .table");
    tbody.innerHTML = `<tr><td colspan="3" class="text-danger">No se pudo cargar el ranking</td></tr>`;
  }
}

enviarResultados();
cargarRanking();
