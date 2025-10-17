package edu.eci.arsw.blueprints.persistence.impl;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import edu.eci.arsw.blueprints.exceptions.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.exceptions.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;

/**
 * Implementación en memoria de la persistencia de planos
 * Thread-safe usando ConcurrentHashMap
 */
@Service
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final Map<String, Set<Blueprint>> blueprintsByAuthor = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        // Inicializar con datos de ejemplo
        initializeDefaultBlueprints();
    }

    private void initializeDefaultBlueprints() {
        try {
            // Planos de juan
            Blueprint juan1 = new Blueprint("juan", "plano1", 
                Arrays.asList(
                    new Point(10, 10), new Point(20, 20), new Point(30, 30), 
                    new Point(40, 40), new Point(50, 50)
                ));
            Blueprint juan2 = new Blueprint("juan", "plano2",
                Arrays.asList(
                    new Point(15, 15), new Point(25, 25), new Point(35, 35), 
                    new Point(45, 45)
                ));
            Blueprint juan3 = new Blueprint("juan", "plano3",
                Arrays.asList(
                    new Point(5, 5), new Point(10, 10), new Point(15, 15), 
                    new Point(20, 20), new Point(25, 25), new Point(30, 30)
                ));

            // Planos de ana
            Blueprint ana1 = new Blueprint("ana", "planoA",
                Arrays.asList(
                    new Point(1, 1), new Point(2, 2), new Point(3, 3), 
                    new Point(4, 4), new Point(5, 5), new Point(6, 6), new Point(7, 7)
                ));
            Blueprint ana2 = new Blueprint("ana", "planoB",
                Arrays.asList(
                    new Point(3, 3), new Point(4, 4), new Point(5, 5), 
                    new Point(8, 8), new Point(12, 12)
                ));
            Blueprint ana3 = new Blueprint("ana", "planoC",
                Arrays.asList(
                    new Point(6, 6), new Point(7, 7), new Point(8, 8), new Point(9, 9), 
                    new Point(10, 10), new Point(11, 11), new Point(12, 12), new Point(13, 13)
                ));

            // Planos de carlos
            Blueprint carlos1 = new Blueprint("carlos", "edificio1",
                Arrays.asList(
                    new Point(0, 0), new Point(10, 0), new Point(10, 10), new Point(0, 10), 
                    new Point(0, 0), new Point(5, 5), new Point(15, 15)
                ));
            Blueprint carlos2 = new Blueprint("carlos", "casa_moderna",
                Arrays.asList(
                    new Point(20, 20), new Point(30, 20), new Point(30, 30), 
                    new Point(25, 35), new Point(20, 30), new Point(20, 20)
                ));

            // Planos de maria
            Blueprint maria1 = new Blueprint("maria", "torre_principal",
                Arrays.asList(
                    new Point(0, 0), new Point(5, 0), new Point(5, 20), new Point(10, 20), 
                    new Point(10, 25), new Point(0, 25), new Point(0, 0)
                ));

            // Guardar todos los planos
            saveBlueprint(juan1);
            saveBlueprint(juan2);
            saveBlueprint(juan3);
            saveBlueprint(ana1);
            saveBlueprint(ana2);
            saveBlueprint(ana3);
            saveBlueprint(carlos1);
            saveBlueprint(carlos2);
            saveBlueprint(maria1);

        } catch (BlueprintPersistenceException e) {
            // No debería pasar en la inicialización
            System.err.println("Error inicializando planos por defecto: " + e.getMessage());
        }
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        if (bp == null) {
            throw new BlueprintPersistenceException("El plano no puede ser nulo");
        }

        String author = bp.getAuthor();
        String name = bp.getName();

        // Usar putIfAbsent para operación atómica thread-safe
        Set<Blueprint> authorBlueprints = blueprintsByAuthor.computeIfAbsent(author, k -> ConcurrentHashMap.newKeySet());
        
        // Verificar si ya existe un plano con el mismo nombre para este autor
        synchronized (authorBlueprints) {
            boolean exists = authorBlueprints.stream()
                .anyMatch(blueprint -> blueprint.getName().equals(name));
            
            if (exists) {
                throw new BlueprintPersistenceException(
                    "Ya existe un plano con el nombre '" + name + "' para el autor '" + author + "'");
            }
            
            authorBlueprints.add(bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String blueprintName) throws BlueprintNotFoundException {
        Set<Blueprint> authorBlueprints = blueprintsByAuthor.get(author);
        
        if (authorBlueprints == null) {
            throw new BlueprintNotFoundException("No se encontraron planos para el autor: " + author);
        }

        return authorBlueprints.stream()
            .filter(bp -> bp.getName().equals(blueprintName))
            .findFirst()
            .orElseThrow(() -> new BlueprintNotFoundException(
                "No se encontró el plano '" + blueprintName + "' del autor '" + author + "'"));
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> authorBlueprints = blueprintsByAuthor.get(author);
        
        if (authorBlueprints == null || authorBlueprints.isEmpty()) {
            throw new BlueprintNotFoundException("No se encontraron planos para el autor: " + author);
        }

        // Retornar una copia para evitar modificaciones externas
        return new HashSet<>(authorBlueprints);
    }

    @Override
    public Set<Blueprint> getAllBlueprints() {
        Set<Blueprint> allBlueprints = new HashSet<>();
        for (Set<Blueprint> authorBlueprints : blueprintsByAuthor.values()) {
            allBlueprints.addAll(authorBlueprints);
        }
        return allBlueprints;
    }

    @Override
    public void updateBlueprint(String author, String blueprintName, Blueprint blueprint) throws BlueprintNotFoundException {
        Set<Blueprint> authorBlueprints = blueprintsByAuthor.get(author);
        
        if (authorBlueprints == null) {
            throw new BlueprintNotFoundException("No se encontraron planos para el autor: " + author);
        }

        synchronized (authorBlueprints) {
            boolean removed = authorBlueprints.removeIf(bp -> bp.getName().equals(blueprintName));
            
            if (!removed) {
                throw new BlueprintNotFoundException(
                    "No se encontró el plano '" + blueprintName + "' del autor '" + author + "'");
            }
            
            // Actualizar el autor y nombre del blueprint para mantener consistencia
            blueprint.setAuthor(author);
            blueprint.setName(blueprintName);
            authorBlueprints.add(blueprint);
        }
    }
}