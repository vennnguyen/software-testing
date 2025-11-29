import React, { useState, useEffect } from "react";
import * as productService from "../services/productService";
import { validateProduct } from "../utils/productValidation";

const CATEGORIES = ["Electronics", "Books", "Clothing"];

const initialProductState = {
  name: "",
  price: 0,
  quantity: 0,
  description: "",
  category: CATEGORIES[0] || "",
};

// Nhận prop onSuccess từ ProductList truyền xuống
const ProductForm = ({ productIdToEdit = null, onSuccess }) => {
  const [product, setProduct] = useState(initialProductState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(""); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (productIdToEdit) {
      setStatus("loading");
      productService
        .getProductById(productIdToEdit)
        .then((data) => {
          setProduct({
            ...data,
            price: data.price || 0,
            quantity: data.quantity || 0,
          });
          setStatus("");
        })
        .catch(() => {
          setMessage("Lỗi khi tải dữ liệu sản phẩm.");
          setStatus("error");
        });
    } else {
      setProduct(initialProductState); // Reset form khi chuyển sang mode Add
    }
  }, [productIdToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "number" || name === "price" || name === "quantity"
        ? value === ""
          ? ""
          : parseFloat(value)
        : value;

    setProduct((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProduct(product);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      setMessage("Vui lòng kiểm tra lại các trường bị lỗi.");
      return;
    }

    setStatus("loading");
    setErrors({});
    setMessage("");

    try {
      if (productIdToEdit) {
        await productService.updateProduct(productIdToEdit, product);
        setMessage("Cập nhật sản phẩm thành công");
      } else {
        await productService.createProduct(product);
        setMessage("Thêm sản phẩm thành công");
        setProduct(initialProductState);
      }
      setStatus("success");

      if (onSuccess) onSuccess(); // Gọi callback để đóng modal và reload list

      // Auto hide message
      setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 3000);
    } catch (error) {
      setMessage(error.message || "Đã xảy ra lỗi trong quá trình xử lý API.");
      setStatus("error");
    }
  };

  const formTitle = productIdToEdit ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm mới";

  // --- STYLES (Đã loại bỏ các style cố định về vị trí) ---
  const styles = {
    container: {
      backgroundColor: "#fff",
      padding: "0px", // Bỏ padding vì modal đã có
      borderRadius: "0px", // Bỏ border radius/box shadow vì modal đã có
      boxShadow: "none",
      maxWidth: "100%",
      margin: "0", // Bỏ margin
      fontFamily: "'Segoe UI', sans-serif",
      border: "none",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "20px",
      textAlign: "center",
      borderBottom: "2px solid #3b82f6",
      paddingBottom: "10px",
      display: "inline-block",
    },
    titleWrapper: { textAlign: "center" },
    alert: {
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
    },
    alertSuccess: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
      border: "1px solid #6ee7b7",
    },
    alertError: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },
    formGroup: { marginBottom: "15px" },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "600",
      color: "#374151",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "15px",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
    inputError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
    errorText: { color: "#ef4444", fontSize: "12px", marginTop: "4px" },
    textarea: { minHeight: "100px", resize: "vertical" },
    select: { backgroundColor: "#fff" },
    submitBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: productIdToEdit ? "#f59e0b" : "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "opacity 0.2s",
      marginTop: "10px",
    },
    disabledBtn: { opacity: 0.7, cursor: "not-allowed" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleWrapper}>
        <h2 style={styles.title}>{formTitle}</h2>
      </div>

      {message && (
        <div
          style={{
            ...styles.alert,
            ...(status === "success" ? styles.alertSuccess : styles.alertError),
          }}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>
            Tên sản phẩm
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.name ? styles.inputError : {}),
            }}
            data-testid="product-name-input"
            placeholder="Nhập tên sản phẩm..."
          />
          {errors.name && (
            <p style={styles.errorText} data-testid="error-name">
              {errors.name}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label htmlFor="price" style={styles.label}>
              Giá (VNĐ)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.price ? styles.inputError : {}),
              }}
              data-testid="product-price-input"
            />
            {errors.price && (
              <p style={styles.errorText} data-testid="error-price">
                {errors.price}
              </p>
            )}
          </div>

          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label htmlFor="quantity" style={styles.label}>
              Số lượng
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.quantity ? styles.inputError : {}),
              }}
              data-testid="product-quantity-input"
            />
            {errors.quantity && (
              <p style={styles.errorText} data-testid="error-quantity">
                {errors.quantity}
              </p>
            )}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="category" style={styles.label}>
            Danh mục
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...styles.select,
              ...(errors.category ? styles.inputError : {}),
            }}
            data-testid="product-category-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p style={styles.errorText} data-testid="error-category">
              {errors.category}
            </p>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...styles.textarea,
              ...(errors.description ? styles.inputError : {}),
            }}
            maxLength="500"
            data-testid="product-description-input"
            placeholder="Mô tả chi tiết sản phẩm..."
          />
          {errors.description && (
            <p style={styles.errorText} data-testid="error-description">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          data-testid="submit-btn"
          style={{
            ...styles.submitBtn,
            ...(status === "loading" ? styles.disabledBtn : {}),
          }}
        >
          {status === "loading"
            ? "Đang xử lý..."
            : productIdToEdit
            ? "Cập nhật"
            : "Thêm mới"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
