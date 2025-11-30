import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

import * as productService from "../services/productService";
import * as productValidation from "../utils/productValidation";

jest.mock("../services/productService");
jest.mock("../utils/productValidation");

const mockedGetProducts = productService.getProducts;
const mockedGetProductById = productService.getProductById;
const mockedCreateProduct = productService.createProduct;
const mockedUpdateProduct = productService.updateProduct;
const mockedDeleteProduct = productService.deleteProduct;
const mockedValidateProduct = productValidation.validateProduct;

describe("Product Management Mock Tests (Full CRUD)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedValidateProduct.mockReturnValue({});
  });

  // Dữ liệu mẫu: 2 sản phẩm thật
  const mockList = [
    { id: 1, name: "Laptop Dell", price: 15000000 },
    { id: 2, name: "Chuột Logitech", price: 500000 },
  ];

  test("CREATE: Thêm sản phẩm mới thành công", async () => {
    mockedCreateProduct.mockResolvedValue({ success: true });
    render(<ProductForm />);

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "iPhone 15" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "30000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity-input"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByTestId("product-category-select"), {
      target: { value: "Electronics" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(mockedCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "iPhone 15",
          price: 30000000,
        })
      );
      expect(screen.getByText("Thêm sản phẩm thành công")).toBeInTheDocument();
    });
  });

  test("CREATE: Thất bại do Validation", async () => {
    mockedValidateProduct.mockReturnValue({
      name: "Tên sản phẩm không được để trống",
    });
    render(<ProductForm />);

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(mockedCreateProduct).not.toHaveBeenCalled();
      expect(screen.getByTestId("error-name")).toHaveTextContent(
        "Tên sản phẩm không được để trống"
      );
    });
  });

  test("CREATE: Hiển thị lỗi khi API Create thất bại", async () => {
    mockedCreateProduct.mockRejectedValue(new Error("Lỗi Server 500"));
    render(<ProductForm />);

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Lỗi Server 500")).toBeInTheDocument();
    });
  });

  test("READ: Hiển thị danh sách sản phẩm thành công", async () => {
    mockedGetProducts.mockResolvedValue({
      content: mockList,
      totalPages: 1,
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenCalledTimes(1);

      expect(screen.getByText(/Laptop Dell/i)).toBeInTheDocument();
    });
  });

  test("READ: Tải danh sách thất bại", async () => {
    mockedGetProducts.mockRejectedValue(new Error("Network Error"));
    render(<ProductList />);

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Không thể tải danh sách sản phẩm"
      );
    });
  });

  test("DELETE: Xóa sản phẩm thành công", async () => {
    window.confirm = jest.fn(() => true);

    mockedGetProducts.mockResolvedValue({
      content: mockList,
      totalPages: 1,
    });

    mockedDeleteProduct.mockResolvedValue({ success: true });

    render(<ProductList />);

    await waitFor(() => screen.getByText("Chuột Logitech"));

    const deleteBtn = screen.getByTestId("delete-btn-2");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockedDeleteProduct).toHaveBeenCalledWith(2);

      expect(screen.getByTestId("success-message")).toHaveTextContent(
        "Xóa thành công"
      );
    });
  });

  test("DELETE: Lỗi xóa thất bại", async () => {
    window.confirm = jest.fn(() => true);

    mockedGetProducts.mockResolvedValue({
      content: mockList,
      totalPages: 1,
    });

    mockedDeleteProduct.mockRejectedValue(new Error("Delete Error"));

    render(<ProductList />);

    await waitFor(() => screen.getByText("Chuột Logitech"));

    const deleteBtn = screen.getByTestId("delete-btn-2");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockedDeleteProduct).toHaveBeenCalledWith(2);
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Lỗi khi xóa sản phẩm"
      );
    });
  });
  test("UPDATE: Load dữ liệu cũ và Cập nhật thành công", async () => {
    const oldProduct = {
      id: 1,
      name: "Laptop Dell",
      price: 15000000,
      quantity: 5,
      category: "Electronics",
    };

    mockedGetProductById.mockResolvedValue(oldProduct);
    mockedUpdateProduct.mockResolvedValue({ success: true });

    render(<ProductForm productIdToEdit={1} />);

    await waitFor(() => {
      expect(mockedGetProductById).toHaveBeenCalledWith(1);
      expect(screen.getByTestId("product-name-input")).toHaveValue(
        "Laptop Dell"
      );
    });

    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "14000000" },
    });
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(mockedUpdateProduct).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "Laptop Dell",
          price: 14000000,
        })
      );
      expect(
        screen.getByText("Cập nhật sản phẩm thành công")
      ).toBeInTheDocument();
    });
  });

  test("UPDATE: Cập nhật thất bại", async () => {
    const oldProduct = {
      id: 1,
      name: "Laptop Dell",
      price: 15000000,
      quantity: 5,
      category: "Electronics",
    };

    mockedGetProductById.mockResolvedValue(oldProduct);
    mockedUpdateProduct.mockRejectedValue(new Error("Update Failed"));

    render(<ProductForm productIdToEdit={1} />);

    await waitFor(() => screen.getByTestId("product-name-input"));

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Update Failed")).toBeInTheDocument();
    });
  });
});
