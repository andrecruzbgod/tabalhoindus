from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

banco = {
    "cargas": [
        {"id": 1, "desc": "Bobina de Aço Industrial", "dest": "Filial Joinville - SC", "veiculo": "Volvo FH (ABC-1234)", "status": "Pendente"}
    ],
    "veiculos": [
        {"id": 1, "modelo": "Volvo FH 540", "placa": "ABC-1234"}
    ],
    "motoristas": [
        {"id": 1, "nome": "Carlos Silva", "cnh": "12345678900"}
    ],
    "rotas": [
        {"id": 1, "origem": "Curitiba - PR", "destino": "Joinville - SC", "km": "130"}
    ]
}

@app.route('/api/dados', methods=['GET'])
def get_dados():
    return jsonify(banco)

@app.route('/api/cargas', methods=['POST'])
def add_carga():
    dados = request.json
    nova_carga = {
        "id": len(banco["cargas"]) + 1,
        "desc": dados.get("desc"),
        "dest": dados.get("dest"),
        "veiculo": dados.get("veiculo", "Não atribuído"),
        "status": "Pendente"
    }
    banco["cargas"].append(nova_carga)
    return jsonify({"mensagem": "Sucesso", "carga": nova_carga}), 201

@app.route('/api/cargas/<int:id_carga>/status', methods=['PUT'])
def mudar_status(id_carga):
    for carga in banco["cargas"]:
        if carga["id"] == id_carga:
            if carga["status"] == "Pendente":
                carga["status"] = "Em Transporte"
            elif carga["status"] == "Em Transporte":
                carga["status"] = "Entregue"
            else:
                carga["status"] = "Pendente"
            return jsonify({"mensagem": "Atualizado", "carga": carga})
    return jsonify({"erro": "Não encontrado"}), 404

@app.route('/api/veiculos', methods=['POST'])
def add_veiculo():
    dados = request.json
    novo = {
        "id": len(banco["veiculos"]) + 1,
        "modelo": dados.get("modelo"),
        "placa": dados.get("placa")
    }
    banco["veiculos"].append(novo)
    return jsonify({"mensagem": "Sucesso"}), 201

@app.route('/api/motoristas', methods=['POST'])
def add_motorista():
    dados = request.json
    novo = {
        "id": len(banco["motoristas"]) + 1,
        "nome": dados.get("nome"),
        "cnh": dados.get("cnh")
    }
    banco["motoristas"].append(novo)
    return jsonify({"mensagem": "Sucesso"}), 201

@app.route('/api/rotas', methods=['POST'])
def add_rota():
    dados = request.json
    novo = {
        "id": len(banco["rotas"]) + 1,
        "origem": dados.get("origem"),
        "destino": dados.get("destino"),
        "km": dados.get("km")
    }
    banco["rotas"].append(novo)
    return jsonify({"mensagem": "Sucesso"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)