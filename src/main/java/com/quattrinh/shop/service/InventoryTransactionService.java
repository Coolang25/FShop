package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.InventoryTransaction;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.domain.enumeration.TransactionType;
import com.quattrinh.shop.repository.InventoryTransactionRepository;
import com.quattrinh.shop.repository.ProductVariantRepository;
import com.quattrinh.shop.service.dto.InventoryTransactionDTO;
import com.quattrinh.shop.service.mapper.InventoryTransactionMapper;
import com.quattrinh.shop.web.rest.errors.BadRequestAlertException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link InventoryTransaction}.
 */
@Service
@Transactional
public class InventoryTransactionService {

    private final Logger log = LoggerFactory.getLogger(InventoryTransactionService.class);

    private final InventoryTransactionRepository inventoryTransactionRepository;

    private final ProductVariantRepository productVariantRepository;

    private final InventoryTransactionMapper inventoryTransactionMapper;

    public InventoryTransactionService(
        InventoryTransactionRepository inventoryTransactionRepository,
        ProductVariantRepository productVariantRepository,
        InventoryTransactionMapper inventoryTransactionMapper
    ) {
        this.inventoryTransactionRepository = inventoryTransactionRepository;
        this.productVariantRepository = productVariantRepository;
        this.inventoryTransactionMapper = inventoryTransactionMapper;
    }

    /**
     * Save a inventoryTransaction.
     *
     * @param inventoryTransactionDTO the entity to save.
     * @return the persisted entity.
     */
    public InventoryTransactionDTO save(InventoryTransactionDTO inventoryTransactionDTO) {
        log.debug("Request to save InventoryTransaction : {}", inventoryTransactionDTO);
        InventoryTransaction inventoryTransaction = inventoryTransactionMapper.toEntity(inventoryTransactionDTO);

        // createdAt is automatically set by AbstractAuditingEntity

        // Update product variant stock based on transaction type
        if (inventoryTransaction.getVariant() != null && inventoryTransaction.getVariant().getId() != null) {
            Optional<ProductVariant> variantOpt = productVariantRepository.findById(inventoryTransaction.getVariant().getId());
            if (variantOpt.isPresent()) {
                ProductVariant variant = variantOpt.get();
                int currentStock = variant.getStock() != null ? variant.getStock() : 0;
                int quantity = inventoryTransaction.getQuantity() != null ? inventoryTransaction.getQuantity() : 0;

                int reserved = variant.getReserved() != null ? variant.getReserved() : 0;
                int available = Math.max(0, currentStock - reserved);

                if (inventoryTransaction.getType() == TransactionType.IMPORT) {
                    variant.setStock(currentStock + quantity);
                } else if (inventoryTransaction.getType() == TransactionType.EXPORT) {
                    if (quantity > available) {
                        throw new BadRequestAlertException("Not enough available stock", "inventoryTransaction", "stocknotavailable");
                    }
                    variant.setStock(Math.max(0, currentStock - quantity));
                } else if (inventoryTransaction.getType() == TransactionType.RETURN) {
                    variant.setStock(currentStock + quantity);
                } else if (inventoryTransaction.getType() == TransactionType.ADJUSTMENT) {
                    variant.setStock(quantity);
                }

                productVariantRepository.save(variant);
            }
        }

        inventoryTransaction = inventoryTransactionRepository.save(inventoryTransaction);
        return inventoryTransactionMapper.toDto(inventoryTransaction);
    }

    /**
     * Update a inventoryTransaction.
     *
     * @param inventoryTransactionDTO the entity to save.
     * @return the persisted entity.
     */
    public InventoryTransactionDTO update(InventoryTransactionDTO inventoryTransactionDTO) {
        log.debug("Request to update InventoryTransaction : {}", inventoryTransactionDTO);
        InventoryTransaction inventoryTransaction = inventoryTransactionMapper.toEntity(inventoryTransactionDTO);
        inventoryTransaction = inventoryTransactionRepository.save(inventoryTransaction);
        return inventoryTransactionMapper.toDto(inventoryTransaction);
    }

    /**
     * Partially update a inventoryTransaction.
     *
     * @param inventoryTransactionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<InventoryTransactionDTO> partialUpdate(InventoryTransactionDTO inventoryTransactionDTO) {
        log.debug("Request to partially update InventoryTransaction : {}", inventoryTransactionDTO);

        return inventoryTransactionRepository
            .findById(inventoryTransactionDTO.getId())
            .map(existingInventoryTransaction -> {
                inventoryTransactionMapper.partialUpdate(existingInventoryTransaction, inventoryTransactionDTO);

                return existingInventoryTransaction;
            })
            .map(inventoryTransactionRepository::save)
            .map(inventoryTransactionMapper::toDto);
    }

    /**
     * Get all the inventoryTransactions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<InventoryTransactionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all InventoryTransactions");
        return inventoryTransactionRepository.findAllWithEagerRelationships(pageable).map(inventoryTransactionMapper::toDto);
    }

    /**
     * Get one inventoryTransaction by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<InventoryTransactionDTO> findOne(Long id) {
        log.debug("Request to get InventoryTransaction : {}", id);
        return inventoryTransactionRepository.findOneWithEagerRelationships(id).map(inventoryTransactionMapper::toDto);
    }

    /**
     * Delete the inventoryTransaction by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete InventoryTransaction : {}", id);
        inventoryTransactionRepository.deleteById(id);
    }
}
