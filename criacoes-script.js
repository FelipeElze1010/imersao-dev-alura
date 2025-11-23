// Espera a página HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {
    // Pega os lugares no HTML onde vamos colocar os jogos
    const availableGamesContainer = document.getElementById('available-games');
    const currentListContainer = document.getElementById('current-list');
    const saveListBtn = document.getElementById('save-list-btn');

    // Cria "gavetas" (arrays) vazias para guardar os dados dos jogos
    let allGames = [];
    let currentListGames = [];

    // 1. Busca os jogos do arquivo data.json
    fetch('data.json')
        .then(response => response.json()) // Transforma a resposta em JSON
        .then(data => {
            allGames = data; // Guarda todos os jogos na nossa "gaveta"
            renderAvailableGames(); // Chama a função para mostrar os jogos na tela
        })
        .catch(error => {
            // Se der erro ao buscar os jogos, mostra uma mensagem
            console.error('Erro ao carregar jogos:', error);
            availableGamesContainer.innerHTML = '<p>Não foi possível carregar os jogos.</p>';
        });

    // 2. Mostra a lista de jogos disponíveis
    function renderAvailableGames() {
        availableGamesContainer.innerHTML = '<h3>Jogos Disponíveis (clique ⊕ para adicionar)</h3>';
        allGames.forEach(game => {
            const gameItem = createGameItem(game, 'add');
            availableGamesContainer.appendChild(gameItem);
        });
    }

    // 3. Mostra a lista de jogos que o usuário escolheu
    function renderCurrentList() {
        // Primeiro, limpa a lista para não duplicar os jogos
        currentListContainer.innerHTML = '<h3>Sua Lista (arraste para ordenar)</h3>';
        
        // Cria e adiciona cada jogo da lista do usuário na tela
        currentListGames.forEach(game => {
            const gameItem = createGameItem(game, 'remove');
            gameItem.setAttribute('draggable', true); // Torna o item arrastável
            currentListContainer.appendChild(gameItem);
        });
    }

    // 4. Função que cria o "card" de um jogo
    function createGameItem(game, action) {
        const item = document.createElement('div');
        item.className = 'game-item';
        item.dataset.id = game.nome; // Usando nome como ID para a lógica de arrastar

        item.innerHTML = `
            <img src="${game.imagem}" alt="${game.nome}">
            <span>${game.nome}</span>
            <button title="${action === 'add' ? 'Adicionar à lista' : 'Remover da lista'}">
                ${action === 'add' ? '⊕' : '⊖'}
            </button>
        `;
        // Adiciona a função de clique no botão para adicionar ou remover
        item.querySelector('button').addEventListener('click', () => handleGameAction(game, action));
        return item;
    }

    // 5. Função para adicionar ou remover um jogo
    function handleGameAction(game, action) {
        if (action === 'add') {
            // Adiciona o jogo na lista do usuário, se ele já não estiver lá
            if (!currentListGames.find(g => g.nome === game.nome)) {
                currentListGames.push(game);
            }
        } else { // action === 'remove'
            // Remove o jogo da lista do usuário
            currentListGames = currentListGames.filter(g => g.nome !== game.nome);
        }
        renderCurrentList(); // Atualiza a lista na tela
    }

    // 6. Lógica para o botão de salvar
    saveListBtn.addEventListener('click', () => {
        // Verifica se a lista não está vazia
        if (currentListGames.length === 0) {
            alert('Sua lista está vazia. Adicione alguns jogos antes de salvar.');
            return; // Para a execução da função aqui
        }

        // Mostra a mensagem de sucesso
        alert('Lista concluída com sucesso!');

        // Reseta a lista
        currentListGames = []; // Esvazia o array
        renderCurrentList();   // Atualiza a tela para mostrar a lista vazia
    });

    // --- Lógica de Arrastar e Soltar (Drag and Drop) ---
    let draggedItem = null;

    // Quando o usuário começa a arrastar um item
    currentListContainer.addEventListener('dragstart', e => {
        if (e.target.classList.contains('game-item')) {
            draggedItem = e.target;
            // Adiciona uma classe para dar um efeito visual (ex: transparência)
            setTimeout(() => e.target.classList.add('dragging'), 0);
        }
    });

    // Quando o usuário solta o item
    currentListContainer.addEventListener('dragend', e => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
            
            // Atualiza a ordem do array `currentListGames` para refletir a nova ordem na tela
            const newOrderIds = [...currentListContainer.querySelectorAll('.game-item')].map(item => item.dataset.id);
            currentListGames.sort((a, b) => newOrderIds.indexOf(a.nome) - newOrderIds.indexOf(b.nome));
        }
    });

    // Onde o item pode ser solto
    currentListContainer.addEventListener('dragover', e => {
        e.preventDefault(); // Necessário para permitir o 'drop'
        const afterElement = getDragAfterElement(currentListContainer, e.clientY);
        if (afterElement == null) {
            currentListContainer.appendChild(draggedItem);
        } else {
            currentListContainer.insertBefore(draggedItem, afterElement);
        }
    });

    // Função auxiliar para descobrir onde inserir o item que está sendo arrastado
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.game-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});