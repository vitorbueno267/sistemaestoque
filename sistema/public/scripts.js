const apiBaseUrl = 'http://localhost:3000';

// Função para Cadastrar Cliente
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
        const data = await resCadastro.json();
        alert(data.message);
        document.getElementById('formCadastroCliente').reset();
        carregarClientes();

    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
    }
});

// Função para Carregar Clientes
async function carregarClientes() {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-cliente`);
        const clientes = await res.json();

        const tabela = document.getElementById('tabelaClientes');
        tabela.innerHTML = '';

        clientes.forEach((cliente) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>
                    <button class="edit" onclick="editarCliente(${cliente.id})">Editar</button>
                    <button class="delete" onclick="deletarCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

// Função para Editar Cliente
async function editarCliente(id) {
    const cliente = await buscarClientePorId(id);
    abrirModalEditarCliente(cliente);
}

// Função para Buscar Cliente por ID
async function buscarClientePorId(id) {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-cliente?id=${id}`);
        const clientes = await res.json();
        return clientes[0];
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
    }
}

// Função para Abrir Modal de Edição de Cliente
function abrirModalEditarCliente(cliente) {
    const modal = document.getElementById('modalEditarCliente');
    const nomeInput = document.getElementById('editarNomeCliente');
    const emailInput = document.getElementById('editarEmailCliente');
    const senhaInput = document.getElementById('editarSenhaCliente');
    
    // Preenche os campos com os valores do cliente
    nomeInput.value = cliente.nome;
    emailInput.value = cliente.email;
    senhaInput.value = cliente.senha;

    // Exibe o modal
    modal.style.display = 'flex';

    // Ao clicar em "Salvar", envia os dados para atualização
    document.getElementById('btnSalvarEditarCliente').onclick = async () => {
        const novoNome = nomeInput.value;
        const novoEmail = emailInput.value;
        const novaSenha = senhaInput.value;

        // Envia os dados modificados para o back-end
        try {
            const res = await fetch(`${apiBaseUrl}/editar-cliente/${cliente.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: novoNome || cliente.nome,
                    email: novoEmail || cliente.email,
                    senha: novaSenha || cliente.senha,
                }),
            });
            const data = await res.json();
            alert(data.message);
            carregarClientes(); 
            modal.style.display = 'none'; 
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        }
    };

    // Ao clicar em "Fechar", fecha o modal
    document.getElementById('btnFecharModalCliente').onclick = () => {
        modal.style.display = 'none';
    };
}

// Função para Deletar Cliente
async function deletarCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            const res = await fetch(`${apiBaseUrl}/deletar-cliente/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            alert(data.message);
            carregarClientes();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
        }
    }
}

// Função para Buscar Clientes
document.getElementById('formBuscaCliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nomeBusca = document.getElementById('nomeBuscaCliente').value;
    const emailBusca = document.getElementById('emailBuscaCliente').value;

    carregarClientes(nomeBusca, emailBusca);
});

// Função para Cadastrar Prestador
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

// Função para Carregar Prestadores
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
                    <button class="edit" onclick="editarPrestador(${prestador.id})">Editar</button>
                    <button class="delete" onclick="deletarPrestador(${prestador.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar prestadores:', error);
    }
}

// Função para Editar Prestador
async function editarPrestador(id) {
    const prestador = await buscarPrestadorPorId(id);
    abrirModalEditarPrestador(prestador);
}

// Função para Buscar Prestador por ID
async function buscarPrestadorPorId(id) {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-prestador?id=${id}`);
        const prestadores = await res.json();
        return prestadores[0];
    } catch (error) {
        console.error('Erro ao buscar prestador:', error);
    }
}

// Função para Abrir Modal de Edição de Prestador
function abrirModalEditarPrestador(prestador) {
    const modal = document.getElementById('modalEditarPrestador');
    const nomeInput = document.getElementById('editarNomePrestador');
    const emailInput = document.getElementById('editarEmailPrestador');
    const senhaInput = document.getElementById('editarSenhaPrestador');
    
    // Preenche os campos com os valores do prestador
    nomeInput.value = prestador.nome;
    emailInput.value = prestador.email;
    senhaInput.value = prestador.senha;

    // Exibe o modal
    modal.style.display = 'flex';

    // Ao clicar em "Salvar", envia os dados para atualização
    document.getElementById('btnSalvarEditarPrestador').onclick = async () => {
        const novoNome = nomeInput.value;
        const novoEmail = emailInput.value;
        const novaSenha = senhaInput.value;

        // Envia os dados modificados para o back-end
        try {
            const res = await fetch(`${apiBaseUrl}/editar-prestador/${prestador.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: novoNome || prestador.nome,
                    email: novoEmail || prestador.email,
                    senha: novaSenha || prestador.senha,
                }),
            });
            const data = await res.json();
            alert(data.message);
            carregarPrestadores();
            modal.style.display = 'none'; 
        } catch (error) {
            console.error('Erro ao atualizar prestador:', error);
        }
    };

    // Ao clicar em "Fechar", fecha o modal
    document.getElementById('btnFecharModalPrestador').onclick = () => {
        modal.style.display = 'none';
    };
}

// Função para Deletar Prestador
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

// Função para Cadastrar Produto
document.getElementById('formCadastroProduto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('precoProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;

    try {
        // Verifica se o nome do produto já está cadastrado
        const resBuscaNome = await fetch(`${apiBaseUrl}/buscar-produto?nome=${nome}`);
        const produtosComNome = await resBuscaNome.json();

        if (produtosComNome.length > 0) {
            alert('Este produto já está cadastrado!');
            return;
        }

        // Realiza o cadastro
        const resCadastro = await fetch(`${apiBaseUrl}/cadastro-produto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, descricao }),
        });
        const data = await resCadastro.json();
        alert(data.message);
        document.getElementById('formCadastroProduto').reset();
        carregarProdutos();

    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
});

// Função para Carregar Produtos
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
                <td>
                    <button class="edit" onclick="editarProduto(${produto.id})">Editar</button>
                    <button class="delete" onclick="deletarProduto(${produto.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Função para Editar Produto
async function editarProduto(id) {
    const produto = await buscarProdutoPorId(id);
    abrirModalEditarProduto(produto);
}

// Função para Buscar Produto por ID
async function buscarProdutoPorId(id) {
    try {
        const res = await fetch(`${apiBaseUrl}/buscar-produto?id=${id}`);
        const produtos = await res.json();
        return produtos[0];
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}

// Função para Abrir Modal de Edição de Produto
function abrirModalEditarProduto(produto) {
    const modal = document.getElementById('modalEditarProduto');
    const nomeInput = document.getElementById('editarNomeProduto');
    const precoInput = document.getElementById('editarPrecoProduto');
    const descricaoInput = document.getElementById('editarDescricaoProduto');
    
    // Preenche os campos com os valores do produto
    nomeInput.value = produto.nome;
    precoInput.value = produto.preco;
    descricaoInput.value = produto.descricao;

    // Exibe o modal
    modal.style.display = 'flex';

    // Ao clicar em "Salvar", envia os dados para atualização
    document.getElementById('btnSalvarEditarProduto').onclick = async () => {
        const novoNome = nomeInput.value;
        const novoPreco = precoInput.value;
        const novaDescricao = descricaoInput.value;

        // Envia os dados modificados para o back-end
        try {
            const res = await fetch(`${apiBaseUrl}/editar-produto/${produto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: novoNome || produto.nome,
                    preco: novoPreco || produto.preco,
                    descricao: novaDescricao || produto.descricao,
                }),
            });
            const data = await res.json();
            alert(data.message);
            carregarProdutos();
            modal.style.display = 'none'; 
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };

    // Ao clicar em "Fechar", fecha o modal
    document.getElementById('btnFecharModalProduto').onclick = () => {
        modal.style.display = 'none';
    };
}

// Função para Deletar Produto
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
