document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cards-container');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    let gamesData = []; // Armazena os dados dos jogos

    // Função para renderizar todos os cards na galeria principal
    function renderCards(data) {
        container.innerHTML = ''; // Limpa o contêiner antes de adicionar novos cards
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            // Adiciona um ID único para cada card para facilitar o scroll
            card.id = `game-${item.nome.replace(/\s+/g, '-').toLowerCase()}`;
            card.innerHTML = `
                <div class="card-image-area">
                    <img src="${item.imagem}" alt="Capa do jogo ${item.nome}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://via.placeholder.com/320x400.png?text=Imagem+Nao+Encontrada';">
                </div>
                <div class="card-info-area">
                    <h2 class="card-title">${item.nome}</h2>
                    <p class="card-info"><strong>Ano de Lançamento:</strong> ${item.ano}</p>
                    <p class="card-info"><strong>Duração Média:</strong> ${item.duracao}</p>
                    <p class="card-description">${item.descricao}</p>
                    <a href="${item.link}" target="_blank" class="card-link">Página na Loja</a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Evento de input para a busca
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        searchResultsContainer.innerHTML = ''; // Limpa resultados anteriores

        if (searchTerm.length > 0) {
            const filteredGames = gamesData.filter(game => game.nome.toLowerCase().includes(searchTerm));

            filteredGames.forEach(game => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <img src="${game.imagem}" alt="${game.nome}">
                    <span>${game.nome}</span>
                `;
                // Ao clicar no item, rola a página até o card correspondente
                item.addEventListener('click', () => {
                    const cardId = `game-${game.nome.replace(/\s+/g, '-').toLowerCase()}`;
                    document.getElementById(cardId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    searchInput.value = ''; // Limpa o input
                    searchResultsContainer.innerHTML = ''; // Esconde as sugestões
                });
                searchResultsContainer.appendChild(item);
            });
        }
    });

    // Esconde as sugestões se clicar fora da área de busca
    document.addEventListener('click', (e) => {
        if (!searchResultsContainer.contains(e.target) && e.target !== searchInput) {
            searchResultsContainer.innerHTML = '';
        }
    });

    // Carrega os dados e renderiza os cards iniciais
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            gamesData = data; // Armazena os dados globalmente
            renderCards(gamesData); // Renderiza os cards na página
        }).catch(error => {
            console.error('Erro ao carregar os dados dos jogos:', error);
            container.innerHTML = '<p>Não foi possível carregar a galeria de jogos. Tente novamente mais tarde.</p>';
        });
});

 document.addEventListener('DOMContentLoaded', () => {
            const carouselContainer = document.getElementById('carousel-container');
            let currentSlide = 0;

            function createCarousel(games) {
                // Pega os 5 primeiros jogos que possuem uma imagem de carrossel
                const featuredGames = games.filter(g => g.imagem_carrossel).slice(0, 5);

                if (featuredGames.length === 0) {
                    document.querySelector('.carousel-section').style.display = 'none';
                    return;
                }
                
                featuredGames.forEach((game, index) => {
                    const slide = document.createElement('div');
                    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
                    // Usa a imagem_carrossel ou a imagem normal como fallback
                    const imageUrl = game.imagem_carrossel || game.imagem;
                    slide.innerHTML = `
                        <img src="${imageUrl}" alt="${game.nome}">
                        <div class="slide-caption">
                            <h3>${game.nome}</h3>
                            <p>${game.descricao.substring(0, 100)}...</p>
                        </div>
                    `;
                    carouselContainer.appendChild(slide);
                });

                const nav = document.createElement('div');
                nav.className = 'carousel-nav';
                nav.innerHTML = `
                    <button id="prev-slide">&lt;</button>
                    <button id="next-slide">&gt;</button>
                `;
                carouselContainer.appendChild(nav);

                document.getElementById('prev-slide').addEventListener('click', () => changeSlide(-1));
                document.getElementById('next-slide').addEventListener('click', () => changeSlide(1));

                setInterval(() => changeSlide(1), 5000); // Troca de slide a cada 5 segundos
            }

            function changeSlide(direction) {
                const slides = document.querySelectorAll('.carousel-slide');
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + direction + slides.length) % slides.length;
                slides[currentSlide].classList.add('active');
            }

            // Busca os dados do JSON para popular o carrossel
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    createCarousel(data);
                })
                .catch(error => console.error('Erro ao carregar dados para o carrossel:', error));
        });