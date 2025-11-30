// import { render, screen, waitFor } from "@testing-library/react";
// import * as productService from "../services/productService";
// import ProductList from "./ProductList";

// // Mock toàn bộ module productService
// jest.mock("../services/productService");

// describe("ProductList Integration Tests", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("TC1: Hiển thị danh sách sản phẩm thành công", async () => {
//     // ProductList.jsx mong đợi res.content là array
//     productService.getProducts.mockResolvedValueOnce({
//       content: [
//         { id: 1, name: "Laptop ABC", price: 1000, category: "Electronics" },
//         { id: 2, name: "Mouse XYZ", price: 200, category: "Electronics" }
//       ],
//       totalPages: 1
//     });

//     render(<ProductList />);

//     await waitFor(() => {
//       expect(screen.getByText("Laptop ABC")).toBeInTheDocument();
//       expect(screen.getByText("Mouse XYZ")).toBeInTheDocument();
//     });
//   });

//   test("TC2: Hiển thị thông báo lỗi khi API thất bại", async () => {
//     productService.getProducts.mockRejectedValueOnce(new Error("API Error"));

//     render(<ProductList />);

//     await waitFor(() => {
//       expect(screen.getByTestId("error-message"))
//         .toHaveTextContent("Không thể tải danh sách sản phẩm");
//     });
//   });

//   test("TC3: Hiển thị empty state khi không có sản phẩm", async () => {
//     productService.getProducts.mockResolvedValueOnce({
//       content: [],
//       totalPages: 0
//     });

//     render(<ProductList />);

//     await waitFor(() => {
//       expect(
//         screen.getByText("Không tìm thấy sản phẩm nào.")
//       ).toBeInTheDocument();
//     });
//   });
// });

import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import ProductList from "./ProductList";

import * as productService from "../services/productService";
import { toast } from "sonner";

jest.mock("../services/productService");

jest.mock("aos", () => ({
  refreshHard: jest.fn(),
  init: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("Product Feature Integration Tests (User Flows)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.history.pushState({}, "", "/");
  });

  const initialProducts = [
    { id: 1, name: "Sản phẩm A", price: 100, category: "Electronics" },
  ];
  const newProduct = {
    id: 2,
    name: "Sản phẩm Mới",
    price: 200,
    category: "Books",
  };

  test("Người dùng Thêm mới sản phẩm và thấy danh sách tự cập nhật", async () => {
    productService.getProducts
      .mockResolvedValueOnce({ content: initialProducts, totalPages: 1 })
      .mockResolvedValueOnce({
        content: [...initialProducts, newProduct],
        totalPages: 1,
      });

    productService.createProduct.mockResolvedValue({ success: true });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
    });

    const addBtn = screen.getByTestId("add-new-btn");
    fireEvent.click(addBtn);

    const nameInput = screen.getByTestId("product-name-input");
    const priceInput = screen.getByTestId("product-price-input");

    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "Sản phẩm Mới" } });
    fireEvent.change(priceInput, { target: { value: "200" } });

    const quantityInput = screen.getByTestId("product-quantity-input");
    fireEvent.change(quantityInput, { target: { value: "10" } });

    const submitBtn = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Sản phẩm Mới", price: 200 })
      );

      expect(
        screen.queryByDisplayValue("Sản phẩm Mới")
      ).not.toBeInTheDocument();
      expect(productService.getProducts).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Sản phẩm Mới")).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test("Người dùng Xem chi tiết sản phẩm (Mở ProductDetail thật)", async () => {
    productService.getProducts.mockResolvedValue({
      content: initialProducts,
      totalPages: 1,
    });

    productService.getProductById.mockResolvedValue({
      id: 1,
      name: "Sản phẩm A",
      price: 100,
      description: "Mô tả chi tiết nè",
    });

    render(<ProductList />);

    await waitFor(() => screen.getByText("Sản phẩm A"));

    fireEvent.click(screen.getByTestId("view-btn-1"));

    await waitFor(() => {
      expect(screen.getByText("Mô tả chi tiết nè")).toBeInTheDocument();
      expect(productService.getProductById).toHaveBeenCalledWith(1);
    });

    const closeBtn = screen.getByRole("button", { name: /×/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText("Mô tả chi tiết nè")).not.toBeInTheDocument();
    });
  });

  test(" Người dùng Xóa sản phẩm và danh sách cập nhật", async () => {
    productService.getProducts
      .mockResolvedValueOnce({
        content: [...initialProducts, newProduct],
        totalPages: 1,
      })
      .mockResolvedValueOnce({ content: initialProducts, totalPages: 1 });

    productService.deleteProduct.mockResolvedValue({ success: true });
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
      expect(screen.getByText("Sản phẩm Mới")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTestId("delete-btn-2");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(2);

      expect(productService.getProducts).toHaveBeenCalledTimes(2);

      expect(screen.queryByText("Sản phẩm Mới")).not.toBeInTheDocument();
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
    });
  });
});

describe("Product Feature Integration Tests (Extended Flows)", () => {
  test("Flow 4: Người dùng Sửa sản phẩm thành công", async () => {
    const productToEdit = {
      id: 1,
      name: "Sản phẩm Cũ",
      price: 100,
      category: "Electronics",
    };

    productService.getProducts.mockResolvedValue({
      content: [productToEdit],
      totalPages: 1,
    });

    productService.getProductById.mockResolvedValue(productToEdit);

    productService.updateProduct.mockResolvedValue({ success: true });

    render(<ProductList />);
    await waitFor(() => screen.getByText("Sản phẩm Cũ"));

    fireEvent.click(screen.getByTestId("edit-btn-1"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Sản phẩm Cũ")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("product-name-input"), {
      target: { value: "Sản phẩm Đã Sửa" },
    });
    fireEvent.change(screen.getByTestId("product-price-input"), {
      target: { value: "500" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: "Sản phẩm Đã Sửa", price: 500 })
      );

      expect(toast.success).toHaveBeenCalledWith("Cập nhật thành công!");
    });
  });

  test("Người dùng Tìm kiếm, Sắp xếp và Chuyển trang", async () => {
    productService.getProducts.mockResolvedValue({
      content: [],
      totalPages: 5,
    });

    render(<ProductList />);
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Macbook" } });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        "Macbook",
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
    });

    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "price-asc" } });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        "price",
        "asc"
      );
    });

    const nextBtn = screen.getByTestId("next-btn");
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        1,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
    });
  });

  test("Interaction: Chọn Category reset trang & Nút Previous hoạt động", async () => {
    productService.getProducts.mockResolvedValue({
      content: [{ id: 1, name: "SP Trang 1", price: 10, category: "A" }],
      totalPages: 3,
    });

    render(<ProductList />);
    await waitFor(() => screen.getByText("SP Trang 1"));

    const categorySelect = screen.getByTestId("category-filter");
    fireEvent.change(categorySelect, { target: { value: "Books" } });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        0,
        expect.anything(),
        expect.anything(),
        "Books",
        expect.anything(),
        expect.anything()
      );
    });

    const nextBtn = screen.getByTestId("next-btn");
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        1,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
    });

    const prevBtn = screen.getByText("« Trước");
    fireEvent.click(prevBtn);

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(
        0,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
    });
  });
});
