package com.flogin.service.impl;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;

    public ProductServiceImpl(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public ProductDto createProduct(ProductDto dto) {
        Product p = Product.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .category(dto.getCategory())
                .build();
        Product saved = repo.save(p);
                return new ProductDto(saved.getId(), saved.getName(), saved.getPrice(), saved.getQuantity(),
                saved.getCategory());
    }

    @Override
    public List<ProductDto> getAll() {
        return repo.findAll().stream()