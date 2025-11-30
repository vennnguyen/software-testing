package com.flogin.service.impl;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
                .map(p -> new ProductDto(p.getId(), p.getName(), p.getPrice(), p.getQuantity(), p.getCategory()))
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> getAll(int page, int size, String name, String category, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String nameFilter = (name == null || name.isEmpty()) ? "" : name;
        String categoryFilter = (category == null || category.isEmpty()) ? "" : category;

        System.out.println("nameFilter: " + nameFilter + ", categoryFilter: " + categoryFilter);
        System.out.println("pageable: " + pageable);

        Page<Product> productPage = repo.findByNameContainingAndCategoryContaining(nameFilter, categoryFilter,
                pageable);
        System.out.println("productPage totalElements: " + productPage.getTotalElements());
        return productPage.map(p -> new ProductDto(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getQuantity(),
                p.getCategory()));
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return new ProductDto(p.getId(), p.getName(), p.getPrice(), p.getQuantity(), p.getCategory());
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        p.setName(dto.getName());
        p.setPrice(dto.getPrice());
        p.setQuantity(dto.getQuantity());
        p.setCategory(dto.getCategory());

        Product updated = repo.save(p);
        return new ProductDto(updated.getId(), updated.getName(), updated.getPrice(), updated.getQuantity(),
                updated.getCategory());
    }

    @Override
    public void deleteProduct(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        repo.deleteById(id);
    }

}
