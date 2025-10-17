package edu.eci.arsw.blueprints.services;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.eci.arsw.blueprints.exceptions.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.exceptions.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.filters.BlueprintFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;

/**
 * Servicio para la gestión de planos
 */
@Service
public class BlueprintsServices {

    @Autowired
    private BlueprintsPersistence blueprintsPersistence;

    @Autowired
    private BlueprintFilter blueprintFilter;

    /**
     * Registra un nuevo plano
     * @param bp el plano a registrar
     * @throws BlueprintPersistenceException si ya existe un plano con el mismo nombre y autor
     */
    public void addNewBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        blueprintsPersistence.saveBlueprint(bp);
    }

    /**
     * Obtiene todos los planos del sistema aplicando filtros
     * @return conjunto de todos los planos filtrados
     */
    public Set<Blueprint> getAllBlueprints() {
        Set<Blueprint> blueprints = blueprintsPersistence.getAllBlueprints();
        return blueprints.stream()
                .map(bp -> blueprintFilter.filter(bp))
                .collect(Collectors.toSet());
    }

    /**
     * Obtiene un plano específico por autor y nombre, aplicando filtros
     * @param author el autor del plano
     * @param name el nombre del plano
     * @return el plano encontrado y filtrado
     * @throws BlueprintNotFoundException si no se encuentra el plano
     */
    public Blueprint getBlueprint(String author, String name) throws BlueprintNotFoundException {
        Blueprint blueprint = blueprintsPersistence.getBlueprint(author, name);
        return blueprintFilter.filter(blueprint);
    }

    /**
     * Obtiene todos los planos de un autor específico, aplicando filtros
     * @param author el autor de los planos
     * @return conjunto de planos del autor filtrados
     * @throws BlueprintNotFoundException si no se encuentran planos para el autor
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> blueprints = blueprintsPersistence.getBlueprintsByAuthor(author);
        return blueprints.stream()
                .map(bp -> blueprintFilter.filter(bp))
                .collect(Collectors.toSet());
    }

    /**
     * Actualiza un plano existente
     * @param author el autor del plano
     * @param blueprintName el nombre del plano
     * @param blueprint el plano actualizado
     * @throws BlueprintNotFoundException si no se encuentra el plano a actualizar
     */
    public void updateBlueprint(String author, String blueprintName, Blueprint blueprint) throws BlueprintNotFoundException {
        blueprintsPersistence.updateBlueprint(author, blueprintName, blueprint);
    }
}