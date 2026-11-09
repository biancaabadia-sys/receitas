
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Conexao com o banco de dados MySQL
def conectar():
    banco = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # Coloque sua senha do MySQL
        database="sabor_da_casa"
    )
    return banco


# Criar as tabelas do banco de dados
def criar_tabela():
    banco = conectar()
    cursor = banco.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS receitas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(150) NOT NULL,
            categoria VARCHAR(100) NOT NULL,
            ingredientes TEXT NOT NULL,
            modo_preparo TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS mensagens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            comentario TEXT NOT NULL,
            data_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    banco.commit()
    cursor.close()
    banco.close()


# Listar todas as receitas
@app.route("/receitas", methods=["GET"])
def listar_receitas():

    banco = conectar()
    cursor = banco.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM receitas ORDER BY id DESC"
    )

    dados = cursor.fetchall()

    cursor.close()
    banco.close()

    return jsonify(dados)


# Cadastrar uma nova receita
@app.route("/receitas", methods=["POST"])
def cadastrar_receita():

    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return jsonify({"erro": "Dados inválidos"}), 400

    campos = [
        "nome",
        "categoria",
        "ingredientes",
        "modo_preparo"
    ]

    # Verificar se todos os campos foram preenchidos
    if any(
        not isinstance(dados.get(c), str) or not dados[c].strip()
        for c in campos
    ):
        return jsonify({"erro": "Preencha todos os campos"}), 400

    banco = conectar()
    cursor = banco.cursor(dictionary=True)

    # Inserir a receita no banco
    cursor.execute("""
        INSERT INTO receitas
        (nome, categoria, ingredientes, modo_preparo)
        VALUES (%s, %s, %s, %s)
    """, tuple(dados[c].strip() for c in campos))

    banco.commit()

    # Buscar a receita cadastrada
    cursor.execute(
        "SELECT * FROM receitas WHERE id = %s",
        (cursor.lastrowid,)
    )

    receita = cursor.fetchone()

    cursor.close()
    banco.close()

    return jsonify(receita), 201


# Iniciar o servidor
if __name__ == "__main__":
    criar_tabela()
    app.run(debug=True)
