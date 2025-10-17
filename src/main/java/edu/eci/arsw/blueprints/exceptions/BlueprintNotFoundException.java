package edu.eci.arsw.blueprints.exceptions;

/**
 * Excepción lanzada cuando no se encuentra un plano específico
 */
public class BlueprintNotFoundException extends Exception {

    public BlueprintNotFoundException(String message) {
        super(message);
    }

    public BlueprintNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}