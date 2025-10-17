package edu.eci.arsw.blueprints.exceptions;

/**
 * Excepción lanzada cuando se intenta registrar un plano que ya existe
 */
public class BlueprintPersistenceException extends Exception {

    public BlueprintPersistenceException(String message) {
        super(message);
    }

    public BlueprintPersistenceException(String message, Throwable cause) {
        super(message, cause);
    }
}