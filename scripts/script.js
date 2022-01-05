var tbody = document.querySelector('table tbody');
var aluno = {};

function Cadastrar() {

    aluno.nome = document.querySelector('#nome').value;
    aluno.sobrenome = document.querySelector('#sobrenome').value;
    aluno.telefone = document.querySelector('#telefone').value;
    aluno.ra = document.querySelector('#ra').value;

    if (aluno.id === undefined || aluno.id === 0)
        salvarEstudantes('POST', 0, aluno);
    else
        salvarEstudantes('PUT', aluno.id, aluno);

    carregarEstudantes();

    $('#exampleModal').modal('hide');
}

function Cancelar() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var titulo = document.querySelector('#titulo');

    btnSalvar.textContent = 'Cadastrar';
    titulo.textContent = 'Cadastrar Aluno';

    document.querySelector('#nome').value = '';
    document.querySelector('#sobrenome').value = '';
    document.querySelector('#telefone').value = '';
    document.querySelector('#ra').value = '';

    aluno = {};

    $('#exampleModal').modal('hide');
}

function carregarEstudantes() {
    tbody.innerHTML = '';

    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://localhost:50885/api/Aluno/Recuperar`, true);
    xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'));

    xhr.onerror = function() {
        console.error('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var estudantes = JSON.parse(this.responseText);
                for (var indice in estudantes) {
                    adcionaLinha(estudantes[indice]);
                }
            } else if (this.status == 500) {
                var erro = JSON.parse(this.responseText);
                console.log(erro.Message);
                console.log(erro.ExceptionMessage);
            }
        }
    };

    xhr.send();
}

function salvarEstudantes(metodo, id, _corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0) {
        id = '';
    }

    xhr.open(metodo, `http://localhost:50885/api/Aluno/${id}`, false);

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(_corpo));
}

function excluirEstudante(id) {
    var xhr = new XMLHttpRequest();

    xhr.open(`DELETE`, `http://localhost:50885/api/Aluno/${id}`, false);

    xhr.send();
}

function excluir(estudante) {
    bootbox.confirm({
        message: `Tem certeza que deseja excluir o ${estudante.nome} ?`,
        buttons: {
            confirm: {
                label: 'Sim',
                className: 'btn-success'
            },
            cancel: {
                label: 'Não',
                className: 'btn-danger'
            }
        },
        callback: function(result) {
            if (result) {
                excluirEstudante(estudante.id);
                carregarEstudantes();
            }
        }
    });
}

carregarEstudantes('GET');

function editarEstudante(estudante) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var titulo = document.querySelector('#titulo');
    var tituloModal = document.querySelector('#exampleModalLabel');

    btnSalvar.textContent = 'Salvar';
    titulo.textContent = `Editar Aluno: ${estudante.nome}`;
    tituloModal.textContent = `Editar Aluno: ${estudante.nome}`;

    document.querySelector('#nome').value = estudante.nome;
    document.querySelector('#sobrenome').value = estudante.sobrenome;
    document.querySelector('#telefone').value = estudante.telefone;
    document.querySelector('#ra').value = estudante.ra;

    aluno = estudante;
}

function adcionaLinha(estudante) {
    var tbody = document.querySelector('table tbody');

    var trow = `<tr>
                              <td>${estudante.nome}</td>
                              <td>${estudante.sobrenome}</td>
                              <td>${estudante.telefone}</td>
                              <td>${estudante.ra}</td>
                              <td>
                                <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-info" onclick='editarEstudante(${JSON.stringify(estudante)})'>Editar</button>
                                <button class="btn btn-danger" onclick='excluir(${JSON.stringify(estudante)})'>Excluir</button>
                                </td>
                            <tr>`

    tbody.innerHTML += trow;
}

function novoAluno() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var titulo = document.querySelector('#titulo');

    btnSalvar.textContent = 'Cadastrar';
    titulo.textContent = 'Cadastrar Aluno';

    document.querySelector('#nome').value = '';
    document.querySelector('#sobrenome').value = '';
    document.querySelector('#telefone').value = '';
    document.querySelector('#ra').value = '';

    aluno = {};

    $('#exampleModal').modal('show');
}