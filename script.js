const input = document.getElementById("tarefa");
const botao = document.getElementById("botao");
const lista = document.getElementById("lista");
const btnLimpar = document.getElementById("btnLimpar");
const info = document.getElementById("infotarefas");
const filtros = document.querySelectorAll(".filtro");

// EVENTOS

botao.addEventListener("click", adicionarTarefa);

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        adicionarTarefa();
    }
});

btnLimpar.addEventListener("click", limparConcluidas);

filtros.forEach(botao => {
    botao.addEventListener("click", function () {

        filtros.forEach(btn => btn.classList.remove("ativo"));

        this.classList.add("ativo");

        filtrarTarefas(this.dataset.filtro);

    });
});

// ADICIONAR TAREFA

function adicionarTarefa() {

    const texto = input.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa!");
        input.focus();
        return;
    }

    criarTarefa(texto);

    input.value = "";
    input.focus();

    aplicarFiltroAtual();
}

// CRIAR TAREFA

function criarTarefa(texto, concluida = false) {

    const item = document.createElement("li");
    item.className = "tarefa";

    if (concluida) {
        item.classList.add("concluida");
    }

    const span = document.createElement("span");
    span.textContent = texto;

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn-excluir";
    btnExcluir.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

    btnExcluir.addEventListener("click", function (e) {

        e.stopPropagation();

        item.remove();

        salvarTarefas();

        atualizarInfoTarefas();

    });

    item.addEventListener("click", function () {

        item.classList.toggle("concluida");

        salvarTarefas();

        atualizarInfoTarefas();

        aplicarFiltroAtual();

    });

    item.appendChild(span);
    item.appendChild(btnExcluir);

    lista.appendChild(item);

    salvarTarefas();

    atualizarInfoTarefas();

}

// FILTROS

function filtrarTarefas(filtro) {

    document.querySelectorAll(".tarefa").forEach(tarefa => {

        const concluida = tarefa.classList.contains("concluida");

        switch (filtro) {

            case "pendentes":
                tarefa.style.display = concluida ? "none" : "flex";
                break;

            case "concluidas":
                tarefa.style.display = concluida ? "flex" : "none";
                break;

            default:
                tarefa.style.display = "flex";

        }

    });

}

function aplicarFiltroAtual() {

    const filtro = document.querySelector(".filtro.ativo").dataset.filtro;

    filtrarTarefas(filtro);

}

// CONTADOR

function atualizarInfoTarefas() {

    const total = document.querySelectorAll(".tarefa").length;

    const concluidas = document.querySelectorAll(".tarefa.concluida").length;

    info.textContent = `${concluidas} de ${total} tarefas concluídas`;

}

// LIMPAR CONCLUÍDAS

function limparConcluidas() {

    const concluidas = document.querySelectorAll(".tarefa.concluida");

    if (concluidas.length === 0) {
        alert("Nenhuma tarefa concluída.");
        return;
    }

    if (!confirm("Deseja remover todas as tarefas concluídas?")) {
        return;
    }

    concluidas.forEach(tarefa => tarefa.remove());

    salvarTarefas();

    atualizarInfoTarefas();

}

// LOCAL STORAGE

function salvarTarefas() {

    const tarefas = [];

    document.querySelectorAll(".tarefa").forEach(item => {

        tarefas.push({

            texto: item.querySelector("span").textContent,

            concluida: item.classList.contains("concluida")

        });

    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));

}

function carregarTarefas() {

    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

    tarefas.forEach(tarefa => {

        criarTarefa(tarefa.texto, tarefa.concluida);

    });

}

// INICIALIZAÇÃO

window.addEventListener("DOMContentLoaded", function () {

    carregarTarefas();

    atualizarInfoTarefas();

});
