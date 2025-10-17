package edu.eci.arsw.blueprints.filters;

import edu.eci.arsw.blueprints.model.Blueprint;

/**
 * Interface para implementar filtros de puntos en los planos
 */
public interface BlueprintFilter {
    
    /**
     * Filtra los puntos de un plano según el criterio específico del filtro
     * @param blueprint El plano a filtrar
     * @return Un nuevo plano con los puntos filtrados
     */
    Blueprint filter(Blueprint blueprint);
}