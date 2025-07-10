function getPokemon() {
  const name = document.getElementById("search").value.toLowerCase().trim();
  if (!name) return;
  fetchPokemon(name);
}

function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 898) + 1;
  document.getElementById("search").value = "";
  fetchPokemon(randomId);
}

function fetchPokemon(nameOrId) {
  const loading = document.getElementById("loading");
  const card = document.getElementById("pokemon-card");

  loading.classList.remove("hidden");
  loading.querySelector(".dots").textContent = "...";
  card.classList.add("hidden");

  fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
    .then(response => {
      if (!response.ok) throw new Error("Pokémon not found");
      return response.json();
    })
    .then(data => {
      loading.classList.add("hidden");
      card.classList.remove("hidden");

      document.getElementById("poke-name").textContent = data.name.toUpperCase();
      document.getElementById("poke-img").src = data.sprites.front_default;

      const types = data.types.map(t => t.type.name).join(", ");
      document.getElementById("poke-type").textContent = types;

      const abilities = data.abilities.map(a => a.ability.name).join(", ");
      document.getElementById("poke-abilities").textContent = abilities;

      const statsList = document.getElementById("poke-stats");
      statsList.innerHTML = "";
      data.stats.forEach(stat => {
        const li = document.createElement("li");
        li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(li);
      });
    })
    .catch(error => {
      loading.textContent = "❌ " + error.message;
      card.classList.add("hidden");
    });
}
