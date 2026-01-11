
export function barajarLista(array) {
    let copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}


export function reproducirVoz(texto, idioma) {
    // Definimos las voces masculinas según el idioma que pases
    let nombreVoz = "UK English Male"; // Por defecto inglés

    if (idioma === 'es-ES') {
        nombreVoz = "Spanish Female";
    } else if (idioma === 'en-US') {
        nombreVoz = "US English Male";
    }

    if (window.responsiveVoice) {
        responsiveVoice.speak(texto, nombreVoz, {
            pitch: 1,  // Tono normal
            rate: 1    // Velocidad normal
        });
    } else {
        console.warn("ResponsiveVoice no está cargado aún.");
    }
}

/**
 * Detiene el intervalo de repetición y silencia la API
 */
export function detenerAudio(intervalo) {
    // 1. Limpiamos el intervalo de tu script principal
    if (intervalo) {
        clearInterval(intervalo);
    }
    
    // 2. Cancelamos cualquier voz activa en la API
    if (window.responsiveVoice) {
        responsiveVoice.cancel();
    }
}