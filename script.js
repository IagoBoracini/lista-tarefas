function criarTarefa(textoTarefa, concluida = false) {

        const item = document.createElement("li");
    item.className = "tarefa";
    if (concluida) {
    item.classList.add("concluida");
}
    const texto = document.createElement("span");
    texto.textContent = textoTarefa;

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent  = "🗑";

    btnExcluir.classList.add("btn-excluir");

    btnExcluir.onclick = function(e) {
        e.stopPropagation();
        item.remove();
        salvarTarefas();
        atualizarInfoTarefas();
    };

    item.appendChild(texto);
    item.appendChild(btnExcluir);

    item.addEventListener("click", function () {
        item.classList.toggle("concluida");
        salvarTarefas();
        atualizarInfoTarefas();

        const filtroAtivo = document.querySelector(".filtro.ativo").dataset.filtro;
        filtrarTarefas(filtroAtivo);
    });

    const lista = document.getElementById("lista");
    lista.appendChild(item);
    salvarTarefas();
    atualizarInfoTarefas();

}

function adicionarTarefa() {

    const input = document.getElementById("tarefa");

    if (input.value.trim() === "") {
        alert("Digite uma tarefa!");
        return;
    }

    criarTarefa(input.value);

    input.value = "";
    input.focus();

    const filtroAtivo = document.querySelector(".filtro.ativo").dataset.filtro;
    filtrarTarefas(filtroAtivo);
}

btnLimpar.addEventListener("click", function () {
    const tarefas = document.querySelectorAll(".tarefa.concluida");

    if (tarefas.length === 0) {
        alert("Nenhuma tarefa concluída!");
        return;
    }

    if (confirm("Deseja remover todas as tarefas concluídas?")) {
        tarefas.forEach(function (tarefa) {
            tarefa.remove();
            atualizarInfoTarefas();
            salvarTarefas();
        });
    }
});

const filtros = document.querySelectorAll(".filtro");

filtros.forEach(function (botao) {
    botao.addEventListener("click", function () {
        filtros.forEach(function (btn) {
            btn.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        filtrarTarefas(botao.dataset.filtro);
    });
});

function filtrarTarefas(filtro) {
    const tarefas = document.querySelectorAll(".tarefa");

    tarefas.forEach(function (tarefa) {
        const concluida = tarefa.classList.contains("concluida");

        if (filtro === "todas") {
            tarefa.style.display = "flex";
        } else if (filtro === "pendentes" && !concluida) {
            tarefa.style.display = "flex";
        } else if (filtro === "concluidas" && concluida) {
            tarefa.style.display = "flex";
        } else {
            tarefa.style.display = "none";
        }
    });
}

document.getElementById("tarefa").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

function atualizarInfoTarefas() {

    const total = document.querySelectorAll(".tarefa").length;

    const concluidas = document.querySelectorAll(".tarefa.concluida").length;

    const info = document.getElementById("infotarefas");

    info.textContent = `${concluidas} tarefas de ${total} concluídas`;
}

function salvarTarefas() {

    const tarefas = [];

    document.querySelectorAll(".tarefa").forEach(function(item) {

        tarefas.push({
            texto: item.querySelector("span").textContent,
            concluida: item.classList.contains("concluida")
        });

    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

window.onload = function() {

    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];

    tarefasSalvas.forEach(function(tarefa) {

        criarTarefa(tarefa.texto, tarefa.concluida);

    });

};