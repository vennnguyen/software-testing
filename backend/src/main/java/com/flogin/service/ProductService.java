package com.flogin.service;

import com.flogin.dto.ProductDto;
import java.util.List;

public interface ProductService {
    ProductDto createProduct(ProductDto dto);

    List<ProductDto> getAll();

    ProductDto getProductById(Long id);

    ProductDto updateProduct(Long id, ProductDto dto);

    void deleteProduct(Long id);
}