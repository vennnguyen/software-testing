import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as productService from "../services/productService";
import ProductForm from "./ProductForm";

// Mock service
jest.mock("../services/productService");

describe("ProductForm Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TC10: Hiển thị lỗi validation khi submit dữ liệu không hợp lệ", async () => {
    render(<ProductForm />);
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: -1000, name: "price" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(
        screen.getByText("Vui lòng kiểm tra lại các trường bị lỗi.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Giá sản phẩm phải lớn hơn hoặc bằng 0")
      ).toBeInTheDocument();
    });
  });

  test("TC11: Submit thành công khi thêm sản phẩm mới", async () => {
    productService.createProduct.mockResolvedValueOnce({});
    render(<ProductForm />);
    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Laptop Dell", name: "name" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: 1000, name: "price" },
    });
    fireEvent.change(screen.getByTestId("product-quantity-input"), {
      target: { value: 5, name: "quantity" },
    });
    fireEvent.change(screen.getByTestId("product-description-input"), {
      target: { value: "Mô tả ngắn", name: "description" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Thêm sản phẩm thành công")).toBeInTheDocument();
    });
  });

  test("TC12: Submit thất bại khi API lỗi", async () => {
    productService.createProduct.mockRejectedValueOnce(new Error("API Error"));
    render(<ProductForm />);
    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Laptop Dell", name: "name" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: 1000, name: "price" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  test("TC13: Khi edit sản phẩm, gọi getProductById và hiển thị dữ liệu", async () => {
    productService.getProductById.mockResolvedValueOnce({
      name: "Book ABC",
      price: 200,
      quantity: 2,
      description: "Sách hay",
      category: "Books",
    });

    render(<ProductForm productIdToEdit={1} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Book ABC")).toBeInTheDocument();
      expect(screen.getByDisplayValue("200")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Sách hay")).toBeInTheDocument();
    });
  });

  test("TC14: Khi edit sản phẩm nhưng API lỗi, hiển thị thông báo lỗi", async () => {
    productService.getProductById.mockRejectedValueOnce(new Error("Not Found"));
    render(<ProductForm productIdToEdit={999} />);

    await waitFor(() => {
      expect(
        screen.getByText("Lỗi khi tải dữ liệu sản phẩm.")
      ).toBeInTheDocument();
    });
  });
});
