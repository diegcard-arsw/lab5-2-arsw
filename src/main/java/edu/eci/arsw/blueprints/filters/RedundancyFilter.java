package edu.eci.arsw.blueprints.filters;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;

/**
 * Filtro que elimina puntos duplicados consecutivos
 */
@Component
public class RedundancyFilter implements BlueprintFilter {

    @Override
    public Blueprint filter(Blueprint blueprint) {
        if (blueprint == null || blueprint.getPoints() == null || blueprint.getPoints().isEmpty()) {
            return blueprint;
        }

        List<Point> originalPoints = blueprint.getPoints();
        List<Point> filteredPoints = new ArrayList<>();
        
        // Agregar el primer punto
        filteredPoints.add(originalPoints.get(0));
        
        // Filtrar puntos duplicados consecutivos
        for (int i = 1; i < originalPoints.size(); i++) {
            Point currentPoint = originalPoints.get(i);
            Point previousPoint = originalPoints.get(i - 1);
            
            // Solo agregar si no es igual al punto anterior
            if (!currentPoint.equals(previousPoint)) {
                filteredPoints.add(currentPoint);
            }
        }

        // Crear nuevo blueprint con puntos filtrados
        Blueprint filteredBlueprint = new Blueprint(
            blueprint.getAuthor(), 
            blueprint.getName(), 
            filteredPoints
        );
        
        return filteredBlueprint;
    }
}