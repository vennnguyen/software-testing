package com.flogin.service.impl;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product; // Giả định lớp Product Entity
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Unit Tests (CRUD)")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("TC1: Tao san pham moi thanh cong")
    void testCreateProductSuccess() {
        ProductDto productDto = new ProductDto("Laptop ABC", 15000000L, 10, "Electronics");
        Product savedProduct = new Product(1L, "Laptop ABC", 15000000L, 10, "Electronics");

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        ProductDto result = productService.createProduct(productDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laptop ABC", result.getName());

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC2: Lay san pham theo ID ton tai")
    void testGetProductByIdFound() {
        Long productId = 1L;
        Product mockProduct = new Product(productId, "Mouse XYZ", 200000L, 50, "Peripherals");

        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        ProductDto result = productService.getProductById(productId);

        assertNotNull(result);
        assertEquals("Mouse XYZ", result.getName());

        // VERIFY
        verify(productRepository, times(1)).findById(productId); // Bắt buộc verify theo yêu cầu bài tập
    }

    @Test
    @DisplayName("TC3: Lay san pham theo ID khong ton tai -> throw exception")
    void testGetProductByIdNotFound() {
        Long productId = 99L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.getProductById(productId));

        assertEquals("Product not found with id: " + productId, ex.getMessage());
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC4: Cap nhat san pham thanh cong")
    void testUpdateProductSuccess() {
        Long productId = 1L;
        Product existing = new Product(productId, "Old Name", 1000L, 5, "OldCat");
        ProductDto updateDto = new ProductDto("New Name", 2000L, 10, "NewCat");
        Product updated = new Product(productId, "New Name", 2000L, 10, "NewCat");

        when(productRepository.findById(productId)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenReturn(updated);

        ProductDto result = productService.updateProduct(productId, updateDto);

        assertNotNull(result);
        assertEquals("New Name", result.getName());
        assertEquals(2000L, result.getPrice());
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("TC5: Xoa san pham thanh cong")
    void testDeleteProductSuccess() {
        Long productId = 1L;
        when(productRepository.existsById(productId)).thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    @DisplayName("TC6: Xoa san pham khong ton tai -> throw exception")
    void testDeleteProductNotFound() {
        Long productId = 99L;
        when(productRepository.existsById(productId)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.deleteProduct(productId));

        assertEquals("Product not found with id: " + productId, ex.getMessage());
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, never()).deleteById(productId);
    }

    @Test
    @DisplayName("TC7: Lay tat ca san pham (getAll) KHONG co Pagination")
    void testGetAllProductsWithoutPagination() {
        Product p1 = new Product(1L, "Laptop", 15000000L, 10, "Electronics");
        Product p2 = new Product(2L, "Mouse", 200000L, 50, "Peripherals");

        when(productRepository.findAll()).thenReturn(java.util.List.of(p1, p2));

        java.util.List<ProductDto> result = productService.getAll();

        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getName());
        assertEquals("Mouse", result.get(1).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("TC9: Lay danh sach san pham co Pagination thanh cong")
    void testGetAllProductsWithFullParams() {
        // Arrange: tạo data giả lập
        Product p1 = new Product(1L, "Laptop", 15000000L, 10, "Electronics");
        Product p2 = new Product(2L, "Mouse", 200000L, 50, "Peripherals");
        java.util.List<Product> content = java.util.List.of(p1, p2);

        int page = 0;
        int size = 2;
        String nameFilter = "Lap";
        String categoryFilter = "Electronics";
        String sortBy = "price";
        String sortDir = "desc";
        long totalElements = 10L;

        Page<Product> mockPage = new PageImpl<>(
                content,
                PageRequest.of(page, size, Sort.by(sortBy).descending()),
                totalElements);

        // Mock repository method filter + pagination
        when(productRepository.findByNameContainingAndCategoryContaining(
                eq(nameFilter),
                eq(categoryFilter),
                any(Pageable.class))).thenReturn(mockPage);

        // Act
        Page<ProductDto> resultPage = productService.getAll(
                page, size, nameFilter, categoryFilter, sortBy, sortDir);

        // Assert
        assertEquals(2, resultPage.getContent().size());
        assertEquals(totalElements, resultPage.getTotalElements());
        assertEquals("Laptop", resultPage.getContent().get(0).getName());
        assertEquals("Mouse", resultPage.getContent().get(1).getName());

        verify(productRepository, times(1))
                .findByNameContainingAndCategoryContaining(eq(nameFilter), eq(categoryFilter), any(Pageable.class));
    }

}