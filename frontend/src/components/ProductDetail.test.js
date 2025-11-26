import { render, screen, waitFor } from "@testing-library/react";
import ProductDetail from "./ProductDetail";
import * as productService from "../services/productService";

jest.mock("../services/productService");

describe("Product Detail Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TC1: Nên hiển thị dữ liệu chi tiết sản phẩm khi tải thành công", async () => {
    const mockProduct = {
      id: 1,
      name: "Sách Lập trình",
      price: 500000,
      quantity: 5,
      category: "Books",
      description: "Tài liệu học React và Spring Boot",
    };

    productService.getProductById.mockResolvedValue(mockProduct);

    render(<ProductDetail productId={1} />);

    expect(screen.getByTestId("loading-message")).toBeInTheDocument();

    await waitFor(() => {
      expect(productService.getProductById).toHaveBeenCalledWith(1);
      expect(screen.getByTestId("product-detail-view")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Chi tiết Sản phẩm:/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId("product-price")).toHaveTextContent(
        "500.000 VNĐ"
      );
      expect(screen.getByText(/Số lượng:/i)).toBeInTheDocument();
    });
  });

  test("TC2: Nên hiển thị thông báo lỗi khi tải chi tiết sản phẩm thất bại", async () => {
    const errorMessage = "Lỗi mạng hoặc ID không tồn tại";

    productService.getProductById.mockRejectedValue(new Error(errorMessage));

    render(<ProductDetail productId={99} />);

    await waitFor(() => {
      expect(productService.getProductById).toHaveBeenCalledWith(99);
      expect(
        screen.getByText(`Lỗi khi tải chi tiết sản phẩm: ${errorMessage}`)
      ).toBeInTheDocument();
    });
  });
});
