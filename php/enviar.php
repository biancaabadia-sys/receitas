<?php
// enviar.php
// Recebe os dados do formulário de contato e salva no banco de dados.

require 'config.php'; // cria a variável $pdo já conectada

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $comentario = trim($_POST['comentario'] ?? '');

    // Se algum campo estiver vazio, volta para o formulário com aviso de erro
    if ($nome === '' || $email === '' || $comentario === '') {
        header("Location: ../pages/contato.html?status=erro");
        exit;
    }

    try {
        // Prepared statement: nunca concatenar os dados do usuário na query
        $stmt = $pdo->prepare("INSERT INTO mensagens (nome, email, comentario) VALUES (:nome, :email, :comentario)");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':comentario', $comentario);
        $stmt->execute();

        // Volta para o formulário com aviso de sucesso
        header("Location: ../pages/contato.html?status=sucesso");
        exit;

    } catch (PDOException $e) {
        die("Erro ao salvar a mensagem: " . $e->getMessage());
    }

} else {
    // Bloqueia acesso direto via GET
    header("Location: ../pages/contato.html");
    exit;
}
