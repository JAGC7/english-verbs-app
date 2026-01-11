import { reproducirVoz } from './helpers.js';

const JuegoVerbos = {
    hits: 0,
    misses: 0,
    currentVerbType: "",
    baseDeDatos: null,
    rutaJson: '../data/verbs.json',

    async cargarDatos() {
        if (!this.baseDeDatos) {
            try {
                const respuesta = await fetch(this.rutaJson);
                this.baseDeDatos = await respuesta.json();
            } catch (error) {
                console.error("Error cargando el JSON:", error);
            }
        }
    },

    async iniciar() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        mainContent.innerHTML = ""; 

        const wrapper = document.createElement('div');
        wrapper.className = 'game-container';
        wrapper.innerHTML = `
            <div class="game-score-row">
                <div class="score-pill success">
                    <span class="label">ACIERTOS</span>
                    <span id="hits-count" class="value">${this.hits}</span>
                </div>
                <div class="score-pill danger">
                    <span class="label">FALLOS</span>
                    <span id="misses-count" class="value">${this.misses}</span>
                </div>
            </div>

            <div class="verb-card" id="v-card">
                <p class="game-instruction">¿Qué tipo de verbo es?</p>
                <h2 id="target-verb">Cargando...</h2>
            </div>

            <div class="game-actions">
                <button id="btn-regular" class="game-btn btn-reg">REGULAR</button>
                <button id="btn-irregular" class="game-btn btn-irr">IRREGULAR</button>
            </div>
        `;
        mainContent.appendChild(wrapper);

        await this.cargarDatos();
        this.nuevoVerbo();

        document.getElementById('btn-regular').onclick = () => this.validar('regular');
        document.getElementById('btn-irregular').onclick = () => this.validar('irregular');
    },

    nuevoVerbo() {
        const tipos = ['regular', 'irregular'];
        const tipoAzar = tipos[Math.floor(Math.random() * tipos.length)];
        const lista = this.baseDeDatos[tipoAzar];
        const verbo = lista[Math.floor(Math.random() * lista.length)];

        document.getElementById('target-verb').innerText = verbo.word;
        this.currentVerbType = tipoAzar;
        reproducirVoz(verbo.word, 'en-US');
    },

    validar(eleccion) {
        if (eleccion === this.currentVerbType) {
            this.hits++;
            document.getElementById('hits-count').innerText = this.hits;
            this.efectoVisual('success');
        } else {
            this.misses++;
            document.getElementById('misses-count').innerText = this.misses;
            this.efectoVisual('danger');
        }
        setTimeout(() => this.nuevoVerbo(), 400);
    },

    efectoVisual(clase) {
        const card = document.getElementById('v-card');
        card.classList.add(clase);
        setTimeout(() => card.classList.remove(clase), 400);
    }
};

export { JuegoVerbos };