# Consumo de API com JavaScript - PokeAPI

Projeto desenvolvido para a atividade de consumo de APIs utilizando JavaScript moderno (`fetch` e `async/await`).

## 📋 Sobre a Aplicação

A página consome diretamente a [PokeAPI](https://pokeapi.co/), uma API REST pública e gratuita com dados completos sobre os personagens do universo Pokémon.

### Recursos Implementados:
- **Consumo assíncrono via `fetch()`**: Requisição para `https://pokeapi.co/api/v2/pokemon/{nome_ou_id}`.
- **Carregamento inicial automático**: Inicializa exibindo os dados do **Ditto** (ID 132), conforme solicitado.
- **Busca dinâmica**: Permite pesquisar qualquer Pokémon pelo nome ou pelo número da Pokédex (ex: `pikachu`, `charizard`, `25`, `1`).
- **Botões de atalho rápido**: Sugestões clicáveis para busca rápida.
- **Tratamento de status e erros**: Mensagens de carregamento e feedback caso o Pokémon não seja encontrado (HTTP 404).
- **Fallback local**: Se a conexão falhar, o script possui contingência para ler o arquivo `poke.json` local.
- **Exibição dos dados do JSON**:
  - Imagem oficial em alta resolução (`official-artwork`).
  - Identificação (Nome e ID formatado).
  - Tipos com cores temáticas oficiais (Normal, Fogo, Água, etc.).
  - Medidas físicas convertidas (Peso em kg e Altura em metros).
  - Habilidades ativas e ocultas.
  - Barras visuais de atributos base (HP, Ataque, Defesa, Atq. Especial, Def. Especial e Velocidade).

## 🚀 Como Executar

Basta abrir o arquivo `index.html` em qualquer navegador web:
1. Dê dois cliques em `index.html` ou clique com o botão direito e selecione **Abrir com...** -> Seu navegador preferido (Chrome, Edge, Firefox, etc.).
2. A tela carregará automaticamente consumindo os dados da PokeAPI.

