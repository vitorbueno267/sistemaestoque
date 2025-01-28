// ** Constantes e Configurações Iniciais **
const apiBaseUrl = 'http://localhost:3000';

// Carregar dados automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();
    carregarPrestadores();
    carregarProdutos();
});

// ** Funções Genéricas **
// Função para exibir alertas e logar erros
function handleResponse(response, successMessage) {
    if (response.ok) {
        alert(successMessage);
    } else {
        console.error('Erro na resposta:', response);
        alert('Ocorreu um erro. Consulte o console para mais detalhes.');
    }
}

// ** Funções de Cliente **

// Cadastrar Cliente
document.getElementById('formCadastroCliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeCliente').value;
    const email = document.getElementById('emailCliente').value;
    const senha = document.getElementById('senhaCliente').value;

    try {
        // Verifica se o email já está cadastrado
        const resBuscaEmail = await fetch(`${apiBaseUrl}/buscar-cliente?email=${email}`);
        const clientesComEmail = await resBuscaEmail.json();

        if (clientesComEmail.length > 0) {
            alert('Este email já está cadastrado!');
            return;
        }

        // Realiza o cadastro
        const resCadastro = await fetch(`${apiBaseUrl}/cadastro-cliente`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });
        handleResponse(resCadastro, 'Cliente cadastrado com sucesso!');
        document.getElementById('formCadastroCliente').reset();
        carregarClientes();
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
    }
});

// Carregar Clientes
async function carregarClientes() {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-cliente`);
        const clientes = await res.json();

        const tabela = document.getElementById('tabelaClientes');
        tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novas linhas

        clientes.forEach((cliente) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>
                    <button class="edit" data-id="${cliente.id}" data-nome="${cliente.nome}" data-email="${cliente.email}">Editar</button>
                    <button class="delete" onclick="deletarCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });

        // Adiciona eventos aos botões de editar
        adicionarEventosEditar();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

// Adicionar eventos aos botões de editar
function adicionarEventosEditar() {
    const botoesEditar = document.querySelectorAll('.edit');
    botoesEditar.forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;
            const nome = botao.dataset.nome;
            const email = botao.dataset.email;
            abrirModalEditarCliente({ id, nome, email });
        });
    });
}

// Abrir o modal de edição de cliente
function abrirModalEditarCliente(cliente) {
    const modal = document.getElementById('modalEditarCliente');
    const nomeInput = document.getElementById('editarNomeCliente');
    const emailInput = document.getElementById('editarEmailCliente');
    const senhaInput = document.getElementById('editarSenhaCliente');

    nomeInput.value = cliente.nome;
    emailInput.value = cliente.email;
    senhaInput.value = ''; // Não exibe a senha

    modal.style.display = 'flex';

    // Atualizar cliente ao clicar no botão "Salvar"
    document.getElementById('btnSalvarEditarCliente').onclick = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/editar-cliente/${cliente.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nomeInput.value,
                    email: emailInput.value,
                    senha: senhaInput.value,
                }),
            });

            if (res.ok) {
                alert('Cliente atualizado com sucesso!');
                carregarClientes();
                modal.style.display = 'none';
            } else {
                const error = await res.json();
                alert(`Erro ao atualizar cliente: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        }
    };

    // Fechar o modal
    document.getElementById('btnFecharModalCliente').onclick = () => {
        modal.style.display = 'none';
    };
}

// Deletar Cliente
async function deletarCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            const res = await fetch(`${apiBaseUrl}/deletar-cliente/${id}`, {
                method: 'DELETE',
            });
            handleResponse(res, 'Cliente excluído com sucesso!');
            carregarClientes();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
        }
    }
}

// ** Funções de Prestador **

// Cadastrar Prestador
document.getElementById('formCadastroPrestador').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomePrestador').value;
    const email = document.getElementById('emailPrestador').value;
    const senha = document.getElementById('senhaPrestador').value;

    try {
        // Verifica se o email já está cadastrado
        const resBuscaEmail = await fetch(`${apiBaseUrl}/buscar-prestador?email=${email}`);
        const prestadoresComEmail = await resBuscaEmail.json();

        if (prestadoresComEmail.length > 0) {
            alert('Este email já está cadastrado!');
            return;
        }

        // Realiza o cadastro
        const resCadastro = await fetch(`${apiBaseUrl}/cadastro-prestador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });
        const data = await resCadastro.json();
        alert(data.message);
        document.getElementById('formCadastroPrestador').reset();
        carregarPrestadores();

    } catch (error) {
        console.error('Erro ao cadastrar prestador:', error);
    }
});

// Carregar Prestadores
async function carregarPrestadores() {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-prestador`);
        const prestadores = await res.json();

        const tabela = document.getElementById('tabelaPrestadores');
        tabela.innerHTML = '';

        prestadores.forEach((prestador) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prestador.id}</td>
                <td>${prestador.nome}</td>
                <td>${prestador.email}</td>
                <td>
                    <button class="edit" data-id="${prestador.id}" data-nome="${prestador.nome}" data-email="${prestador.email}">Editar</button>
                    <button class="delete" onclick="deletarPrestador(${prestador.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });

        // Adiciona eventos aos botões de editar
        adicionarEventosEditarPrestador();
    } catch (error) {
        console.error('Erro ao carregar prestadores:', error);
    }
}

// Adicionar eventos aos botões de editar Prestadores
function adicionarEventosEditarPrestador() {
    const botoesEditar = document.querySelectorAll('.edit');
    botoesEditar.forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;
            const nome = botao.dataset.nome;
            const email = botao.dataset.email;
            abrirModalEditarPrestador({ id, nome, email });
        });
    });
}

// Abrir modal de edição de prestador
function abrirModalEditarPrestador(prestador) {
    const modal = document.getElementById('modalEditarPrestador');
    const nomeInput = document.getElementById('editarNomePrestador');
    const emailInput = document.getElementById('editarEmailPrestador');
    const senhaInput = document.getElementById('editarSenhaPrestador');

    nomeInput.value = prestador.nome;
    emailInput.value = prestador.email;
    senhaInput.value = ''; // Não exibe a senha

    modal.style.display = 'flex';

    // Atualizar prestador ao clicar no botão "Salvar"
    document.getElementById('btnSalvarEditarPrestador').onclick = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/editar-prestador/${prestador.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nomeInput.value,
                    email: emailInput.value,
                    senha: senhaInput.value,
                }),
            });

            if (res.ok) {
                alert('Prestador atualizado com sucesso!');
                carregarPrestadores();
                modal.style.display = 'none';
            } else {
                const error = await res.json();
                alert(`Erro ao atualizar prestador: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar prestador:', error);
        }
    };

    // Fechar o modal
    document.getElementById('btnFecharModalPrestador').onclick = () => {
        modal.style.display = 'none';
    };
}

// Deletar Prestador
async function deletarPrestador(id) {
    if (confirm('Tem certeza que deseja excluir este prestador?')) {
        try {
            const res = await fetch(`${apiBaseUrl}/deletar-prestador/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            alert(data.message);
            carregarPrestadores();
        } catch (error) {
            console.error('Erro ao excluir prestador:', error);
        }
    }
}

// ** Funções de Produto **

// Cadastrar Produto
document.getElementById('formCadastroProduto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeProduto').value.trim();
    const preco = document.getElementById('precoProduto').value.trim();
    const descricao = document.getElementById('descricaoProduto').value.trim();
    const idCliente = document.getElementById('clienteProduto').value;
    const idPrestador = document.getElementById('prestadorProduto').value;

    if (nome === '' || preco === '' || descricao === '' || idCliente === '' || idPrestador === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const resCadastro = await fetch(`${apiBaseUrl}/cadastro-produto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, descricao, idCliente, idPrestador }),
        });

        const data = await resCadastro.json();
        alert(data.message);
        document.getElementById('formCadastroProduto').reset();
        carregarProdutos();

    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
});

// Carregar Produtos
async function carregarProdutos() {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-produto`);
        const produtos = await res.json();

        const tabela = document.getElementById('tabelaProdutos');
        tabela.innerHTML = '';

        produtos.forEach((produto) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.preco}</td>
                <td>${produto.descricao}</td>
                <td>
                    <button class="edit" data-id="${produto.id}" data-nome="${produto.nome}" data-preco="${produto.preco}" data-descricao="${produto.descricao}">Editar</button>
                    <button class="delete" onclick="deletarProduto(${produto.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });

        // Adiciona eventos aos botões de editar
        adicionarEventosEditarProduto();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Adicionar eventos aos botões de editar Produto
function adicionarEventosEditarProduto() {
    const botoesEditar = document.querySelectorAll('.edit');
    botoesEditar.forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;
            const nome = botao.dataset.nome;
            const preco = botao.dataset.preco;
            const descricao = botao.dataset.descricao;
            abrirModalEditarProduto({ id, nome, preco, descricao });
        });
    });
}

// Abrir modal de edição de produto
function abrirModalEditarProduto(produto) {
    const modal = document.getElementById('modalEditarProduto');
    const nomeInput = document.getElementById('editarNomeProduto');
    const precoInput = document.getElementById('editarPrecoProduto');
    const descricaoInput = document.getElementById('editarDescricaoProduto');

    nomeInput.value = produto.nome;
    precoInput.value = produto.preco;
    descricaoInput.value = produto.descricao;

    modal.style.display = 'flex';

    // Atualizar produto ao clicar no botão "Salvar"
    document.getElementById('btnSalvarEditarProduto').onclick = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/editar-produto/${produto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nomeInput.value,
                    preco: precoInput.value,
                    descricao: descricaoInput.value,
                }),
            });

            if (res.ok) {
                alert('Produto atualizado com sucesso!');
                carregarProdutos();
                modal.style.display = 'none';
            } else {
                const error = await res.json();
                alert(`Erro ao atualizar produto: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };

    // Fechar o modal
    document.getElementById('btnFecharModalProduto').onclick = () => {
        modal.style.display = 'none';
    };
}

// Deletar Produto
async function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            const res = await fetch(`${apiBaseUrl}/deletar-produto/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            alert(data.message);
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    }
}
