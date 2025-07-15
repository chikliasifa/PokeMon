
// Global variables
let currentPokemon = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  const searchInput = document.getElementById('search');
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      getPokemon();
    }
  });
}

// Get Pokemon by search
function getPokemon() {
  const name = document.getElementById('search').value.toLowerCase().trim();
  if (!name) return;
  
  fetchPokemon(name);
}

// Get random Pokemon
function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 898) + 1;
  document.getElementById('search').value = '';
  fetchPokemon(randomId);
}

// Main fetch function
function fetchPokemon(nameOrId) {
  showLoading();
  hideError();
  hideCard();
  
  fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
    .then(response => {
      if (!response.ok) throw new Error("Pokémon not found");
      return response.json();
    })
    .then(data => {
      currentPokemon = data;
      displayPokemon();
    })
    .catch(error => {
      showError(error.message);
    })
    .finally(() => {
      hideLoading();
    });
}

// Display Pokemon information
function displayPokemon() {
  if (!currentPokemon) return;
  
  // Basic info
  document.getElementById('poke-name').textContent = capitalizeFirst(currentPokemon.name);
  document.getElementById('poke-id').textContent = `#${String(currentPokemon.id).padStart(3, '0')}`;
  
  // Height and weight
  document.getElementById('poke-height').textContent = `${(currentPokemon.height / 10).toFixed(1)} m`;
  document.getElementById('poke-weight').textContent = `${(currentPokemon.weight / 10).toFixed(1)} kg`;
  
  // Image
  document.getElementById('poke-img').src = currentPokemon.sprites.front_default;
  document.getElementById('poke-img').alt = `${currentPokemon.name} sprite`;
  
  // Types
  displayTypes();
  
  // Abilities
  displayAbilities();
  
  // Stats
  displayStats();
  
  showCard();
}

// Display types with color coding
function displayTypes() {
  const typesContainer = document.getElementById('poke-types');
  typesContainer.innerHTML = '';
  
  currentPokemon.types.forEach(typeInfo => {
    const typeSpan = document.createElement('span');
    typeSpan.className = `type-badge type-${typeInfo.type.name}`;
    typeSpan.textContent = typeInfo.type.name;
    typesContainer.appendChild(typeSpan);
  });
}

// Display abilities
function displayAbilities() {
  const abilitiesContainer = document.getElementById('poke-abilities');
  abilitiesContainer.innerHTML = '';
  
  currentPokemon.abilities.forEach(abilityInfo => {
    const abilitySpan = document.createElement('span');
    abilitySpan.className = 'ability-badge';
    abilitySpan.textContent = abilityInfo.ability.name.replace('-', ' ');
    if (abilityInfo.is_hidden) {
      abilitySpan.textContent += ' (Hidden)';
    }
    abilitiesContainer.appendChild(abilitySpan);
  });
}

// Display stats with animated bars
function displayStats() {
  const statsContainer = document.getElementById('poke-stats');
  statsContainer.innerHTML = '';
  
  const statColors = {
    'hp': '#FF5959',
    'attack': '#F5AC78', 
    'defense': '#FAE078',
    'special-attack': '#9DB7F5',
    'special-defense': '#A7DB8D',
    'speed': '#FA92B2'
  };
  
  currentPokemon.stats.forEach(statInfo => {
    const statItem = document.createElement('div');
    statItem.className = 'stat-item';
    
    const statName = document.createElement('div');
    statName.className = 'stat-name';
    statName.textContent = statInfo.stat.name.replace('-', ' ');
    
    const statBar = document.createElement('div');
    statBar.className = 'stat-bar';
    
    const statFill = document.createElement('div');
    statFill.className = 'stat-fill';
    statFill.style.backgroundColor = statColors[statInfo.stat.name] || '#667eea';
    
    const statValue = document.createElement('span');
    statValue.className = 'stat-value';
    statValue.textContent = statInfo.base_stat;
    
    statFill.appendChild(statValue);
    statBar.appendChild(statFill);
    statItem.appendChild(statName);
    statItem.appendChild(statBar);
    
    statsContainer.appendChild(statItem);
    
    // Animate the stat bar
    setTimeout(() => {
      const percentage = Math.min((statInfo.base_stat / 255) * 100, 100);
      statFill.style.width = `${percentage}%`;
    }, 100);
  });
}

// Utility functions
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
  document.getElementById('error-text').textContent = message;
  document.getElementById('error-message').classList.remove('hidden');
}

function hideError() {
  document.getElementById('error-message').classList.add('hidden');
}

function showCard() {
  document.getElementById('pokemon-card').classList.remove('hidden');
}

function hideCard() {
  document.getElementById('pokemon-card').classList.add('hidden');
}
