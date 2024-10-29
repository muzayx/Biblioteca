lucide.createIcons();

function mostrarSecao(secaoId) {
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(secaoId).classList.remove('hidden');
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSecao(e.currentTarget.dataset.section);
    });
});

function renderizarLivros(livros) {
    const grid = document.getElementById('livros-disponiveis-grid');
    grid.innerHTML = '';
    livros.forEach(livro => {
        const livroEl = document.createElement('div');
        livroEl.className = 'bg-surface p-6 rounded-lg shadow-sm';
        livroEl.innerHTML = `
            <div class="relative">
                <span class="absolute top-0 right-0 text-xs text-gray-400 mt-1 mr-1">ID: ${livro.id}</span>
                <h3 class="text-xl font-semibold mb-2 text-white">${livro.titulo}</h3>
                <p class="text-gray-300">Autor: ${livro.autor}</p>
                <p class="text-gray-300">Gênero: ${livro.genero}</p>
                <p class="text-gray-300">Status: ${livro.disponivel ? 'Disponível' : 'Alugado'}</p>
                ${!livro.disponivel ? `
                    <p class="text-gray-300">Situação: <span class="${livro.status === 'Atrasado' ? 'text-red-500' : 'text-green-500'}">
                            ${livro.status}
                        </span>
                    </p>
                    <p class="text-gray-300">Data de Devolução: ${livro.data_devolucao}</p>
                ` : ''}
                ${livro.disponivel ? `
                    <button class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300" onclick="alugarLivro(${livro.id})">Alugar</button>
                ` : ''}
            </div>
        `;
        grid.appendChild(livroEl);
    });
}

function buscarLivros() {
    const termo = document.getElementById('busca-input').value;
    fetch(`api.php?action=buscarLivros&termo=${encodeURIComponent(termo)}`)
        .then(response => response.json())
        .then(livros => {
            renderizarLivros(livros);
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
            mostrarNotificacao('Erro ao buscar livros. Tente novamente.', 'error');
        });
}

document.getElementById('busca-btn').addEventListener('click', buscarLivros);

document.getElementById('busca-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarLivros();
    }
});

function alugarLivro(livroId) {
    const leitor = prompt("Digite o nome do leitor:");
    if (leitor) {
        const dataDevolucao = new Date();
        dataDevolucao.setDate(dataDevolucao.getDate() + 14);
        const formattedDate = dataDevolucao.toISOString().split('T')[0];

        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=alugarLivro&livro_id=${livroId}&leitor=${encodeURIComponent(leitor)}&data_devolucao=${formattedDate}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacao(`Livro alugado com sucesso para ${leitor}!`);
                buscarLivros();
                renderizarLivrosAlugados();
                atualizarDashboard();
            } else {
                mostrarNotificacao('Erro ao alugar o livro. Tente novamente.', 'error');
            }
        });
    }
}

function renderizarLivrosAlugados() {
    fetch('api.php?action=getLivrosAlugados')
        .then(response => response.json())
        .then(livros => {
            const tbody = document.getElementById('livros-alugados-tbody');
            tbody.innerHTML = '';
            livros.forEach(livro => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-text">${livro.titulo}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-text">${livro.leitor}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-text">${livro.data_aluguel}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-text">${livro.data_devolucao}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-text">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${livro.status === 'Atrasado' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                            ${livro.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-text">
                        <button onclick="devolverLivro(${livro.id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                            Devolver
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
}

document.getElementById('adicionar-livro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const titulo = document.getElementById('novo-livro-titulo').value;
    const autor = document.getElementById('novo-livro-autor').value;
    const genero = document.getElementById('novo-livro-genero').value;
    
    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=adicionarLivro&titulo=${encodeURIComponent(titulo)}&autor=${encodeURIComponent(autor)}&genero=${encodeURIComponent(genero)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao(`Novo livro "${titulo}" adicionado com sucesso!`);
            buscarLivros();
            atualizarDashboard();
            this.reset();
        } else {
            mostrarNotificacao('Erro ao adicionar o livro. Tente novamente.', 'error');
        }
    });
});

function editarLivro(id) {
    const titulo = document.getElementById('editar-livro-titulo').value;
    const autor = document.getElementById('editar-livro-autor').value;
    const genero = document.getElementById('editar-livro-genero').value;

    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=editarLivro&id=${id}&titulo=${encodeURIComponent(titulo)}&autor=${encodeURIComponent(autor)}&genero=${encodeURIComponent(genero)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Livro editado com sucesso!');
            buscarLivros();
        } else {
            mostrarNotificacao('Erro ao editar o livro. Tente novamente.', 'error');
        }
    });
}

function deletarLivro(id) {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=deletarLivro&id=${id}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacao('Livro deletado com sucesso!');
                buscarLivros();
                atualizarDashboard();
            } else {
                mostrarNotificacao('Erro ao deletar o livro. Tente novamente.', 'error');
            }
        });
    }
}

function devolverLivro(id) {
    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=devolverLivro&id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacao('Livro devolvido com sucesso!');
            renderizarLivrosAlugados();
            buscarLivros();
            atualizarDashboard();
        } else {
            mostrarNotificacao('Erro ao devolver o livro. Tente novamente.', 'error');
        }
    });
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const notificacao = document.createElement('div');
    notificacao.className = `p-4 rounded-lg shadow-lg ${tipo === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`;
    notificacao.textContent = mensagem;
    document.getElementById('notificacoes').appendChild(notificacao);
    setTimeout(() => {
        notificacao.remove();
    }, 5000);
}

function atualizarDashboard() {
    fetch('api.php?action=getDashboardData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-livros').textContent = data.total_livros;
            document.getElementById('livros-alugados-count').textContent = data.livros_alugados;
            document.getElementById('leitores-ativos').textContent = data.leitores_ativos;
        });
}

document.getElementById('editar-livro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('editar-livro-id').value;
    editarLivro(id);
});

document.getElementById('deletar-livro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('deletar-livro-id').value;
    deletarLivro(id);
});

document.getElementById('buscar-livro-btn').addEventListener('click', function() {
    const id = document.getElementById('editar-livro-id').value;
    fetch(`api.php?action=getLivroPorId&id=${id}`)
        .then(response => response.json())
        .then(livro => {
            if (livro) {
                document.getElementById('editar-livro-titulo').value = livro.titulo;
                document.getElementById('editar-livro-autor').value = livro.autor;
                document.getElementById('editar-livro-genero').value = livro.genero;
                document.getElementById('editar-livro-detalhes').classList.remove('hidden');
            } else {
                mostrarNotificacao('Livro não encontrado', 'error');
            }
        });
});

document.addEventListener('DOMContentLoaded', () => {
    buscarLivros();
    renderizarLivrosAlugados();
    atualizarDashboard();
});