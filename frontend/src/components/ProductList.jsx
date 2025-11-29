import React, { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { getProducts, deleteProduct } from "../services/productService";
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import { toast } from "sonner";

const CATEGORIES = ["Electronics", "Books", "Clothing"];

const styles = {
  wrapper: {
    maxWidth: "1000px",
    margin: "40px auto",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "0 20px",
  },
  container: {
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    minHeight: "400px",
    marginTop: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  header: {
    textAlign: "center",
    color: "#1f2937",
    fontSize: "32px",
    marginBottom: "30px",
    fontWeight: "700",
  },
  alert: {
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "600",
  },
  alertError: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  alertSuccess: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  emptyState: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },

  addButton: {
    display: "block",
    margin: "0 auto 30px auto",
    padding: "12px 25px",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    backgroundColor: "#10b981",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  searchInput: {
    flexGrow: 1,
    padding: "10px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    minWidth: "200px",
  },
  selectInput: {
    padding: "10px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
    cursor: "pointer",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: "15px 20px",
    marginBottom: "12px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #3b82f6",
    flexWrap: "wrap",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flexGrow: 1,
    minWidth: "150px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    color: "#059669",
    fontWeight: "500",
    fontSize: "16px",
  },
  category: {
    fontSize: "14px",
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: "4px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  btn: {
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    color: "white",
    transition: "background-color 0.2s",
  },
  viewBtn: {
    backgroundColor: "#4f46e5",
  },
  editBtn: {
    backgroundColor: "#f59e0b",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },

  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    width: "90%",
    maxWidth: "600px",
    position: "relative",
  },
  detailModal: {
    maxWidth: "800px",
  },
  closeModalBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#9ca3af",
    fontWeight: "bold",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  pageBtn: {
    padding: "10px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    color: "#374151",
    transition: "all 0.2s",
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "#f3f4f6",
  },
  pageInfo: {
    fontWeight: "500",
    color: "#4b5563",
  },
};

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const getInitialParam = (key) =>
    new URLSearchParams(window.location.search).get(key) || "";

  const [page, setPage] = useState(
    () => parseInt(getInitialParam("page")) || 0
  );
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState(() => getInitialParam("search"));
  const [category, setCategory] = useState(() => getInitialParam("category"));
  const [sortBy, setSortBy] = useState(() => getInitialParam("sortBy") || "id");
  const [sortDir, setSortDir] = useState(
    () => getInitialParam("sortDir") || "desc"
  );

  const pageSize = 3;

  const loadProducts = useCallback(() => {
    getProducts(page, pageSize, search, category, sortBy, sortDir)
      .then((res) => {
        if (res && Array.isArray(res.content)) {
          setItems(res.content);
          setTotalPages(res.totalPages || 0);
        } else if (Array.isArray(res)) {
          setItems(res);
          setTotalPages(1);
        } else {
          setItems([]);
        }

        const params = new URLSearchParams();
        if (page > 0) params.set("page", page);
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (sortBy !== "id") params.set("sortBy", sortBy);
        if (sortDir !== "asc") params.set("sortDir", sortDir);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, "", newUrl);

        AOS.refreshHard();
      })
      .catch(() => {
        setError("Không thể tải danh sách sản phẩm");
        toast.error("Không thể tải danh sách sản phẩm");
      });
  }, [page, search, category, sortBy, sortDir]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadProducts();
    handleCloseForm();
    const msg = editingId ? "Cập nhật thành công!" : "Thêm mới thành công!";
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
    toast.success(msg);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
      toast.success("Xóa thành công!");
      setSuccessMsg("Xóa thành công!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      toast.error("Lỗi khi xóa sản phẩm.");
      setError("Lỗi khi xóa sản phẩm.");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(0);
  };
  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split("-");
    setSortBy(field);
    setSortDir(dir);
    setPage(0);
  };

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };
  const handleNext = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  return (
    <div style={styles.wrapper}>
      <button
        style={styles.addButton}
        onClick={handleAdd}
        data-testid="add-new-btn"
      >
        + Thêm Sản phẩm mới
      </button>

      {/* Modal Form */}
      {isFormOpen && (
        <div style={styles.modalBackdrop} onClick={handleCloseForm}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeModalBtn} onClick={handleCloseForm}>
              &times;
            </button>
            <ProductForm
              productIdToEdit={editingId}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Modal Chi tiết */}
      {viewingId && (
        <div style={styles.modalBackdrop} onClick={() => setViewingId(null)}>
          <div
            style={{ ...styles.modalContent, ...styles.detailModal }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.closeModalBtn}
              onClick={() => setViewingId(null)}
            >
              &times;
            </button>
            <ProductDetail productId={viewingId} />
          </div>
        </div>
      )}

      <div style={styles.container} data-aos="fade-up">
        <h2 style={styles.header}>Danh sách Sản phẩm</h2>
        {error && (
          <div
            data-testid="error-message"
            style={{ ...styles.alert, ...styles.alertError }}
          >
            {error}
          </div>
        )}
        {successMsg && (
          <div
            data-testid="success-message"
            style={{ ...styles.alert, ...styles.alertSuccess }}
          >
            {successMsg}
          </div>
        )}
        {/* --- THANH LỌC & SORT --- */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={handleSearchChange}
            style={styles.searchInput}
            data-testid="search-input"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            style={styles.selectInput}
            data-testid="category-filter"
          >
            <option value="">Tất cả danh mục</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={handleSortChange}
            style={styles.selectInput}
            data-testid="sort-select"
          >
            <option value="id-asc">Mặc định (Cũ nhất)</option>
            <option value="id-desc">Mới thêm (Mới nhất)</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
          </select>
        </div>
        <ul style={styles.list} data-testid="product-list">
          {items.map((p, index) => (
            <li
              key={p.id}
              style={styles.item}
              data-aos="fade-right"
              data-aos-delay={index * 100}
              data-testid="product-item"
            >
              <div style={styles.info}>
                <span style={styles.name}>{p.name}</span>
                <span style={styles.price}>
                  {p.price || 0} VNĐ
                </span>
                <span style={styles.category}>{p.category}</span>
              </div>
              <div style={styles.actions}>
                <button
                  onClick={() => setViewingId(p.id)}
                  style={{ ...styles.btn, ...styles.viewBtn }}
                  data-testid={`view-btn-${p.id}`}
                >
                  Chi tiết
                </button>
                <button
                  onClick={() => handleEdit(p.id)}
                  style={{ ...styles.btn, ...styles.editBtn }}
                  data-testid={`edit-btn-${p.id}`}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ ...styles.btn, ...styles.deleteBtn }}
                  data-testid={`delete-btn-${p.id}`}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p style={styles.emptyState}>Không tìm thấy sản phẩm nào.</p>
        )}
        {/* --- PHÂN TRANG --- */}
        {totalPages > 1 && (
          <div style={styles.pagination} data-testid="pagination-controls">
            <button
              style={{
                ...styles.pageBtn,
                ...(page === 0 ? styles.pageBtnDisabled : {}),
              }}
              onClick={handlePrev}
              disabled={page === 0}
            >
              &laquo; Trước
            </button>
            <span style={styles.pageInfo}>
              Trang {page + 1} / {totalPages}
            </span>
            <button
              style={{
                ...styles.pageBtn,
                ...(page >= totalPages - 1 ? styles.pageBtnDisabled : {}),
              }}
              onClick={handleNext}
              disabled={page >= totalPages - 1}
              data-testid="next-btn"
            >
              Sau &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
