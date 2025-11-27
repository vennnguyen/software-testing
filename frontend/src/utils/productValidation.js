export function validateProduct(product) {
  const errors = {};

  // Product Name: 3-100 ký tự, không được rỗng
  if (!product.name) {
    errors.name = "Tên sản phẩm không được để trống";
  } else if (product.name.length < 3) {
    errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
  } else if (product.name.length > 100) {
    errors.name = "Tên sản phẩm không được vượt quá 100 ký tự";
  }

  // Price: >= 0, <= 999,999,999
  if (
    product.price === undefined ||
    product.price === null ||
    product.price === ""
  ) {
    errors.price = "Giá sản phẩm không được để trống";
  } else if (product.price < 0) {
    errors.price = "Giá sản phẩm phải lớn hơn hoặc bằng 0";
  } else if (product.price > 999999999) {
    errors.price = "Giá sản phẩm không được vượt quá 999,999,999";
  }

  // Quantity: >= 0, <= 99,999
  if (
    product.quantity === undefined ||
    product.quantity === null ||
    product.quantity === ""
  ) {
    errors.quantity = "Số lượng không được để trống";
  } else if (product.quantity < 0) {
    errors.quantity = "Số lượng phải lớn hơn hoặc bằng 0";
  } else if (product.quantity > 99999) {
    errors.quantity = "Số lượng không được vượt quá 99,999";
  }

  // Description: <= 500 ký tự
  if (product.description && product.description.length > 500) {
    errors.description = "Mô tả không được vượt quá 500 ký tự";
  }

  // Category: phải thuộc danh sách hợp lệ
  const validCategories = ["Electronics", "Books", "Clothing"];
  if (!product.category || !validCategories.includes(product.category)) {
    errors.category = "Danh mục không hợp lệ";
  }

  return errors;
}
