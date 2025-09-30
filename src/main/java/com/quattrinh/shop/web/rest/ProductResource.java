package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.ProductRepository;
import com.quattrinh.shop.service.ProductQueryService;
import com.quattrinh.shop.service.ProductService;
import com.quattrinh.shop.service.criteria.ProductCriteria;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
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
 * REST controller for managing {@link com.quattrinh.shop.domain.Product}.
 */
@RestController
@RequestMapping("/api/products")
public class ProductResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductResource.class);

    private static final String ENTITY_NAME = "product";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductService productService;

    private final ProductRepository productRepository;

    private final ProductQueryService productQueryService;

    public ProductResource(ProductService productService, ProductRepository productRepository, ProductQueryService productQueryService) {
        this.productService = productService;
        this.productRepository = productRepository;
        this.productQueryService = productQueryService;
    }

    /**
     * {@code POST  /products} : Create a new product.
     *
     * @param productDTO the productDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productDTO, or with status {@code 400 (Bad Request)} if the product has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) throws URISyntaxException {
        LOG.debug("REST request to save Product : {}", productDTO);
        if (productDTO.getId() != null) {
            throw new BadRequestAlertException("A new product cannot already have an ID", ENTITY_NAME, "idexists");
        }
        productDTO = productService.save(productDTO);
        return ResponseEntity.created(new URI("/api/products/" + productDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, productDTO.getId().toString()))
            .body(productDTO);
    }

    /**
     * {@code PUT  /products/:id} : Updates an existing product.
     *
     * @param id the id of the productDTO to save.
     * @param productDTO the productDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDTO,
     * or with status {@code 400 (Bad Request)} if the productDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductDTO productDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Product : {}, {}", id, productDTO);
        if (productDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        productDTO = productService.update(productDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDTO.getId().toString()))
            .body(productDTO);
    }

    /**
     * {@code PATCH  /products/:id} : Partial updates given fields of an existing product, field will ignore if it is null
     *
     * @param id the id of the productDTO to save.
     * @param productDTO the productDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDTO,
     * or with status {@code 400 (Bad Request)} if the productDTO is not valid,
     * or with status {@code 404 (Not Found)} if the productDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the productDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductDTO> partialUpdateProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductDTO productDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Product partially : {}, {}", id, productDTO);
        if (productDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductDTO> result = productService.partialUpdate(productDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /products} : get all the products.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of products in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProductDTO>> getAllProducts(
        ProductCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Products by criteria: {}", criteria);

        Page<ProductDTO> page = productQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /products/count} : count all the products.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countProducts(ProductCriteria criteria) {
        LOG.debug("REST request to count Products by criteria: {}", criteria);
        return ResponseEntity.ok().body(productQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /products/with-variants} : get all the products with their variants.
     *
     * @param pageable the pagination information.
     * @param search the search term for filtering products by name or description.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of products with variants in body.
     */
    @GetMapping("/with-variants")
    public ResponseEntity<List<ProductDTO>> getAllProductsWithVariants(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String search
    ) {
        LOG.debug("REST request to get Products with variants, search: {}", search);
        Page<ProductDTO> page = productService.findAllWithEagerRelationships(pageable, search);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /products/featured} : get featured products for home page.
     *
     * @param limit the number of products to return (default: 8).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of featured products in body.
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ProductDTO>> getFeaturedProducts(@RequestParam(defaultValue = "8") int limit) {
        LOG.debug("REST request to get Featured Products, limit: {}", limit);
        List<ProductDTO> featuredProducts = productService.findFeaturedProducts(limit);
        return ResponseEntity.ok().body(featuredProducts);
    }

    /**
     * {@code GET  /products/new} : get new products for home page.
     *
     * @param limit the number of products to return (default: 3).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of new products in body.
     */
    @GetMapping("/new")
    public ResponseEntity<List<ProductDTO>> getNewProducts(@RequestParam(defaultValue = "3") int limit) {
        LOG.debug("REST request to get New Products, limit: {}", limit);
        List<ProductDTO> newProducts = productService.findNewProducts(limit);
        return ResponseEntity.ok().body(newProducts);
    }

    /**
     * {@code GET  /products/trend} : get trend products for home page.
     *
     * @param limit the number of products to return (default: 3).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trend products in body.
     */
    @GetMapping("/trend")
    public ResponseEntity<List<ProductDTO>> getTrendProducts(@RequestParam(defaultValue = "3") int limit) {
        LOG.debug("REST request to get Trend Products, limit: {}", limit);
        List<ProductDTO> trendProducts = productService.findTrendProducts(limit);
        return ResponseEntity.ok().body(trendProducts);
    }

    /**
     * {@code GET  /products/best-seller} : get best seller products for home page.
     *
     * @param limit the number of products to return (default: 3).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of best seller products in body.
     */
    @GetMapping("/best-seller")
    public ResponseEntity<List<ProductDTO>> getBestSellerProducts(@RequestParam(defaultValue = "3") int limit) {
        LOG.debug("REST request to get Best Seller Products, limit: {}", limit);
        List<ProductDTO> bestSellerProducts = productService.findBestSellerProducts(limit);
        return ResponseEntity.ok().body(bestSellerProducts);
    }

    /**
     * {@code GET  /products/stats} : get product statistics for home page.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the product statistics in body.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        LOG.debug("REST request to get Product Statistics");
        Map<String, Object> stats = productService.getProductStats();
        return ResponseEntity.ok().body(stats);
    }

    /**
     * {@code GET  /products/:id} : get the "id" product.
     *
     * @param id the id of the productDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Product : {}", id);
        Optional<ProductDTO> productDTO = productService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productDTO);
    }

    /**
     * {@code GET  /products/:id/detail} : get the "id" product with variants, attributes and images for detail page.
     *
     * @param id the id of the product to retrieve with full details.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the product detail, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}/detail")
    public ResponseEntity<Map<String, Object>> getProductDetail(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Product Detail : {}", id);
        Map<String, Object> productDetail = productService.getProductDetail(id);
        if (productDetail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(productDetail);
    }

    /**
     * {@code DELETE  /products/:id} : delete the "id" product.
     *
     * @param id the id of the productDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Product : {}", id);
        productService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code PATCH  /products/:id/activate} : activate the "id" product.
     *
     * @param id the id of the productDTO to activate.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDTO.
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ProductDTO> activateProduct(@PathVariable("id") Long id) {
        LOG.debug("REST request to activate Product : {}", id);
        ProductDTO result = productService.activate(id);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
}
