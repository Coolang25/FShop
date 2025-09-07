package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.repository.ShopOrderRepository;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import com.quattrinh.shop.service.mapper.ShopOrderMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ShopOrder}.
 */
@Service
@Transactional
public class ShopOrderService {

    private static final Logger LOG = LoggerFactory.getLogger(ShopOrderService.class);

    private final ShopOrderRepository shopOrderRepository;

    private final ShopOrderMapper shopOrderMapper;

    public ShopOrderService(ShopOrderRepository shopOrderRepository, ShopOrderMapper shopOrderMapper) {
        this.shopOrderRepository = shopOrderRepository;
        this.shopOrderMapper = shopOrderMapper;
    }

    /**
     * Save a shopOrder.
     *
     * @param shopOrderDTO the entity to save.
     * @return the persisted entity.
     */
    public ShopOrderDTO save(ShopOrderDTO shopOrderDTO) {
        LOG.debug("Request to save ShopOrder : {}", shopOrderDTO);
        ShopOrder shopOrder = shopOrderMapper.toEntity(shopOrderDTO);
        shopOrder = shopOrderRepository.save(shopOrder);
        return shopOrderMapper.toDto(shopOrder);
    }

    /**
     * Update a shopOrder.
     *
     * @param shopOrderDTO the entity to save.
     * @return the persisted entity.
     */
    public ShopOrderDTO update(ShopOrderDTO shopOrderDTO) {
        LOG.debug("Request to update ShopOrder : {}", shopOrderDTO);
        ShopOrder shopOrder = shopOrderMapper.toEntity(shopOrderDTO);
        shopOrder = shopOrderRepository.save(shopOrder);
        return shopOrderMapper.toDto(shopOrder);
    }

    /**
     * Partially update a shopOrder.
     *
     * @param shopOrderDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ShopOrderDTO> partialUpdate(ShopOrderDTO shopOrderDTO) {
        LOG.debug("Request to partially update ShopOrder : {}", shopOrderDTO);

        return shopOrderRepository
            .findById(shopOrderDTO.getId())
            .map(existingShopOrder -> {
                shopOrderMapper.partialUpdate(existingShopOrder, shopOrderDTO);

                return existingShopOrder;
            })
            .map(shopOrderRepository::save)
            .map(shopOrderMapper::toDto);
    }

    /**
     * Get all the shopOrders with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ShopOrderDTO> findAllWithEagerRelationships(Pageable pageable) {
        return shopOrderRepository.findAllWithEagerRelationships(pageable).map(shopOrderMapper::toDto);
    }

    /**
     *  Get all the shopOrders where Payment is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ShopOrderDTO> findAllWherePaymentIsNull() {
        LOG.debug("Request to get all shopOrders where Payment is null");
        return StreamSupport.stream(shopOrderRepository.findAll().spliterator(), false)
            .filter(shopOrder -> shopOrder.getPayment() == null)
            .map(shopOrderMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one shopOrder by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ShopOrderDTO> findOne(Long id) {
        LOG.debug("Request to get ShopOrder : {}", id);
        return shopOrderRepository.findOneWithEagerRelationships(id).map(shopOrderMapper::toDto);
    }

    /**
     * Delete the shopOrder by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ShopOrder : {}", id);
        shopOrderRepository.deleteById(id);
    }
}
