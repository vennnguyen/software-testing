import React, { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { getProducts, deleteProduct } from "../services/productService";
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import { toast } from "sonner";

import "./ProductList.css";

const CATEGORIES = ["Electronics", "Books", "Clothing"];

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
    <div className="wrapper">
      <button
        className="addButton"
        onClick={handleAdd}
        data-testid="add-new-btn"
      >
        + Thêm Sản phẩm mới
      </button>

      {/* Modal - Form */}
      {isFormOpen && (
        <div className="modalBackdrop" onClick={handleCloseForm}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="closeModalBtn" onClick={handleCloseForm}>
              &times;
            </button>
            <ProductForm
              productIdToEdit={editingId}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Modal - Chi tiết */}
      {viewingId && (
        <div className="modalBackdrop" onClick={() => setViewingId(null)}>
          <div
            className="modalContent detailModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="closeModalBtn"
              onClick={() => setViewingId(null)}
            >
              &times;
            </button>
            <ProductDetail productId={viewingId} />
          </div>
        </div>
      )}

      <div className="container" data-aos="fade-up">
        <h2 className="header">Danh sách Sản phẩm</h2>

        {error && (
          <div className="alert alertError" data-testid="error-message">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="alert alertSuccess" data-testid="success-message">
            {successMsg}
          </div>
        )}

        {/* Filters */}
        <div className="filterBar">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={handleSearchChange}
            className="searchInput"
            data-testid="search-input"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="selectInput"
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
            className="selectInput"
            data-testid="sort-select"
          >
            <option value="id-asc">Mặc định (Cũ nhất)</option>
            <option value="id-desc">Mới thêm (Mới nhất)</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
          </select>
        </div>

        {/* List */}
        <ul className="list" data-testid="product-list">
          {items.map((p, index) => (
            <li
              key={p.id}
              className="item"
              data-aos="fade-right"
              data-aos-delay={index * 100}
              data-testid="product-item"
            >
              <div className="info">
                <span className="name">{p.name}</span>
                <span className="price">{p.price || 0} VNĐ</span>
                <span className="category">{p.category}</span>
              </div>

              <div className="actions">
                <button
                  className="btn viewBtn"
                  onClick={() => setViewingId(p.id)}
                  data-testid={`view-btn-${p.id}`}
                >
                  Chi tiết
                </button>

                <button
                  className="btn editBtn"
                  onClick={() => handleEdit(p.id)}
                  data-testid={`edit-btn-${p.id}`}
                >
                  Sửa
                </button>

                <button
                  className="btn deleteBtn"
                  onClick={() => handleDelete(p.id)}
                  data-testid={`delete-btn-${p.id}`}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>

        {items.length === 0 && (
          <p className="emptyState">Không tìm thấy sản phẩm nào.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination" data-testid="pagination-controls">
            <button
              className={`pageBtn ${page === 0 ? "pageBtnDisabled" : ""}`}
              onClick={handlePrev}
              disabled={page === 0}
            >
              &laquo; Trước
            </button>

            <span className="pageInfo">
              Trang {page + 1} / {totalPages}
            </span>

            <button
              className={`pageBtn ${
                page >= totalPages - 1 ? "pageBtnDisabled" : ""
              }`}
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
