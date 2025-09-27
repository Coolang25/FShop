package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.ProductAttributeValueRepository;
import com.quattrinh.shop.service.ProductAttributeValueQueryService;
import com.quattrinh.shop.service.ProductAttributeValueService;
import com.quattrinh.shop.service.criteria.ProductAttributeValueCriteria;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import com.quattrinh.shop.service.dto.ProductAttributeValueRequestDTO;
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
 * REST controller for managing {@link com.quattrinh.shop.domain.ProductAttributeValue}.
 */
@RestController
@RequestMapping("/api/product-attribute-values")
public class ProductAttributeValueResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductAttributeValueResource.class);

    private static final String ENTITY_NAME = "productAttributeValue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductAttributeValueService productAttributeValueService;

    private final ProductAttributeValueRepository productAttributeValueRepository;

    private final ProductAttributeValueQueryService productAttributeValueQueryService;

    public ProductAttributeValueResource(
        ProductAttributeValueService productAttributeValueService,
        ProductAttributeValueRepository productAttributeValueRepository,
        ProductAttributeValueQueryService productAttributeValueQueryService
    ) {
        this.productAttributeValueService = productAttributeValueService;
        this.productAttributeValueRepository = productAttributeValueRepository;
        this.productAttributeValueQueryService = productAttributeValueQueryService;
    }

    /**
     * {@code POST  /product-attribute-values} : Create a new productAttributeValue.
     *
     * @param requestDTO the ProductAttributeValueRequestDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productAttributeValueDTO, or with status {@code 400 (Bad Request)} if the productAttributeValue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProductAttributeValueDTO> createProductAttributeValue(
        @Valid @RequestBody ProductAttributeValueRequestDTO requestDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to save ProductAttributeValue : {}", requestDTO);

        // Convert request DTO to full DTO
        ProductAttributeValueDTO productAttributeValueDTO = new ProductAttributeValueDTO();
        productAttributeValueDTO.setValue(requestDTO.getValue());
        productAttributeValueDTO.setAttributeId(requestDTO.getAttributeId());

        productAttributeValueDTO = productAttributeValueService.save(requestDTO);
        return ResponseEntity.created(new URI("/api/product-attribute-values/" + productAttributeValueDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, productAttributeValueDTO.getId().toString()))
            .body(productAttributeValueDTO);
    }

    /**
     * {@code PUT  /product-attribute-values/:id} : Updates an existing productAttributeValue.
     *
     * @param id the id of the productAttributeValueDTO to save.
     * @param requestDTO the ProductAttributeValueRequestDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productAttributeValueDTO,
     * or with status {@code 400 (Bad Request)} if the productAttributeValueDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productAttributeValueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductAttributeValueDTO> updateProductAttributeValue(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductAttributeValueRequestDTO requestDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProductAttributeValue : {}, {}", id, requestDTO);

        if (!productAttributeValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueService.update(id, requestDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productAttributeValueDTO.getId().toString()))
            .body(productAttributeValueDTO);
    }

    /**
     * {@code PATCH  /product-attribute-values/:id} : Partial updates given fields of an existing productAttributeValue, field will ignore if it is null
     *
     * @param id the id of the productAttributeValueDTO to save.
     * @param productAttributeValueDTO the productAttributeValueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productAttributeValueDTO,
     * or with status {@code 400 (Bad Request)} if the productAttributeValueDTO is not valid,
     * or with status {@code 404 (Not Found)} if the productAttributeValueDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the productAttributeValueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductAttributeValueDTO> partialUpdateProductAttributeValue(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductAttributeValueDTO productAttributeValueDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProductAttributeValue partially : {}, {}", id, productAttributeValueDTO);
        if (productAttributeValueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productAttributeValueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productAttributeValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductAttributeValueDTO> result = productAttributeValueService.partialUpdate(productAttributeValueDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productAttributeValueDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /product-attribute-values} : get all the productAttributeValues.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productAttributeValues in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProductAttributeValueDTO>> getAllProductAttributeValues(
        ProductAttributeValueCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get ProductAttributeValues by criteria: {}", criteria);

        Page<ProductAttributeValueDTO> page = productAttributeValueQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-attribute-values/count} : count all the productAttributeValues.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countProductAttributeValues(ProductAttributeValueCriteria criteria) {
        LOG.debug("REST request to count ProductAttributeValues by criteria: {}", criteria);
        return ResponseEntity.ok().body(productAttributeValueQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /product-attribute-values/:id} : get the "id" productAttributeValue.
     *
     * @param id the id of the productAttributeValueDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productAttributeValueDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductAttributeValueDTO> getProductAttributeValue(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProductAttributeValue : {}", id);
        Optional<ProductAttributeValueDTO> productAttributeValueDTO = productAttributeValueService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productAttributeValueDTO);
    }

    /**
     * {@code DELETE  /product-attribute-values/:id} : delete the "id" productAttributeValue.
     *
     * @param id the id of the productAttributeValueDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductAttributeValue(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ProductAttributeValue : {}", id);
        productAttributeValueService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
