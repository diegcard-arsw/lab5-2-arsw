package edu.eci.arsw.blueprints.controllers;

import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.eci.arsw.blueprints.exceptions.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.exceptions.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.services.BlueprintsServices;

/**
 * Controlador REST para la gestión de planos
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {

    @Autowired
    private BlueprintsServices blueprintsServices;

    /**
     * GET /blueprints
     * Obtiene todos los planos del sistema
     */
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllBlueprints() {
        try {
            Set<Blueprint> blueprints = blueprintsServices.getAllBlueprints();
            return new ResponseEntity<>(blueprints, HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /blueprints/{author}
     * Obtiene todos los planos de un autor específico
     */
    @RequestMapping(value = "/{author}", method = RequestMethod.GET)
    public ResponseEntity<?> getBlueprintsByAuthor(@PathVariable String author) {
        try {
            Set<Blueprint> blueprints = blueprintsServices.getBlueprintsByAuthor(author);
            return new ResponseEntity<>(blueprints, HttpStatus.OK);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.INFO, null, ex);
            return new ResponseEntity<>("No se encontraron planos para el autor: " + author, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /blueprints/{author}/{bpname}
     * Obtiene un plano específico por autor y nombre
     */
    @RequestMapping(value = "/{author}/{bpname}", method = RequestMethod.GET)
    public ResponseEntity<?> getBlueprint(@PathVariable String author, @PathVariable String bpname) {
        try {
            Blueprint blueprint = blueprintsServices.getBlueprint(author, bpname);
            return new ResponseEntity<>(blueprint, HttpStatus.OK);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.INFO, null, ex);
            return new ResponseEntity<>("No se encontró el plano '" + bpname + "' del autor '" + author + "'", HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * POST /blueprints
     * Registra un nuevo plano
     */
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> addNewBlueprint(@RequestBody Blueprint blueprint) {
        try {
            blueprintsServices.addNewBlueprint(blueprint);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (BlueprintPersistenceException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.WARNING, null, ex);
            return new ResponseEntity<>("Ya existe un plano con ese nombre para el autor especificado", HttpStatus.FORBIDDEN);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * PUT /blueprints/{author}/{bpname}
     * Actualiza un plano existente
     */
    @RequestMapping(value = "/{author}/{bpname}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateBlueprint(@PathVariable String author, 
                                           @PathVariable String bpname, 
                                           @RequestBody Blueprint blueprint) {
        try {
            blueprintsServices.updateBlueprint(author, bpname, blueprint);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.INFO, null, ex);
            return new ResponseEntity<>("No se encontró el plano '" + bpname + "' del autor '" + author + "'", HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * DELETE /blueprints/{author}/{bpname}
     * Elimina un plano existente
     */
    @RequestMapping(value = "/{author}/{bpname}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteBlueprint(@PathVariable String author, @PathVariable String bpname) {
        try {
            blueprintsServices.deleteBlueprint(author, bpname);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.INFO, null, ex);
            return new ResponseEntity<>("No se encontró el plano '" + bpname + "' del autor '" + author + "'", HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}