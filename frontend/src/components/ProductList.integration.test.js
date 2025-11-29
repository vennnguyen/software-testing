import { render, screen, waitFor } from "@testing-library/react";
import * as productService from "../services/productService";
import ProductList from "./ProductList";

// Mock toàn bộ module productService
jest.mock("../services/productService");

describe("ProductList Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TC1: Hiển thị danh sách sản phẩm thành công", async () => {
    // ProductList.jsx mong đợi res.content là array
    productService.getProducts.mockResolvedValueOnce({
      content: [
        { id: 1, name: "Laptop ABC", price: 1000, category: "Electronics" },
        { id: 2, name: "Mouse XYZ", price: 200, category: "Electronics" }
      ],
      totalPages: 1
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Laptop ABC")).toBeInTheDocument();
      expect(screen.getByText("Mouse XYZ")).toBeInTheDocument();
    });
  });

  test("TC2: Hiển thị thông báo lỗi khi API thất bại", async () => {
    productService.getProducts.mockRejectedValueOnce(new Error("API Error"));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message"))
        .toHaveTextContent("Không thể tải danh sách sản phẩm");
    });
  });

  test("TC3: Hiển thị empty state khi không có sản phẩm", async () => {
    productService.getProducts.mockResolvedValueOnce({
      content: [],
      totalPages: 0
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(
        screen.getByText("Không tìm thấy sản phẩm nào.")
      ).toBeInTheDocument();
    });
  });
});
