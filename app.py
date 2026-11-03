
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def conectar():
    banco = sqlite3.connect("receitas.db")
    banco.row_factory = sqlite3.Row
    return banco

def criar_tabela():
    with conectar() as banco:
        banco.execute("""
            CREATE TABLE IF NOT EXISTS receitas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                categoria TEXT NOT NULL,
                ingredientes TEXT NOT NULL,
                modo_preparo TEXT NOT NULL
            )
        """)

@app.route("/receitas", methods=["GET"])
def listar_receitas():
    with conectar() as banco:
        dados = banco.execute(
            "SELECT * FROM receitas ORDER BY id DESC"
        ).fetchall()
    return jsonify([dict(r) for r in dados])

@app.route("/receitas", methods=["POST"])
def cadastrar_receita():
    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return jsonify({"erro": "Dados inválidos"}), 400

    campos = ["nome", "categoria", "ingredientes", "modo_preparo"]

    if any(
        not isinstance(dados.get(c), str) or not dados[c].strip()
        for c in campos
    ):
        return jsonify({"erro": "Preencha todos os campos"}), 400

    with conectar() as banco:
        cursor = banco.execute("""
            INSERT INTO receitas
            (nome, categoria, ingredientes, modo_preparo)
            VALUES (?, ?, ?, ?)
        """, tuple(dados[c].strip() for c in campos))

        receita = banco.execute(
            "SELECT * FROM receitas WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

    return jsonify(dict(receita)), 201

if __name__ == "__main__":
    criar_tabela()
    app.run(debug=True)
