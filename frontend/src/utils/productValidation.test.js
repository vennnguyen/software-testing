import { validateProduct } from "./productValidation";

describe("Product Validation Tests", () => {
  const validProduct = {
    name: "Laptop Dell",
    price: 15000000,
    quantity: 10,
    description: "Mô tả ngắn.",
    category: "Electronics",
  };

  // --- a) Unit Tests cho validateProduct() (3 điểm) ---

  // Test product name validation
  test("TC1: Product name rỗng nên trả về lỗi", () => {
    const product = { ...validProduct, name: "" };
    const errors = validateProduct(product);
    expect(errors.name).toBe("Tên sản phẩm không được để trống");
    expect(Object.keys(errors).length).toBe(1);
  });

  test("TC2: Product name quá ngắn (< 3 ký tự) nên trả về lỗi", () => {
    const product = { ...validProduct, name: "Ab" };
    const errors = validateProduct(product);
    expect(errors.name).toBe("Tên sản phẩm phải có ít nhất 3 ký tự");
  });

  // Test price validation (boundary tests)
  test("TC3: Price là số âm nên trả về lỗi", () => {
    const product = { ...validProduct, price: -1000 };
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá sản phẩm phải lớn hơn hoặc bằng 0");
  });

  test("TC4: Price vượt quá Max Value (999,999,999) nên trả về lỗi", () => {
    const product = { ...validProduct, price: 1000000000 };
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá sản phẩm không được vượt quá 999,999,999");
  });

  // Test quantity validation
  test("TC5: Quantity là số âm nên trả về lỗi", () => {
    const product = { ...validProduct, quantity: -5 };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe("Số lượng phải lớn hơn hoặc bằng 0");
  });

  test("TC6: Quantity vượt quá Max Value (99,999) nên trả về lỗi", () => {
    const product = { ...validProduct, quantity: 100000 };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe("Số lượng không được vượt quá 99,999");
  });

  // Test description length
  test("TC7: Description vượt quá 500 ký tự nên trả về lỗi", () => {
    // Chuỗi 501 ký tự
    const longDescription = "d".repeat(501);
    const product = { ...validProduct, description: longDescription };
    const errors = validateProduct(product);
    expect(errors.description).toBe("Mô tả không được vượt quá 500 ký tự");
  });

  // Test category validation
  test("TC8: Category không thuộc danh sách có sẵn nên trả về lỗi", () => {
    const product = { ...validProduct, category: "Invalid Category" };
    const errors = validateProduct(product);
    expect(errors.category).toBe("Danh mục không hợp lệ");
  });

  // Product name vượt quá 100 ký tự
  test("TC16: Product name > 100 ký tự nên trả về lỗi", () => {
    const product = { ...validProduct, name: "A".repeat(101) };
    const errors = validateProduct(product);
    expect(errors.name).toBe("Tên sản phẩm không được vượt quá 100 ký tự");
  });

  // Price bị bỏ trống (undefined)
  test("TC17: Price undefined nên trả về lỗi", () => {
    const product = { ...validProduct, price: undefined };
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá sản phẩm không được để trống");
  });

  // Quantity bị bỏ trống (undefined)
  test("TC18: Quantity undefined nên trả về lỗi", () => {
    const product = { ...validProduct, quantity: undefined };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe("Số lượng không được để trống");
  });
});
