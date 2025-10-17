var app = (function () {
    // Estado privado
    var author = null;
    var blueprints = [];

    // Función privada para limpiar la tabla
    function clearTable() {
        $("#blueprints-table tbody").empty();
        $("#table-container").hide();
        $("#total-points").hide();
    }

    // Función privada para mostrar mensaje de error
    function showError(message) {
        $("#author-name").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-exclamation-sign"></span> ' + message + '</div>');
        clearTable();
    }

    // Función privada para mostrar información del autor
    function showAuthorInfo(authorName) {
        $("#author-name").html('<div class="alert alert-success"><span class="glyphicon glyphicon-user"></span> <strong>Planos encontrados para: ' + authorName + '</strong></div>');
    }

    // Función privada para calcular y mostrar el total de puntos
    function updateTotalPoints() {
        var totalPoints = blueprints.reduce(function(total, blueprint) {
            return total + blueprint.points.length;
        }, 0);
        $("#total-points").html('<span class="glyphicon glyphicon-stats"></span> <strong>Total de puntos de todos los planos: ' + totalPoints + '</strong>');
        $("#total-points").show();
    }

    // Función privada para crear fila de la tabla
    function createTableRow(blueprint) {
        var row = '<tr>' +
            '<td><span class="glyphicon glyphicon-file"></span> ' + blueprint.name + '</td>' +
            '<td><span class="badge">' + blueprint.points.length + '</span></td>' +
            '<td><button class="btn btn-info btn-sm btn-open" onclick="app.openBlueprint(\'' + 
            blueprint.author + '\', \'' + blueprint.name + '\')">' +
            '<span class="glyphicon glyphicon-eye-open"></span> Open</button></td>' +
            '</tr>';
        return row;
    }

    // Función privada para actualizar la tabla
    function updateBlueprintsTable() {
        clearTable();
        
        blueprints.map(function(blueprint) {
            var row = createTableRow(blueprint);
            $("#blueprints-table tbody").append(row);
        });
        
        $("#table-container").show();
        updateTotalPoints();
    }

    // Función para cambiar el autor seleccionado
    function setAuthor(newAuthor) {
        author = newAuthor;
    }

    // Función para obtener el autor actual
    function getAuthor() {
        return author;
    }

    // Función para obtener la lista de planos
    function getBlueprints() {
        return blueprints;
    }

    // Función para actualizar el listado de planos desde el API REST
    function updateBlueprints(authorName) {
        setAuthor(authorName);
        
        // Usar jQuery AJAX para consultar el API REST
        $.get("/blueprints/" + authorName)
            .done(function(data) {
                if (data && data.length > 0) {
                    // Convertir los planos a objetos con solo nombre y número de puntos
                    blueprints = data.map(function(blueprint) {
                        return {
                            author: blueprint.author,
                            name: blueprint.name,
                            points: blueprint.points
                        };
                    });
                    
                    showAuthorInfo(authorName);
                    updateBlueprintsTable();
                } else {
                    showError('No se encontraron planos para el autor: ' + authorName);
                    blueprints = [];
                }
            })
            .fail(function(xhr) {
                if (xhr.status === 404) {
                    showError('No se encontraron planos para el autor: ' + authorName);
                } else {
                    showError('Error al consultar los planos. Código: ' + xhr.status);
                }
                blueprints = [];
            });
    }

    // Función para abrir un plano específico usando el API REST
    function openBlueprint(authorName, blueprintName) {
        $.get("/blueprints/" + authorName + "/" + blueprintName)
            .done(function(blueprint) {
                if (blueprint) {
                    drawBlueprint(blueprint);
                } else {
                    alert('No se pudo cargar el plano: ' + blueprintName);
                }
            })
            .fail(function(xhr) {
                if (xhr.status === 404) {
                    alert('No se encontró el plano: ' + blueprintName);
                } else {
                    alert('Error al cargar el plano. Código: ' + xhr.status);
                }
            });
    }

    // Función para dibujar un plano
    function drawBlueprint(blueprint) {
        // Crear ventana modal para mostrar el plano
        var modalHtml = '<div class="modal fade" id="blueprintModal" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog modal-lg" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h4 class="modal-title">Plano: ' + blueprint.name + ' (Autor: ' + blueprint.author + ')</h4>' +
            '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<canvas id="blueprintCanvas" width="600" height="400" style="border: 1px solid #ccc;"></canvas>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        // Remover modal anterior si existe
        $('#blueprintModal').remove();
        
        // Agregar el nuevo modal al body
        $('body').append(modalHtml);
        
        // Mostrar el modal
        $('#blueprintModal').modal('show');
        
        // Dibujar en el canvas después de que se muestre el modal
        $('#blueprintModal').on('shown.bs.modal', function() {
            var canvas = document.getElementById('blueprintCanvas');
            var ctx = canvas.getContext('2d');
            
            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Configurar estilo de línea
            ctx.strokeStyle = '#2196F3';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            
            if (blueprint.points && blueprint.points.length > 1) {
                ctx.beginPath();
                
                // Escalar puntos para que se vean bien en el canvas
                var scaleX = canvas.width / 100;
                var scaleY = canvas.height / 100;
                
                // Mover al primer punto
                ctx.moveTo(blueprint.points[0].x * scaleX, blueprint.points[0].y * scaleY);
                
                // Dibujar líneas a los demás puntos
                for (var i = 1; i < blueprint.points.length; i++) {
                    ctx.lineTo(blueprint.points[i].x * scaleX, blueprint.points[i].y * scaleY);
                }
                
                ctx.stroke();
                
                // Dibujar puntos
                ctx.fillStyle = '#FF5722';
                for (var i = 0; i < blueprint.points.length; i++) {
                    ctx.beginPath();
                    ctx.arc(blueprint.points[i].x * scaleX, blueprint.points[i].y * scaleY, 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        });
    }

    // Inicialización cuando el documento esté listo
    $(document).ready(function() {
        // Asociar evento click al botón de consulta
        $('#get-blueprints').click(function() {
            var authorName = $('#author-input').val().trim();
            if (authorName) {
                updateBlueprints(authorName);
            } else {
                showError('Por favor, ingrese el nombre del autor');
            }
        });

        // Permitir buscar con Enter
        $('#author-input').keypress(function(e) {
            if (e.which === 13) {
                $('#get-blueprints').click();
            }
        });
    });

    // API pública
    return {
        setAuthor: setAuthor,
        getAuthor: getAuthor,
        getBlueprints: getBlueprints,
        updateBlueprints: updateBlueprints,
        openBlueprint: openBlueprint
    };
})();
