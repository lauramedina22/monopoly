document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("country");

  fetch("http://127.0.0.1:5000/countries")
    .then(res => res.json())
    .then(data => {
      data.forEach(country => {
        const option = document.createElement("option");
        option.value = country.code || country;       // depende cómo guardes los países
        option.textContent = country.name || country;
        countrySelect.appendChild(option);
      });
    })
    .catch(err => console.error("Error cargando países:", err));

  document.getElementById("player-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nickname = document.getElementById("nickname").value;
    const country = countrySelect.value;

    fetch("http://127.0.0.1:5000/score-recorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nick_name: nickname, score: 0, country_code: country })
    })
    .then(res => res.json())
    .then(data => console.log("Jugador registrado:", data))
    .catch(err => console.error("Error:", err));
  });
});
