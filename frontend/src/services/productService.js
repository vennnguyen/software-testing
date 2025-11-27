import axiosClient from "./axiosClient";

const PRODUCT_BASE_URL = "/products";

/**
 * Lấy danh sách sản phẩm (có hỗ trợ phân trang).
 * API: GET /api/products?page=...&size=...
 */
export const getProducts = async (
  page = 0,
  size = 2,
  search = "",
  category = "",
  sortBy = "id",
  sortDir = "asc"
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", size);

  if (search) params.append("name", search);
  if (category) params.append("category", category);
  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortDir", sortDir);
  }

  return axiosClient.get(`/products?${params.toString()}`);
};

/**
 * Lấy chi tiết sản phẩm theo ID.
 * API: GET /api/products/{id}
 */
export const getProductById = async (productId) => {
  return axiosClient.get(`${PRODUCT_BASE_URL}/${productId}`);
};

// ----------------------------------------
// 2. WRITE OPERATIONS (CRUD)
// ----------------------------------------

/**
 * Tạo sản phẩm mới.
 * API: POST /api/products
 * @param {Object} productData - Dữ liệu sản phẩm mới (Product DTO).
 */
export const createProduct = async (productData) => {
  return axiosClient.post(PRODUCT_BASE_URL, productData);
};

/**
 * Cập nhật sản phẩm hiện có.
 * API: PUT /api/products/{id}
 * @param {number} productId - ID của sản phẩm cần cập nhật.
 * @param {Object} productData - Dữ liệu cập nhật (Product DTO).
 */
export const updateProduct = async (productId, productData) => {
  return axiosClient.put(`${PRODUCT_BASE_URL}/${productId}`, productData);
};

/**
 * Xóa sản phẩm theo ID.
 * API: DELETE /api/products/{id}
 * @param {number} productId - ID của sản phẩm cần xóa.
 */
export const deleteProduct = async (productId) => {
  // API DELETE thường không cần truyền body
  return axiosClient.delete(`${PRODUCT_BASE_URL}/${productId}`);
};
