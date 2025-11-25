package com.flogin.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.List;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)

@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @DisplayName("TC1: POST /api/products - Tạo sản phẩm mới thành công")
    void testCreateProduct() throws Exception {
        ProductDto requestDto = new ProductDto("Laptop XYZ", 20000000L, 5, "Electronics");

        ProductDto responseDto = new ProductDto(1L, "Laptop XYZ", 20000000L, 5, "Electronics");

        when(productService.createProduct(any(ProductDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Laptop XYZ"))
                .andExpect(jsonPath("$.price").value(20000000.0));

        verify(productService, times(1)).createProduct(any(ProductDto.class));
    }

    @Test
    @DisplayName("TC2: GET /api/products/all - Lấy danh sách sản phẩm thành công")
    void testGetAllProducts() throws Exception {

        List<ProductDto> products = Arrays.asList(
                new ProductDto(1L, "Laptop", 15000000L, 10, "Electronics"),
                new ProductDto(2L, "Mouse", 200000L, 50, "Electronics"));

        when(productService.getAll()).thenReturn(products);

        mockMvc.perform(get("/api/products/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Laptop"))
                .andExpect(jsonPath("$[1].quantity").value(50));
    }

    @Test
    @DisplayName("TC3: GET /api/products/{id} - Lấy chi tiết sản phẩm thành công")
    void testGetProductById() throws Exception {
        Long productId = 1L;
        ProductDto mockProduct = new ProductDto(productId, "Keyboard", 1000000L, 20, "Electronics");

        when(productService.getProductById(productId)).thenReturn(mockProduct);

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Keyboard"))
                .andExpect(jsonPath("$.price").value(1000000.0));

        verify(productService, times(1)).getProductById(productId);
    }

    @Test
    @DisplayName("TC4: PUT /api/products/{id} - Cập nhật sản phẩm thành công")
    void testUpdateProduct() throws Exception {
        Long productId = 1L;
        ProductDto updateRequest = new ProductDto("Updated Laptop", 18000000L, 8, "Electronics");
        ProductDto updatedProduct = new ProductDto(productId, "Updated Laptop", 18000000L, 8, "Electronics");

        when(productService.updateProduct(eq(productId), any(ProductDto.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/api/products/{id}", productId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Updated Laptop"))
                .andExpect(jsonPath("$.price").value(18000000.0));

        verify(productService, times(1)).updateProduct(eq(productId), any(ProductDto.class));
    }

    @Test
    @DisplayName("TC5: DELETE /api/products/{id} - Xóa sản phẩm thành công")
    void testDeleteProduct() throws Exception {
        Long productId = 1L;

        doNothing().when(productService).deleteProduct(productId);

        mockMvc.perform(delete("/api/products/{id}", productId))

                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(productId);
    }

}