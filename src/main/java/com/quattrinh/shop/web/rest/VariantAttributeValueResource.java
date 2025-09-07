package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.VariantAttributeValueRepository;
import com.quattrinh.shop.service.VariantAttributeValueQueryService;
import com.quattrinh.shop.service.VariantAttributeValueService;
import com.quattrinh.shop.service.criteria.VariantAttributeValueCriteria;
import com.quattrinh.shop.service.dto.VariantAttributeValueDTO;
import com.quattrinh.shop.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.quattrinh.shop.domain.VariantAttributeValue}.
 */
@RestController
@RequestMapping("/api/variant-attribute-values")
public class VariantAttributeValueResource {

    private static final Logger LOG = LoggerFactory.getLogger(VariantAttributeValueResource.class);

    private static final String ENTITY_NAME = "variantAttributeValue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VariantAttributeValueService variantAttributeValueService;

    private final VariantAttributeValueRepository variantAttributeValueRepository;

    private final VariantAttributeValueQueryService variantAttributeValueQueryService;

    public VariantAttributeValueResource(
        VariantAttributeValueService variantAttributeValueService,
        VariantAttributeValueRepository variantAttributeValueRepository,
        VariantAttributeValueQueryService variantAttributeValueQueryService
    ) {
        this.variantAttributeValueService = variantAttributeValueService;
        this.variantAttributeValueRepository = variantAttributeValueRepository;
        this.variantAttributeValueQueryService = variantAttributeValueQueryService;
    }

    /**
     * {@code POST  /variant-attribute-values} : Create a new variantAttributeValue.
     *
     * @param variantAttributeValueDTO the variantAttributeValueDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new variantAttributeValueDTO, or with status {@code 400 (Bad Request)} if the variantAttributeValue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<VariantAttributeValueDTO> createVariantAttributeValue(
        @RequestBody VariantAttributeValueDTO variantAttributeValueDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to save VariantAttributeValue : {}", variantAttributeValueDTO);
        if (variantAttributeValueDTO.getId() != null) {
            throw new BadRequestAlertException("A new variantAttributeValue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        variantAttributeValueDTO = variantAttributeValueService.save(variantAttributeValueDTO);
        return ResponseEntity.created(new URI("/api/variant-attribute-values/" + variantAttributeValueDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, variantAttributeValueDTO.getId().toString()))
            .body(variantAttributeValueDTO);
    }

    /**
     * {@code PUT  /variant-attribute-values/:id} : Updates an existing variantAttributeValue.
     *
     * @param id the id of the variantAttributeValueDTO to save.
     * @param variantAttributeValueDTO the variantAttributeValueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated variantAttributeValueDTO,
     * or with status {@code 400 (Bad Request)} if the variantAttributeValueDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the variantAttributeValueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VariantAttributeValueDTO> updateVariantAttributeValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VariantAttributeValueDTO variantAttributeValueDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update VariantAttributeValue : {}, {}", id, variantAttributeValueDTO);
        if (variantAttributeValueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, variantAttributeValueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!variantAttributeValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        variantAttributeValueDTO = variantAttributeValueService.update(variantAttributeValueDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, variantAttributeValueDTO.getId().toString()))
            .body(variantAttributeValueDTO);
    }

    /**
     * {@code PATCH  /variant-attribute-values/:id} : Partial updates given fields of an existing variantAttributeValue, field will ignore if it is null
     *
     * @param id the id of the variantAttributeValueDTO to save.
     * @param variantAttributeValueDTO the variantAttributeValueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated variantAttributeValueDTO,
     * or with status {@code 400 (Bad Request)} if the variantAttributeValueDTO is not valid,
     * or with status {@code 404 (Not Found)} if the variantAttributeValueDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the variantAttributeValueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VariantAttributeValueDTO> partialUpdateVariantAttributeValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VariantAttributeValueDTO variantAttributeValueDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update VariantAttributeValue partially : {}, {}", id, variantAttributeValueDTO);
        if (variantAttributeValueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, variantAttributeValueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!variantAttributeValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VariantAttributeValueDTO> result = variantAttributeValueService.partialUpdate(variantAttributeValueDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, variantAttributeValueDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /variant-attribute-values} : get all the variantAttributeValues.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of variantAttributeValues in body.
     */
    @GetMapping("")
    public ResponseEntity<List<VariantAttributeValueDTO>> getAllVariantAttributeValues(
        VariantAttributeValueCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get VariantAttributeValues by criteria: {}", criteria);

        Page<VariantAttributeValueDTO> page = variantAttributeValueQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /variant-attribute-values/count} : count all the variantAttributeValues.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countVariantAttributeValues(VariantAttributeValueCriteria criteria) {
        LOG.debug("REST request to count VariantAttributeValues by criteria: {}", criteria);
        return ResponseEntity.ok().body(variantAttributeValueQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /variant-attribute-values/:id} : get the "id" variantAttributeValue.
     *
     * @param id the id of the variantAttributeValueDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the variantAttributeValueDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VariantAttributeValueDTO> getVariantAttributeValue(@PathVariable("id") Long id) {
        LOG.debug("REST request to get VariantAttributeValue : {}", id);
        Optional<VariantAttributeValueDTO> variantAttributeValueDTO = variantAttributeValueService.findOne(id);
        return ResponseUtil.wrapOrNotFound(variantAttributeValueDTO);
    }

    /**
     * {@code DELETE  /variant-attribute-values/:id} : delete the "id" variantAttributeValue.
     *
     * @param id the id of the variantAttributeValueDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariantAttributeValue(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete VariantAttributeValue : {}", id);
        variantAttributeValueService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
