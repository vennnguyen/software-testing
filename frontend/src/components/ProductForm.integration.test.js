import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "./ProductForm";
import * as productService from "../services/productService";

jest.mock("../services/productService");

describe("Product Form Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Tạo sản phẩm mới thành công và hiển thị thông báo success", async () => {
    productService.createProduct.mockResolvedValue({
      id: 1,
      name: "Laptop Dell",
      price: 15000000,
      quantity: 10,
      category: "Electronics",
    });

    render(<ProductForm />);

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Laptop Dell" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "15000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity-input"), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Thêm sản phẩm thành công")).toBeInTheDocument();
    });
  });

  test("Hiển thị lỗi validation khi Price là giá trị âm", async () => {
    render(<ProductForm />);

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "-1000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity-input"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(productService.createProduct).not.toHaveBeenCalled();
      expect(
        screen.getByText("Giá sản phẩm phải lớn hơn hoặc bằng 0")
      ).toBeInTheDocument();
    });
  });
});
