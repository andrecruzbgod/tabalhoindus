const API_URL = 'http://localhost:5000';

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav ul li a').forEach(l => l.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    carregarDados();
}

async function carregarDados() {
    try {
        let res = await fetch(`${API_URL}/api/dados`);
        let dados = await res.json();
        
        let tbodyCargas = document.querySelector('#tabelaCargas tbody');
        let tbodyAcomp = document.querySelector('#tabelaAcompanhamento tbody');
        tbodyCargas.innerHTML = '';
        tbodyAcomp.innerHTML = '';

        let filtro = document.getElementById('filtroCarga').value.toLowerCase();
        dados.cargas.filter(c => c.desc.toLowerCase().includes(filtro)).forEach(c => {
            let badge = c.status === 'Pendente' ? 'bg-pendente' : (c.status === 'Em Transporte' ? 'bg-transporte' : 'bg-entregue');
            tbodyCargas.innerHTML += `<tr><td>${c.id}</td><td>${c.desc}</td><td>${c.dest}</td><td>${c.veiculo}</td><td><span class="status-badge ${badge}">${c.status}</span></td></tr>`;
            tbodyAcomp.innerHTML += `<tr><td>${c.id}</td><td>${c.desc}</td><td><span class="status-badge ${badge}">${c.status}</span></td><td><button onclick="mudarStatus(${c.id})" style="padding:2px 5px; font-size:10px;">Mudar</button></td></tr>`;
        });

        let tbodyVeic = document.querySelector('#tabelaVeiculos tbody');
        let selectVeic = document.getElementById('selectVeiculoCarga');
        tbodyVeic.innerHTML = '';
        selectVeic.innerHTML = '';
        dados.veiculos.forEach(v => {
            tbodyVeic.innerHTML += `<tr><td>${v.id}</td><td>${v.modelo}</td><td>${v.placa}</td></tr>`;
            selectVeic.innerHTML += `<option value="${v.modelo} (${v.placa})">${v.modelo} - ${v.placa}</option>`;
        });

        let tbodyMot = document.querySelector('#tabelaMotoristas tbody');
        tbodyMot.innerHTML = '';
        dados.motoristas.forEach(m => {
            tbodyMot.innerHTML += `<tr><td>${m.id}</td><td>${m.nome}</td><td>${m.cnh}</td></tr>`;
        });

        let tbodyRot = document.querySelector('#tabelaRotas tbody');
        tbodyRot.innerHTML = '';
        dados.rotas.forEach(r => {
            tbodyRot.innerHTML += `<tr><td>${r.id}</td><td>${r.origem}</td><td>${r.destino}</td><td>${r.km} Km</td></tr>`;
        });

        document.getElementById('apiStatus').innerText = "Online (Python conectado)";
    } catch (e) {
        document.getElementById('apiStatus').innerText = "Offline (Inicie o app.py)";
    }
}

async function addCarga(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/cargas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            desc: document.getElementById('descCarga').value,
            dest: document.getElementById('destCarga').value,
            veiculo: document.getElementById('selectVeiculoCarga').value || "Não atribuído"
        })
    });
    document.getElementById('formCarga').reset();
    carregarDados();
}

async function addVeiculo(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/veiculos`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            modelo: document.getElementById('modeloVeiculo').value,
            placa: document.getElementById('placaVeiculo').value
        })
    });
    document.getElementById('formVeiculo').reset();
    carregarDados();
}

async function addMotorista(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/motoristas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            nome: document.getElementById('nomeMotorista').value,
            cnh: document.getElementById('cnhMotorista').value
        })
    });
    document.getElementById('formMotorista').reset();
    carregarDados();
}

async function addRota(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/rotas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            origem: document.getElementById('origemRota').value,
            destino: document.getElementById('destinoRota').value,
            km: document.getElementById('kmRota').value
        })
    });
    document.getElementById('formRota').reset();
    carregarDados();
}

async function mudarStatus(id) {
    await fetch(`${API_URL}/api/cargas/${id}/status`, {method: 'PUT'});
    carregarDados();
}

window.onload = carregarDados;