import React, { useState, useEffect } from "react";
import * as productService from "../services/productService";

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (productId) {
      setStatus("loading");
      productService
        .getProductById(productId)
        .then((data) => {
          setProduct(data);
          setStatus("success");
        })
        .catch((error) => {
          setMessage(
            `Lỗi khi tải chi tiết sản phẩm: ${error.message || "Không rõ lỗi"}`
          );
          setStatus("error");
        });
    }
  }, [productId]);

  if (status === "loading") {
    return <p data-testid="loading-message">Đang tải chi tiết sản phẩm...</p>;
  }

  if (status === "error") {
    return <p className="alert alert-danger">{message}</p>;
  }

  if (!product) {
    return <p>Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div className="product-detail-container" data-testid="product-detail-view">
      <h2>Chi tiết Sản phẩm: {product.name}</h2>
      <p>
        <strong>ID:</strong> {product.id}
      </p>
      <p>
        <strong>Giá:</strong>{" "}
        <span data-testid="product-price">
          {product.price.toLocaleString("vi-VN")} VNĐ
        </span>
      </p>
      <p>
        <strong>Số lượng:</strong> {product.quantity}
      </p>
      <p>
        <strong>Danh mục:</strong> {product.category}
      </p>
      <p>
        <strong>Mô tả:</strong> {product.description || "Không có mô tả"}
      </p>
    </div>
  );
};

export default ProductDetail;
