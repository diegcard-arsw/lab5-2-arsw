var app = (function () {
    // Estado privado
    var author = null;
    var blueprints = [];

    // Cambia el autor seleccionado
    function setAuthor(newAuthor) {
        author = newAuthor;
    }

    // Devuelve el autor actual
    function getAuthor() {
        return author;
    }

    // Devuelve la lista de planos
    function getBlueprints() {
        return blueprints;
    }

    // Cambia la lista de planos
    function setBlueprints(newBlueprints) {
        blueprints = newBlueprints;
    }

    // API pública
    return {
        setAuthor: setAuthor,
        getAuthor: getAuthor,
        getBlueprints: getBlueprints,
        setBlueprints: setBlueprints
    };
})();
