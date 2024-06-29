document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('produtoForm');
    const produtosTable = document.getElementById('produtos').getElementsByTagName('tbody')[0];

    let produtos = JSON.parse(localStorage.getItem('listaProdutos')) || [];

    function getNextCodProduto() {
        if (produtos.length === 0) {
            return 1;
        }
        const maxCodProduto = Math.max(...produtos.map(p => parseInt(p.codProduto, 10)));
        return maxCodProduto + 1;
    }

    function initializeForm() {
        document.getElementById('codProduto').value = getNextCodProduto();
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeProduto = document.getElementById('nomeProduto').value;
        const codProduto = document.getElementById('codProduto').value;
        const unidade = document.getElementById('unidade').value;
        const quantidade = document.getElementById('quantidade').value;
        const codigoBarra = document.getElementById('codigoBarra').value;
        const ativo = document.getElementById('ativo').checked;

        if (!nomeProduto || !unidade || !quantidade) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (codigoBarra && codigoBarra.length !== 13) {
            alert('O código de barras deve ter exatamente 13 dígitos.');
            return;
        }

        const produto = {
            codProduto,
            nomeProduto,
            unidade,
            quantidade,
            codigoBarra,
            ativo,
            quantidadeComprada: 0  // Inicializar a quantidade comprada com 0
        };

        produtos.push(produto);
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
        addProdutoToTable(produto);
        form.reset();
        initializeForm();
    });

    function addProdutoToTable(produto) {
        const row = produtosTable.insertRow();
        row.insertCell(0).innerText = produto.codProduto;
        row.insertCell(1).innerText = produto.nomeProduto;
        row.insertCell(2).innerText = produto.unidade;
        row.insertCell(3).innerText = produto.quantidade;
        row.insertCell(4).innerText = produto.codigoBarra || ''; // Mostrar vazio se não houver código de barras
        row.insertCell(5).innerText = produto.ativo ? 'Sim' : 'Não';

        const actionsCell = row.insertCell(6);
        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.addEventListener('click', function () {
            editProduto(produto.codProduto);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Excluir';
        deleteButton.addEventListener('click', function () {
            deleteProduto(produto.codProduto);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    }

    function editProduto(codProduto) {
        const produto = produtos.find(p => p.codProduto === codProduto);
        if (!produto) return;

        document.getElementById('nomeProduto').value = produto.nomeProduto;
        document.getElementById('codProduto').value = produto.codProduto;
        document.getElementById('unidade').value = produto.unidade;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('codigoBarra').value = produto.codigoBarra;
        document.getElementById('ativo').checked = produto.ativo;

        produtos = produtos.filter(p => p.codProduto !== codProduto);
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
        renderProdutos();
    }

    function deleteProduto(codProduto) {
        produtos = produtos.filter(p => p.codProduto !== codProduto);
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
        renderProdutos();
    }

    function renderProdutos() {
        produtosTable.innerHTML = '';
        produtos.forEach(addProdutoToTable);
    }

    initializeForm();
    renderProdutos();
});
