package com.sivh.gtbee.web.rest;
import com.sivh.gtbee.domain.GTBactivity;
import com.sivh.gtbee.repository.GTBactivityRepository;
import com.sivh.gtbee.web.rest.errors.BadRequestAlertException;
import com.sivh.gtbee.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing GTBactivity.
 */
@RestController
@RequestMapping("/api")
public class GTBactivityResource {

    private final Logger log = LoggerFactory.getLogger(GTBactivityResource.class);

    private static final String ENTITY_NAME = "gTBactivity";

    private final GTBactivityRepository gTBactivityRepository;

    public GTBactivityResource(GTBactivityRepository gTBactivityRepository) {
        this.gTBactivityRepository = gTBactivityRepository;
    }

    /**
     * POST  /gt-bactivities : Create a new gTBactivity.
     *
     * @param gTBactivity the gTBactivity to create
     * @return the ResponseEntity with status 201 (Created) and with body the new gTBactivity, or with status 400 (Bad Request) if the gTBactivity has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/gt-bactivities")
    public ResponseEntity<GTBactivity> createGTBactivity(@RequestBody GTBactivity gTBactivity) throws URISyntaxException {
        log.debug("REST request to save GTBactivity : {}", gTBactivity);
        if (gTBactivity.getId() != null) {
            throw new BadRequestAlertException("A new gTBactivity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GTBactivity result = gTBactivityRepository.save(gTBactivity);
        return ResponseEntity.created(new URI("/api/gt-bactivities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gt-bactivities : Updates an existing gTBactivity.
     *
     * @param gTBactivity the gTBactivity to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated gTBactivity,
     * or with status 400 (Bad Request) if the gTBactivity is not valid,
     * or with status 500 (Internal Server Error) if the gTBactivity couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/gt-bactivities")
    public ResponseEntity<GTBactivity> updateGTBactivity(@RequestBody GTBactivity gTBactivity) throws URISyntaxException {
        log.debug("REST request to update GTBactivity : {}", gTBactivity);
        if (gTBactivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        GTBactivity result = gTBactivityRepository.save(gTBactivity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, gTBactivity.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gt-bactivities : get all the gTBactivities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of gTBactivities in body
     */
    @GetMapping("/gt-bactivities")
    public List<GTBactivity> getAllGTBactivities() {
        log.debug("REST request to get all GTBactivities");
        return gTBactivityRepository.findAll();
    }

    /**
     * GET  /gt-bactivities/:id : get the "id" gTBactivity.
     *
     * @param id the id of the gTBactivity to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the gTBactivity, or with status 404 (Not Found)
     */
    @GetMapping("/gt-bactivities/{id}")
    public ResponseEntity<GTBactivity> getGTBactivity(@PathVariable Long id) {
        log.debug("REST request to get GTBactivity : {}", id);
        Optional<GTBactivity> gTBactivity = gTBactivityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gTBactivity);
    }

    /**
     * DELETE  /gt-bactivities/:id : delete the "id" gTBactivity.
     *
     * @param id the id of the gTBactivity to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/gt-bactivities/{id}")
    public ResponseEntity<Void> deleteGTBactivity(@PathVariable Long id) {
        log.debug("REST request to delete GTBactivity : {}", id);
        gTBactivityRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
