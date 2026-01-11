import { barajarLista, reproducirVoz, detenerAudio } from './helpers.js';
import { JuegoVerbos } from './game.js';

console.log("¡Script con ResponsiveVoice cargado correctamente!");

let baseDeDatosVerbos = null;
let intervaloVoz = null; // Guardará el ID del setInterval para poder frenarlo
const RUTA_JSON = '../data/verbs.json';

/**
 * Función principal para asignar eventos a los botones de categorías
 */
async function asignarEventoVerbo(idBtn, grupo, key, langVoz) {
    const boton = document.getElementById(idBtn);
    if (!boton) return;

    boton.addEventListener('click', async () => {
        const nombreLimpio = idBtn.replace('-', ' ').toUpperCase();
        if (!confirm(`¿Deseas cargar la lista de: ${nombreLimpio}?`)) return;

        try {
            if (!baseDeDatosVerbos) {
                const modulo = await import(RUTA_JSON, { assert: { type: 'json' } });
                baseDeDatosVerbos = modulo.default;
            }

            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = ""; 

            const tituloFijo = document.createElement('div');
            tituloFijo.className = 'sticky-title';
            tituloFijo.innerHTML = `<span>📖</span> ${nombreLimpio}`;
            mainContent.appendChild(tituloFijo);

            const lista = barajarLista(baseDeDatosVerbos[grupo]);

            lista.forEach((verbo, index) => {
                
                // --- LÓGICA DE FILTRADO ---
                let loQueSeEscucha = verbo[key];
                let loQueSeEscribe = verbo[key];

                // Solo intercambiamos si la columna es 'word' o 'translateWord'
                if (key === 'word') {
                    // Escuchas inglés -> Escribes español
                    loQueSeEscribe = verbo['translateWord'];
                } 
                else if (key === 'translateWord') {
                    // Escuchas español -> Escribes inglés
                    loQueSeEscribe = verbo['word'];
                }
                // Si la 'key' es past, gerund, etc., los valores se quedan iguales.

                const container = document.createElement('div');
                container.className = 'verb-input-group';
                container.innerHTML = `
                    <span class="verb-number">${index + 1}</span>
                    <input type="text" class="verb-input" 
                           data-listen="${loQueSeEscucha}" 
                           data-correct="${loQueSeEscribe}">
                `;

                const input = container.querySelector('input');

                input.addEventListener('focus', () => {
                    detenerAudio(intervaloVoz); 
                    const palabraAAudio = input.getAttribute('data-listen');
                    
                    intervaloVoz = setInterval(() => {
                        reproducirVoz(palabraAAudio, langVoz);
                    }, 1200);
                });

                input.addEventListener('input', () => {
                    const valorUsuario = input.value.trim().toLowerCase();
                    const valorCorrecto = input.getAttribute('data-correct').toLowerCase();

                    if (valorUsuario === valorCorrecto) {
                        input.style.border = "none"; 
                        input.classList.add('success');
                        container.classList.add('success-border');
                        input.disabled = true;
                        detenerAudio(intervaloVoz);
                    }
                });

                input.addEventListener('blur', () => detenerAudio(intervaloVoz));
                mainContent.appendChild(container);
            });

        } catch (error) {
            console.error("Error:", error);
        }
    });
}

/**
 * Inicializador al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando aplicación...");
    
    // Configuración para VERBOS REGULARES
    // Nota: 'es-ES' activará la voz masculina en español dentro del helper
    asignarEventoVerbo('reg-word',       'regular', 'word',           'en-US');
    asignarEventoVerbo('reg-translate',  'regular', 'translateWord',  'es-ES');
    asignarEventoVerbo('reg-third',      'regular', 'thirdPerson',    'en-US');
    asignarEventoVerbo('reg-past',       'regular', 'past',           'en-US');
    asignarEventoVerbo('reg-participle', 'regular', 'pastParticiple', 'en-US');
    asignarEventoVerbo('reg-gerund',     'regular', 'gerund',         'en-US');

    // Configuración para VERBOS IRREGULARES
    asignarEventoVerbo('irr-word',       'irregular', 'word',           'en-US');
    asignarEventoVerbo('irr-translate',  'irregular', 'translateWord',  'es-ES'); 
    asignarEventoVerbo('irr-third',      'irregular', 'thirdPerson',    'en-US');
    asignarEventoVerbo('irr-past',       'irregular', 'past',           'en-US');
    asignarEventoVerbo('irr-participle', 'irregular', 'pastParticiple', 'en-US');
    asignarEventoVerbo('irr-gerund',     'irregular', 'gerund',         'en-US');

    // Botón extra de lógica de juego
    const btnTipo = document.getElementById('btn-tipo');
    if (btnTipo) {
        btnTipo.onclick = () => JuegoVerbos.iniciar();
    }
});