<?php
// config.php
// Configurações e conexão com o banco de dados usando PDO.

$host = '127.0.0.1';
$dbname = 'sabor_da_casa'; // nome do banco criado no phpMyAdmin
$usuario = 'root';             // usuário padrão do XAMPP
$senha = '';                   // senha padrão do XAMPP (geralmente vazia)

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $usuario,
        $senha
    );

    // Faz o PDO lançar exceções em caso de erro, em vez de falhar silenciosamente
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}
