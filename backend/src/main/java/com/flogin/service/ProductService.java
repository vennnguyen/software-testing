package com.flogin.service;

import com.flogin.dto.ProductDto;
import java.util.List;

import org.springframework.data.domain.Page;

public interface ProductService {
    ProductDto createProduct(ProductDto dto);

    List<ProductDto> getAll();

    Page<ProductDto> getAll(int page, int size, String name, String category, String sortBy, String sortDir);

    ProductDto getProductById(Long id);

    ProductDto updateProduct(Long id, ProductDto dto);

    void deleteProduct(Long id);
}
