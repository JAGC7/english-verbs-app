document.addEventListener('DOMContentLoaded', () => {
    const btnLimpiar = document.getElementById('btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.onclick = () => {
            if (confirm("¿Estás seguro de que quieres limpiar la pantalla? Perderás tu progreso actual.")) {
                document.getElementById('main-content').innerHTML = "";
                detenerAudio(intervaloVoz);
                console.log("Pantalla limpiada");
            }
        }
    }
});