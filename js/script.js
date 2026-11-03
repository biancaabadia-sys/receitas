// ===================================
// BUSCA DE RECEITAS (só roda na página receitas.html)
// ===================================

const searchInput = document.getElementById("searchInput");
const recipes = document.querySelectorAll(".recipe-card");
const resultado = document.getElementById("resultado");

if (searchInput) {

  searchInput.addEventListener("input", function () {

    const pesquisa = searchInput.value.toLowerCase().trim();
    let encontrou = false;

    recipes.forEach(function (recipe) {

      const nome = recipe.dataset.nome.toLowerCase();

      if (nome.includes(pesquisa)) {
        recipe.style.display = "flex";
        encontrou = true;
      } else {
        recipe.style.display = "none";
      }

    });

    if (pesquisa !== "" && !encontrou) {
      resultado.textContent = "Resultado indisponível.";
    } else {
      resultado.textContent = "";
    }

  });

}


// ===================================
// MENSAGEM DE STATUS DO FORMULÁRIO
// (só roda na página contato.html)
// ===================================

const statusMsg = document.getElementById("statusMsg");

if (statusMsg) {

  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  if (status === "sucesso") {
    statusMsg.textContent = "Sua mensagem foi enviada com sucesso!";
    statusMsg.style.display = "block";
  } else if (status === "erro") {
    statusMsg.textContent = "Não foi possível enviar sua mensagem. Preencha todos os campos e tente novamente.";
    statusMsg.style.display = "block";
  }

}

const formularioReceita = document.getElementById("form-receita");
const listaReceitas = document.getElementById("lista-receitas");
const API_RECEITAS = "http://localhost:5000/receitas";

if (formularioReceita && listaReceitas) {

  async function listarReceitasAPI() {
    try {
      const resposta = await fetch(API_RECEITAS);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar receitas.");
      }

      const receitas = await resposta.json();
      listaReceitas.replaceChildren();

      receitas.forEach(function(receita) {
        const card = document.createElement("article");
        const titulo = document.createElement("h3");
        const categoria = document.createElement("p");
        const ingredientes = document.createElement("p");
        const preparo = document.createElement("p");

        card.className = "recipe-card";
        titulo.textContent = receita.nome;
        categoria.textContent = "Categoria: " + receita.categoria;
        ingredientes.textContent = "Ingredientes: " + receita.ingredientes;
        preparo.textContent = "Modo de preparo: " + receita.modo_preparo;

        card.append(titulo, categoria, ingredientes, preparo);
        listaReceitas.appendChild(card);
      });

    } catch (erro) {
      console.error(erro);
    }
  }

  formularioReceita.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const mensagem = document.getElementById("mensagem");

    const dados = {
      nome: document.getElementById("nome").value.trim(),
      categoria: document.getElementById("categoria").value,
      ingredientes: document.getElementById("ingredientes").value.trim(),
      modo_preparo: document.getElementById("modo-preparo").value.trim()
    };

    try {
      const resposta = await fetch(API_RECEITAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao cadastrar receita.");
      }

      if (mensagem) {
        mensagem.textContent = "Receita cadastrada com sucesso!";
      }

      formularioReceita.reset();
      await listarReceitasAPI();

    } catch (erro) {
      console.error(erro);

      if (mensagem) {
        mensagem.textContent = erro.message;
      }
    }
  });

  listarReceitasAPI();
}
