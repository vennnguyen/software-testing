package com.flogin.service.impl;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Collections;

@ExtendWith(MockitoExtension.class)
class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("Mock: Lấy toàn bộ danh sách sản phẩm")
    void testGetAll() {
        Product p1 = new Product(1L, "A", 100L, 1, "Cat1");
        Product p2 = new Product(2L, "B", 200L, 2, "Cat2");

        when(productRepository.findAll()).thenReturn(java.util.Arrays.asList(p1, p2));

        java.util.List<ProductDto> result = productService.getAll();

        assertEquals(2, result.size());
        assertEquals("A", result.get(0).getName());

        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Mock: Lấy danh sách có phân trang + filter mặc định")
    void testGetAllWithPagination() {
    
        int page = 0;
        int size = 10;
        String nameFilter = "";
        String categoryFilter = "";
        String sortBy = "id";
        String sortDir = "asc";

        Product p1 = new Product(1L, "Laptop", 1000L, 1, "Elec");
        Page<Product> mockPage = new PageImpl<>(Collections.singletonList(p1),
                PageRequest.of(page, size, Sort.by(sortBy).ascending()), 1);

        when(productRepository.findByNameContainingAndCategoryContaining(eq(nameFilter), eq(categoryFilter),
                any(Pageable.class)))
                .thenReturn(mockPage);

        Page<ProductDto> result = productService.getAll(page, size, nameFilter, categoryFilter, sortBy, sortDir);

        assertEquals(1, result.getTotalElements());
        assertEquals("Laptop", result.getContent().get(0).getName());

        verify(productRepository, times(1))
                .findByNameContainingAndCategoryContaining(eq(nameFilter), eq(categoryFilter), any(Pageable.class));
    }

    @Test
    @DisplayName("Mock: Lấy sản phẩm theo ID thành công")
    void testGetProductById() {
        Product mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Laptop Dell");
        mockProduct.setPrice(15000000L);
        mockProduct.setQuantity(10);
        mockProduct.setCategory("Electronics");

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(mockProduct));

        ProductDto result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Laptop Dell", result.getName());
        assertEquals(15000000L, result.getPrice());

        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Mock: Lấy sản phẩm thất bại khi ID không tồn tại (Ném lỗi)")
    void testGetProductById_NotFound_ThrowException() {
        Long nonExistentId = 99L;

        when(productRepository.findById(nonExistentId))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(nonExistentId);
        });

        assertEquals("Product not found with id: 99", exception.getMessage());
    }

    @Test
    @DisplayName("Mock: Tạo sản phẩm mới thành công")
    void testCreateProduct() {
        ProductDto inputDto = new ProductDto("Mouse", 200000L, 50, "Accessories");

        Product savedEntity = new Product();
        savedEntity.setId(2L);
        savedEntity.setName("Mouse");
        savedEntity.setPrice(200000L);

        when(productRepository.save(any(Product.class))).thenReturn(savedEntity);

        ProductDto result = productService.createProduct(inputDto);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Mouse", result.getName());

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Xóa sản phẩm thành công")
    void testDeleteProduct() {
        Long productId = 1L;

        when(productRepository.existsById(productId)).thenReturn(true);

        productService.deleteProduct(productId);

        verify(productRepository).existsById(productId);

        verify(productRepository).deleteById(productId);
    }

    @Test
    @DisplayName("Mock: Xóa thất bại khi ID không tồn tại")
    void testDeleteProduct_NotFound() {
        Long nonExistentId = 99L;

        when(productRepository.existsById(nonExistentId)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.deleteProduct(nonExistentId);
        });

        assertEquals("Product not found with id: 99", exception.getMessage());

        verify(productRepository, never()).deleteById(nonExistentId);
    }

    @Test
    @DisplayName("Mock: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {
        Long productId = 1L;

        ProductDto updateDto = new ProductDto("Laptop Dell Pro", 18000000L, 5, "Updated Desc");

        Product existingProduct = new Product();
        existingProduct.setId(productId);
        existingProduct.setName("Laptop Dell Old");
        existingProduct.setPrice(15000000L);

        Product updatedEntity = new Product();
        updatedEntity.setId(productId);
        updatedEntity.setName("Laptop Dell Pro");
        updatedEntity.setPrice(18000000L);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedEntity);

        ProductDto result = productService.updateProduct(productId, updateDto);

        assertNotNull(result);
        assertEquals("Laptop Dell Pro", result.getName());
        assertEquals(18000000L, result.getPrice());

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Cập nhật thất bại khi ID không tồn tại")
    void testUpdateProduct_NotFound() {
        Long nonExistentId = 99L;
        ProductDto updateDto = new ProductDto("New Name", 1000L, 1, "Desc");

        when(productRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(nonExistentId, updateDto);
        });

        verify(productRepository, never()).save(any(Product.class));
    }
}
