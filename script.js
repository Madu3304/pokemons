/**
 * Atividade: Consumo de API com JavaScript (PokeAPI)
 * 
 * Este script faz requisições assíncronas à PokeAPI usando `fetch` e `async/await`,
 * tratando erros e manipulando o DOM para exibir os dados do Pokémon.
 */

// URL base da PokeAPI
const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Elementos do DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const statusMessage = document.getElementById('status-message');
const pokemonCard = document.getElementById('pokemon-card');

const pokemonNameEl = document.getElementById('pokemon-name');
const pokemonIdEl = document.getElementById('pokemon-id');
const pokemonImgEl = document.getElementById('pokemon-img');
const pokemonTypesEl = document.getElementById('pokemon-types');
const pokemonWeightEl = document.getElementById('pokemon-weight');
const pokemonHeightEl = document.getElementById('pokemon-height');
const pokemonAbilitiesEl = document.getElementById('pokemon-abilities');
const pokemonStatsEl = document.getElementById('pokemon-stats');

// Nomes amigáveis para os status em português
const statLabels = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade'
};

/**
 * Função assíncrona principal para buscar dados do Pokémon na API
 * @param {string|number} identifier - Nome ou ID do Pokémon
 */
async function fetchPokemon(identifier) {
  const query = String(identifier).trim().toLowerCase();

  if (!query) return;

  // Exibe mensagem de carregamento
  showStatus('Buscando dados na PokeAPI...', 'loading');
  pokemonCard.style.opacity = '0.4';

  try {
    const response = await fetch(`${API_BASE_URL}${query}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokémon "${query}" não foi encontrado. Verifique a ortografia.`);
      }
      throw new Error(`Erro na requisição (Código: ${response.status})`);
    }

    // Converte a resposta em formato JSON
    const data = await response.json();

    // Renderiza os dados recebidos na tela
    renderPokemon(data);
    hideStatus();
  } catch (error) {
    console.error('Erro ao buscar Pokémon:', error);

    // Fallback: caso esteja sem internet e busque 'ditto', tenta ler o arquivo local poke.json
    if (query === 'ditto' || query === '132') {
      try {
        const localResponse = await fetch('./poke.json');
        if (localResponse.ok) {
          const localData = await localResponse.json();
          renderPokemon(localData);
          showStatus('Exibindo dados locais do arquivo poke.json (modo offline).', 'loading');
          setTimeout(hideStatus, 2500);
          return;
        }
      } catch (localErr) {
        // Ignora erro local e exibe erro original
      }
    }

    showStatus(error.message || 'Falha ao conectar com a API.', 'error');
  } finally {
    pokemonCard.style.opacity = '1';
  }
}

/**
 * Renderiza os dados do Pokémon na página HTML
 * @param {Object} data - Objeto JSON retornado pela PokeAPI
 */
function renderPokemon(data) {
  // Nome e ID formatado (ex: #132)
  pokemonNameEl.textContent = data.name;
  pokemonIdEl.textContent = `#${String(data.id).padStart(3, '0')}`;

  // Imagem (Arte oficial com fallback para sprite padrão)
  const officialArtwork = data.sprites?.other?.['official-artwork']?.front_default;
  const defaultSprite = data.sprites?.front_default;
  pokemonImgEl.src = officialArtwork || defaultSprite || '';
  pokemonImgEl.alt = `Imagem de ${data.name}`;

  // Tipos (cria as badges com as classes CSS correspondentes)
  pokemonTypesEl.innerHTML = '';
  data.types.forEach(t => {
    const badge = document.createElement('span');
    badge.className = `type-badge type-${t.type.name}`;
    badge.textContent = t.type.name;
    pokemonTypesEl.appendChild(badge);
  });

  // Peso e Altura (a PokeAPI fornece em hectogramas e decímetros)
  const weightKg = (data.weight / 10).toFixed(1);
  const heightM = (data.height / 10).toFixed(1);
  pokemonWeightEl.textContent = `${weightKg} kg`;
  pokemonHeightEl.textContent = `${heightM} m`;

  // Habilidades
  pokemonAbilitiesEl.innerHTML = '';
  data.abilities.forEach(item => {
    const abilitySpan = document.createElement('span');
    abilitySpan.className = `ability-tag ${item.is_hidden ? 'hidden' : ''}`;
    abilitySpan.textContent = item.ability.name + (item.is_hidden ? ' (oculta)' : '');
    pokemonAbilitiesEl.appendChild(abilitySpan);
  });

  // Estatísticas base com barra de progresso
  pokemonStatsEl.innerHTML = '';
  data.stats.forEach(statItem => {
    const statName = statLabels[statItem.stat.name] || statItem.stat.name;
    const statValue = statItem.base_stat;
    const maxStat = 255; // Valor máximo aproximado de stats em Pokémon
    const percentage = Math.min((statValue / maxStat) * 100, 100);

    const statRow = document.createElement('div');
    statRow.className = 'stat-item';
    statRow.innerHTML = `
      <span class="stat-name">${statName}</span>
      <span class="stat-number">${statValue}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${percentage}%"></div>
      </div>
    `;
    pokemonStatsEl.appendChild(statRow);
  });
}

/**
 * Exibe mensagem de feedback para o usuário
 */
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = 'block';
}

/**
 * Oculta mensagem de feedback
 */
function hideStatus() {
  statusMessage.style.display = 'none';
}

// Evento: Submissão do formulário de busca
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = searchInput.value.trim();
  if (value) {
    fetchPokemon(value);
  }
});

// Evento: Clique nas tags rápidas de sugestão
document.querySelectorAll('.tag-btn').forEach(button => {
  button.addEventListener('click', () => {
    const pokemon = button.getAttribute('data-pokemon');
    searchInput.value = pokemon;
    fetchPokemon(pokemon);
  });
});

// Inicialização: carrega o "ditto" por padrão ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
  fetchPokemon('ditto');
});

