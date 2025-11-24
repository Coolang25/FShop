package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.InventoryTransaction;
import com.quattrinh.shop.service.dto.InventoryTransactionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link InventoryTransaction} and its DTO {@link InventoryTransactionDTO}.
 */
@Component
public class InventoryTransactionMapper {

    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Autowired
    private ShopOrderMapper shopOrderMapper;

    public InventoryTransactionDTO toDto(InventoryTransaction entity) {
        if (entity == null) {
            return null;
        }

        InventoryTransactionDTO dto = new InventoryTransactionDTO();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setQuantity(entity.getQuantity());
        dto.setNote(entity.getNote());
        dto.setCreatedAt(entity.getCreatedDate());

        if (entity.getVariant() != null) {
            dto.setVariant(productVariantMapper.toDto(entity.getVariant()));
        } else {
            dto.setVariant(null);
        }

        if (entity.getOrder() != null) {
            dto.setOrder(shopOrderMapper.toDto(entity.getOrder()));
        } else {
            dto.setOrder(null);
        }

        return dto;
    }

    public InventoryTransaction toEntity(InventoryTransactionDTO dto) {
        if (dto == null) {
            return null;
        }

        InventoryTransaction entity = new InventoryTransaction();
        entity.setId(dto.getId());
        entity.setType(dto.getType());
        entity.setQuantity(dto.getQuantity());
        entity.setNote(dto.getNote());
        // createdAt is automatically handled by AbstractAuditingEntity

        if (dto.getVariant() != null) {
            entity.setVariant(productVariantMapper.toEntity(dto.getVariant()));
        } else {
            entity.setVariant(null);
        }

        if (dto.getOrder() != null) {
            entity.setOrder(shopOrderMapper.toEntity(dto.getOrder()));
        } else {
            entity.setOrder(null);
        }

        return entity;
    }

    public void partialUpdate(InventoryTransaction existingEntity, InventoryTransactionDTO dto) {
        if (dto.getId() != null) {
            existingEntity.setId(dto.getId());
        }
        if (dto.getType() != null) {
            existingEntity.setType(dto.getType());
        }
        if (dto.getQuantity() != null) {
            existingEntity.setQuantity(dto.getQuantity());
        }
        if (dto.getNote() != null) {
            existingEntity.setNote(dto.getNote());
        }
        // createdAt is automatically handled by AbstractAuditingEntity
        if (dto.getVariant() != null) {
            existingEntity.setVariant(productVariantMapper.toEntity(dto.getVariant()));
        }
        if (dto.getOrder() != null) {
            existingEntity.setOrder(shopOrderMapper.toEntity(dto.getOrder()));
        }
    }
}
