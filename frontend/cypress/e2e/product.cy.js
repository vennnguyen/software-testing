// Dựa trên Listing 16
import ProductPage from "../pages/ProductPage";

const NEW_PRODUCT_DATA = {
  name: "Laptop HP Spectre X360 (Test)",
  price: "35000000",
  quantity: "3",
};

const UPDATE_PRODUCT_DATA = {
  price: "33000000",
};

describe("Product E2E Tests (Sử dụng data-testid)", () => {
  beforeEach(() => {
    ProductPage.visit();
  });

  // Test Create product
  it("Nên tạo sản phẩm mới thành công (Create)", () => {
    ProductPage.clickAddNew();
    ProductPage.shouldModalBeVisible();

    ProductPage.fillProductForm(NEW_PRODUCT_DATA);
    ProductPage.submitForm();

    ProductPage.getSuccessMessage().should("contain", "Thêm mới thành công!");
    ProductPage.getProductInList(NEW_PRODUCT_DATA.name).should("exist");
  });

  // Test Read/List products
  it("Nên hiển thị sản phẩm vừa tạo trong danh sách", () => {
    // Đảm bảo sản phẩm tồn tại trước khi test
    ProductPage.getProductInList(NEW_PRODUCT_DATA.name).should("be.visible");
  });

  // Test Update product
  it("Nên cập nhật sản phẩm thành công (Update)", () => {
    // 1. Click nút Sửa
    ProductPage.clickEditButton(NEW_PRODUCT_DATA.name);
    ProductPage.shouldModalBeVisible();

    // 2. Cập nhật giá
    ProductPage.fillProductForm({
      name: NEW_PRODUCT_DATA.name,
      price: UPDATE_PRODUCT_DATA.price,
    });

    // 3. Submit form
    ProductPage.submitForm();

    // 4. Kiểm tra thông báo thành công
    ProductPage.getSuccessMessage().should("contain", "Cập nhật thành công!");

    // 5. Kiểm tra giá trị mới trong danh sách
    const formattedPrice = UPDATE_PRODUCT_DATA.price.toLocaleString();
    ProductPage.getProductInList(NEW_PRODUCT_DATA.name)
      // Lấy toàn bộ text bên trong element .product-item.
      .invoke("text")
      .should("contain", formattedPrice);
  });

  // Test Search/Filter functionality
  it("Nên tìm kiếm sản phẩm theo từ khóa", () => {
    ProductPage.fillSearchInput("HP Spectre");

    ProductPage.getProductInList("Laptop HP Spectre X360").should("exist");
    ProductPage.getProductInList("Chuột Logitech").should("not.exist");
  });

  // Test Delete product
  it("Nên xóa sản phẩm thành công (Delete)", () => {
    ProductPage.clickDeleteButton(NEW_PRODUCT_DATA.name);
    ProductPage.getSuccessMessage().should("contain", "Xóa thành công!");

    ProductPage.getProductInList(NEW_PRODUCT_DATA.name).should("not.exist");
  });
});
