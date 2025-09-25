// === CONFIGURACIÓN DEL BACKEND ===
const API_BASE = "http://127.0.0.1:5000"; // ajusta si tu backend corre en otro puerto

// === ELEMENTOS DEL DOM ===
const playersPanel = document.getElementById("playersPanel");

// === ESTADO DEL JUEGO (ejemplo inicial) ===
let state = {
  countries: [],
  players: []
};

// === CLIENTE API ===
async function getCountries() {
  const res = await fetch(`${API_BASE}/countries`);
  if (!res.ok) throw new Error("Error al cargar países");
  return res.json();
}

// === CREACIÓN DE JUGADORES (simulada de un formulario) ===
function createPlayers() {
  // 🔹 En el futuro estos datos vendrán de un formulario
  state.players = [
    { nickname: "Andrés", countryCode: "CO", color: "#22c55e", cash: 1500, properties: [], mortgages: [] },
    { nickname: "Laura",  countryCode: "MX", color: "#3b82f6", cash: 1500, properties: [], mortgages: [] }
  ];
}

// === RENDER DE JUGADORES ===
function renderPlayers() {
  playersPanel.innerHTML = "";

  state.players.forEach(player => {
    const initials = player.nickname.slice(0, 2).toUpperCase();
    const propiedades = player.properties.length ? player.properties.join(", ") : "Ninguna";
    const hipotecas = player.mortgages.length ? player.mortgages.join(", ") : "Ninguna";

    const card = document.createElement("div");
    card.className = "mb-4 p-3 rounded bg-white";

    card.innerHTML = `
      <div class="d-flex align-items-center mb-2">
        <span class="badge me-2" style="background:${player.color};">${initials}</span>
        <img src="https://flagsapi.com/${player.countryCode}/flat/32.png" alt="Bandera" class="me-2">
        <span class="fw-bold">${player.nickname}</span>
      </div>
      <p class="mb-1">🎨 Ficha: <span class="badge" style="background:${player.color};">Color</span></p>
      <p class="mb-1">💰 Dinero: $${player.cash}</p>
      <p class="mb-1">🏠 Propiedades: ${propiedades}</p>
      <p class="mb-0 text-warning">📉 Hipotecas: ${hipotecas}</p>
    `;

    playersPanel.appendChild(card);
  });
}

// === BOOT ===
async function boot() {
  try {
    state.countries = await getCountries();
    console.log("Países cargados:", state.countries);

    createPlayers();     // simula jugadores iniciales
    renderPlayers();     // muestra en el DOM
  } catch (err) {
    console.error(err);
    playersPanel.innerHTML = `<p class="text-danger">Error cargando jugadores</p>`;
  }
}

// Lanzar
boot();
