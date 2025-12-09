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
  const productPage = new ProductPage();

  beforeEach(() => {
    productPage.visit();
  });

  // a) Test Create product flow (0.5 điểm)
  it("Nên tạo sản phẩm mới thành công (Create)", () => {
    productPage.clickAddNew();
    productPage.shouldModalBeVisible();

    productPage.fillProductForm(NEW_PRODUCT_DATA);
    productPage.submitForm();

    productPage.getSuccessMessage().should("contain", "Thêm mới thành công!");
    productPage.getProductInList(NEW_PRODUCT_DATA.name).should("exist");
  });

  // b) Test Read/List products (0.5 điểm)
  it("Nên hiển thị sản phẩm vừa tạo trong danh sách", () => {
    // Đảm bảo sản phẩm tồn tại trước khi test
    productPage.getProductInList(NEW_PRODUCT_DATA.name).should("be.visible");
  });

  // e) Test Search/Filter functionality (0.5 điểm)
  it("Nên tìm kiếm sản phẩm theo từ khóa", () => {
    productPage.fillSearchInput("HP Spectre");

    productPage.getProductInList("Laptop HP Spectre X360").should("exist");
    productPage.getProductInList("Chuột Logitech").should("not.exist");
  });

  // c) Test Update product (0.5 điểm)
  it("Nên cập nhật sản phẩm thành công (Update)", () => {
    // 1. Click nút Sửa
    productPage.clickEditButton(NEW_PRODUCT_DATA.name);
    productPage.shouldModalBeVisible();

    // 2. Cập nhật giá
    productPage.fillProductForm({
      name: NEW_PRODUCT_DATA.name,
      price: UPDATE_PRODUCT_DATA.price,
    });

    // 3. Submit form
    productPage.submitForm();

    // 4. Kiểm tra thông báo thành công
    productPage.getSuccessMessage().should("contain", "Cập nhật thành công!");

    // 5. Kiểm tra giá trị mới trong danh sách
    const formattedPrice = UPDATE_PRODUCT_DATA.price.toLocaleString();
    productPage
      .getProductInList(NEW_PRODUCT_DATA.name)
      .invoke("text")
      .should("contain", UPDATE_PRODUCT_DATA.price.toLocaleString());
  });

  // d) Test Delete product (0.5 điểm)
  it("Nên xóa sản phẩm thành công (Delete)", () => {
    productPage.clickDeleteButton(NEW_PRODUCT_DATA.name);
    productPage.getSuccessMessage().should("contain", "Xóa thành công!");
    productPage.getProductInList(NEW_PRODUCT_DATA.name).should("not.exist");
  });
});
