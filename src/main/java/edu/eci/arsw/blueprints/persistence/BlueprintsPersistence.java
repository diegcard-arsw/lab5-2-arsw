package edu.eci.arsw.blueprints.persistence;

import java.util.Set;

import edu.eci.arsw.blueprints.exceptions.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.exceptions.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.model.Blueprint;

/**
 * Interface para la persistencia de planos
 */
public interface BlueprintsPersistence {

    /**
     * Guarda un nuevo plano
     * @param bp el plano a guardar
     * @throws BlueprintPersistenceException si ya existe un plano con el mismo nombre y autor
     */
    void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException;

    /**
     * Obtiene un plano específico por autor y nombre
     * @param author el autor del plano
     * @param blueprintName el nombre del plano
     * @return el plano encontrado
     * @throws BlueprintNotFoundException si no se encuentra el plano
     */
    Blueprint getBlueprint(String author, String blueprintName) throws BlueprintNotFoundException;

    /**
     * Obtiene todos los planos de un autor específico
     * @param author el autor de los planos
     * @return conjunto de planos del autor
     * @throws BlueprintNotFoundException si no se encuentran planos para el autor
     */
    Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException;

    /**
     * Obtiene todos los planos del sistema
     * @return conjunto de todos los planos
     */
    Set<Blueprint> getAllBlueprints();

    /**
     * Actualiza un plano existente
     * @param author el autor del plano
     * @param blueprintName el nombre del plano
     * @param blueprint el plano actualizado
     * @throws BlueprintNotFoundException si no se encuentra el plano a actualizar
     */
    void updateBlueprint(String author, String blueprintName, Blueprint blueprint) throws BlueprintNotFoundException;
}