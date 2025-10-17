var app = (function () {
    // Estado privado
    var author = null;
    var blueprints = [];
    var currentBlueprint = null;
    var isNewBlueprint = false;
    var canvas = null;
    var ctx = null;

    // Función privada para limpiar la tabla
    function clearTable() {
        $("#blueprints-table tbody").empty();
        $("#table-container").hide();
        $("#total-points").hide();
        $("#blueprint-actions").hide();
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
        $("#blueprint-actions").show();
        updateTotalPoints();
    }

    // Función para configurar el canvas con eventos de click
    function setupCanvasEvents() {
        if (!canvas || !ctx) return;

        // Limpiar eventos previos
        canvas.onpointerdown = null;
        canvas.onclick = null;

        // Configurar evento de click para agregar puntos
        canvas.addEventListener('click', function(event) {
            if (!currentBlueprint) {
                alert('No hay un plano seleccionado. Abra un plano o cree uno nuevo.');
                return;
            }

            var rect = canvas.getBoundingClientRect();
            var scaleX = 100 / canvas.width;
            var scaleY = 100 / canvas.height;
            
            var x = Math.round((event.clientX - rect.left) * scaleX);
            var y = Math.round((event.clientY - rect.top) * scaleY);

            // Agregar punto al final de la secuencia
            currentBlueprint.points.push({x: x, y: y});
            
            // Redibujar el canvas
            drawBlueprintOnCanvas(currentBlueprint);
            
            // Habilitar botón Save/Update
            $("#save-blueprint").prop('disabled', false);
        });
    }

    // Función para dibujar un plano en el canvas
    function drawBlueprintOnCanvas(blueprint) {
        if (!canvas || !ctx) return;

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
        }
        
        // Dibujar puntos
        ctx.fillStyle = '#FF5722';
        for (var i = 0; i < blueprint.points.length; i++) {
            ctx.beginPath();
            ctx.arc(blueprint.points[i].x * (canvas.width / 100), blueprint.points[i].y * (canvas.height / 100), 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Función para actualizar el listado de planos desde el API REST
    function updateBlueprints(authorName) {
        setAuthor(authorName);
        
        // Usar jQuery AJAX para consultar el API REST
        return $.get("/blueprints/" + authorName)
            .done(function(data) {
                if (data && data.length > 0) {
                    // Convertir los planos usando map
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

    // Función para dibujar un plano en modal
    function drawBlueprint(blueprint) {
        currentBlueprint = {
            author: blueprint.author,
            name: blueprint.name,
            points: JSON.parse(JSON.stringify(blueprint.points)) // Copia profunda
        };
        isNewBlueprint = false;

        // Crear ventana modal para mostrar el plano
        var modalHtml = '<div class="modal fade" id="blueprintModal" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog modal-lg" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h4 class="modal-title">Plano: ' + blueprint.name + ' (Autor: ' + blueprint.author + ')</h4>' +
            '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p class="text-info"><strong>Instrucciones:</strong> Haga clic en el canvas para agregar puntos al plano.</p>' +
            '<canvas id="blueprintCanvas" width="600" height="400" style="border: 2px solid #007bff; cursor: crosshair;"></canvas>' +
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
        
        // Configurar canvas después de que se muestre el modal
        $('#blueprintModal').on('shown.bs.modal', function() {
            canvas = document.getElementById('blueprintCanvas');
            ctx = canvas.getContext('2d');
            
            drawBlueprintOnCanvas(currentBlueprint);
            setupCanvasEvents();
            
            // Actualizar información del plano actual
            $("#current-blueprint-name").text(currentBlueprint.name);
            $("#current-blueprint-info").show();
            
            // Habilitar botones
            $("#save-blueprint").prop('disabled', false);
            $("#delete-blueprint").prop('disabled', false);
        });

        // Limpiar cuando se cierre el modal
        $('#blueprintModal').on('hidden.bs.modal', function() {
            currentBlueprint = null;
            canvas = null;
            ctx = null;
            $("#current-blueprint-info").hide();
            $("#save-blueprint").prop('disabled', true);
            $("#delete-blueprint").prop('disabled', true);
        });
    }

    // Función para crear un nuevo plano
    function createNewBlueprint() {
        var blueprintName = prompt("Ingrese el nombre del nuevo plano:");
        if (!blueprintName || blueprintName.trim() === "") {
            alert("Debe ingresar un nombre válido para el plano.");
            return;
        }

        if (!author) {
            alert("Primero debe seleccionar un autor.");
            return;
        }

        currentBlueprint = {
            author: author,
            name: blueprintName.trim(),
            points: []
        };
        isNewBlueprint = true;

        // Crear modal para nuevo plano
        var modalHtml = '<div class="modal fade" id="blueprintModal" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog modal-lg" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h4 class="modal-title">Nuevo Plano: ' + blueprintName + ' (Autor: ' + author + ')</h4>' +
            '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p class="text-success"><strong>Modo creación:</strong> Haga clic en el canvas para agregar puntos al nuevo plano.</p>' +
            '<canvas id="blueprintCanvas" width="600" height="400" style="border: 2px solid #28a745; cursor: crosshair;"></canvas>' +
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
        
        // Configurar canvas
        $('#blueprintModal').on('shown.bs.modal', function() {
            canvas = document.getElementById('blueprintCanvas');
            ctx = canvas.getContext('2d');
            
            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setupCanvasEvents();
            
            // Actualizar información del plano actual
            $("#current-blueprint-name").text(currentBlueprint.name + " (NUEVO)");
            $("#current-blueprint-info").show();
            
            // Habilitar solo el botón Save (no Delete para planos nuevos)
            $("#save-blueprint").prop('disabled', true); // Habilitado cuando agregue puntos
            $("#delete-blueprint").prop('disabled', true);
        });

        // Limpiar cuando se cierre el modal
        $('#blueprintModal').on('hidden.bs.modal', function() {
            currentBlueprint = null;
            canvas = null;
            ctx = null;
            isNewBlueprint = false;
            $("#current-blueprint-info").hide();
            $("#save-blueprint").prop('disabled', true);
            $("#delete-blueprint").prop('disabled', true);
        });
    }

    // Función para guardar o actualizar un plano usando promesas
    function saveOrUpdateBlueprint() {
        if (!currentBlueprint) {
            alert("No hay un plano seleccionado para guardar.");
            return;
        }

        if (currentBlueprint.points.length === 0) {
            alert("El plano debe tener al menos un punto.");
            return;
        }

        var promise;
        
        if (isNewBlueprint) {
            // Crear nuevo plano con POST
            promise = $.ajax({
                url: "/blueprints",
                type: 'POST',
                data: JSON.stringify(currentBlueprint),
                contentType: "application/json"
            });
        } else {
            // Actualizar plano existente con PUT
            promise = $.ajax({
                url: "/blueprints/" + currentBlueprint.author + "/" + currentBlueprint.name,
                type: 'PUT',
                data: JSON.stringify(currentBlueprint),
                contentType: "application/json"
            });
        }

        // Encadenar operaciones con promesas
        promise
            .then(function() {
                // Después de guardar, actualizar la lista de planos
                return updateBlueprints(author);
            })
            .then(function() {
                // Después de actualizar la lista, mostrar mensaje de éxito
                alert(isNewBlueprint ? "Plano creado exitosamente." : "Plano actualizado exitosamente.");
                
                // Cerrar modal
                $('#blueprintModal').modal('hide');
                
                // Resetear estado
                isNewBlueprint = false;
                $("#save-blueprint").prop('disabled', true);
            })
            .catch(function(xhr) {
                var errorMessage = "Error al guardar el plano. ";
                if (xhr.status === 403) {
                    errorMessage += "Ya existe un plano con ese nombre.";
                } else if (xhr.status === 404) {
                    errorMessage += "No se encontró el recurso.";
                } else {
                    errorMessage += "Código: " + xhr.status;
                }
                alert(errorMessage);
            });
    }

    // Función para eliminar un plano usando promesas
    function deleteBlueprint() {
        if (!currentBlueprint || isNewBlueprint) {
            alert("No hay un plano válido para eliminar.");
            return;
        }

        if (!confirm("¿Está seguro de que desea eliminar el plano '" + currentBlueprint.name + "'?")) {
            return;
        }

        // Eliminar plano con DELETE
        $.ajax({
            url: "/blueprints/" + currentBlueprint.author + "/" + currentBlueprint.name,
            type: 'DELETE'
        })
        .then(function() {
            // Después de eliminar, actualizar la lista de planos
            return updateBlueprints(author);
        })
        .then(function() {
            // Mostrar mensaje de éxito
            alert("Plano eliminado exitosamente.");
            
            // Cerrar modal
            $('#blueprintModal').modal('hide');
        })
        .catch(function(xhr) {
            var errorMessage = "Error al eliminar el plano. ";
            if (xhr.status === 404) {
                errorMessage += "No se encontró el plano.";
            } else {
                errorMessage += "Código: " + xhr.status;
            }
            alert(errorMessage);
        });
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

        // Evento para crear nuevo plano
        $('#create-blueprint').click(function() {
            createNewBlueprint();
        });

        // Evento para guardar/actualizar plano
        $('#save-blueprint').click(function() {
            saveOrUpdateBlueprint();
        });

        // Evento para eliminar plano
        $('#delete-blueprint').click(function() {
            deleteBlueprint();
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