package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.ProductAttributeRepository;
import com.quattrinh.shop.service.ProductAttributeQueryService;
import com.quattrinh.shop.service.ProductAttributeService;
import com.quattrinh.shop.service.criteria.ProductAttributeCriteria;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link com.quattrinh.shop.domain.ProductAttribute}.
 */
@RestController
@RequestMapping("/api/product-attributes")
public class ProductAttributeResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductAttributeResource.class);

    private static final String ENTITY_NAME = "productAttribute";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductAttributeService productAttributeService;

    private final ProductAttributeRepository productAttributeRepository;

    private final ProductAttributeQueryService productAttributeQueryService;

    public ProductAttributeResource(
        ProductAttributeService productAttributeService,
        ProductAttributeRepository productAttributeRepository,
        ProductAttributeQueryService productAttributeQueryService
    ) {
        this.productAttributeService = productAttributeService;
        this.productAttributeRepository = productAttributeRepository;
        this.productAttributeQueryService = productAttributeQueryService;
    }

    /**
     * {@code POST  /product-attributes} : Create a new productAttribute.
     *
     * @param productAttributeDTO the productAttributeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productAttributeDTO, or with status {@code 400 (Bad Request)} if the productAttribute has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProductAttributeDTO> createProductAttribute(@Valid @RequestBody ProductAttributeDTO productAttributeDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ProductAttribute : {}", productAttributeDTO);
        if (productAttributeDTO.getId() != null) {
            throw new BadRequestAlertException("A new productAttribute cannot already have an ID", ENTITY_NAME, "idexists");
        }
        productAttributeDTO = productAttributeService.save(productAttributeDTO);
        return ResponseEntity.created(new URI("/api/product-attributes/" + productAttributeDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, productAttributeDTO.getId().toString()))
            .body(productAttributeDTO);
    }

    /**
     * {@code PUT  /product-attributes/:id} : Updates an existing productAttribute.
     *
     * @param id the id of the productAttributeDTO to save.
     * @param productAttributeDTO the productAttributeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productAttributeDTO,
     * or with status {@code 400 (Bad Request)} if the productAttributeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productAttributeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductAttributeDTO> updateProductAttribute(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductAttributeDTO productAttributeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProductAttribute : {}, {}", id, productAttributeDTO);
        if (productAttributeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productAttributeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productAttributeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        productAttributeDTO = productAttributeService.update(productAttributeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productAttributeDTO.getId().toString()))
            .body(productAttributeDTO);
    }

    /**
     * {@code PATCH  /product-attributes/:id} : Partial updates given fields of an existing productAttribute, field will ignore if it is null
     *
     * @param id the id of the productAttributeDTO to save.
     * @param productAttributeDTO the productAttributeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productAttributeDTO,
     * or with status {@code 400 (Bad Request)} if the productAttributeDTO is not valid,
     * or with status {@code 404 (Not Found)} if the productAttributeDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the productAttributeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductAttributeDTO> partialUpdateProductAttribute(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductAttributeDTO productAttributeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProductAttribute partially : {}, {}", id, productAttributeDTO);
        if (productAttributeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productAttributeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productAttributeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductAttributeDTO> result = productAttributeService.partialUpdate(productAttributeDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productAttributeDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /product-attributes} : get all the productAttributes.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productAttributes in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProductAttributeDTO>> getAllProductAttributes(
        ProductAttributeCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get ProductAttributes by criteria: {}", criteria);

        Page<ProductAttributeDTO> page = productAttributeQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-attributes/count} : count all the productAttributes.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countProductAttributes(ProductAttributeCriteria criteria) {
        LOG.debug("REST request to count ProductAttributes by criteria: {}", criteria);
        return ResponseEntity.ok().body(productAttributeQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /product-attributes/:id} : get the "id" productAttribute.
     *
     * @param id the id of the productAttributeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productAttributeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductAttributeDTO> getProductAttribute(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProductAttribute : {}", id);
        Optional<ProductAttributeDTO> productAttributeDTO = productAttributeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productAttributeDTO);
    }

    /**
     * {@code DELETE  /product-attributes/:id} : delete the "id" productAttribute.
     *
     * @param id the id of the productAttributeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductAttribute(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ProductAttribute : {}", id);
        productAttributeService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
