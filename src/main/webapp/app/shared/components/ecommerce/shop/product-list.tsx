import React, { useEffect, useState } from 'react';
import { Row, Col, Pagination } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntitiesWithVariants as getProducts } from 'app/entities/product/product.reducer';
import ProductItem from './product-item';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.product.entities);
  const loading = useAppSelector(state => state.product.loading);
  const totalItems = useAppSelector(state => state.product.totalItems) || 0;

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    dispatch(getProducts({ page: currentPage, size: itemsPerPage, sort: 'id,asc' }));
  }, [dispatch, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // API sử dụng 0-based indexing
  };

  if (loading) {
    return (
      <Row>
        <Col lg={12} className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      {products.map((product, idx) => {
        const categoryNames = product.categories?.map(cat => cat.name).join(' ') || 'general';
        const isSale = product.isSale || (product.oldPrice && product.oldPrice > product.basePrice);
        const label = isSale ? 'Sale' : product.isActive === false ? 'Out Of Stock' : undefined;

        return (
          <ProductItem
            key={product.id || idx}
            title={product.name || 'Product'}
            price={`$${product.basePrice || 0}`}
            oldPrice={product.oldPrice ? `$${product.oldPrice}` : undefined}
            image={product.imageUrl || `content/img/shop/shop-${(idx % 9) + 1}.jpg`}
            label={label}
            isSale={isSale}
          />
        );
      })}

      {totalPages > 1 && (
        <Col lg={12} className="text-center">
          <div className="pagination__option">
            <Pagination>
              <Pagination.Prev disabled={currentPage === 0} onClick={() => handlePageChange(currentPage)} />

              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item key={i + 1} active={i === currentPage} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next disabled={currentPage === totalPages - 1} onClick={() => handlePageChange(currentPage + 2)} />
            </Pagination>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default ProductList;
