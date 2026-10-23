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
