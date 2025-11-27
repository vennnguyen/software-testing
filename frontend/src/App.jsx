import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "sonner";

export default function App() {
  const styles = {
    nav: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "30px",
      padding: "15px 40px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginBottom: "30px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    link: {
      textDecoration: "none",
      color: "#6b7280", // Màu xám (mặc định)
      fontSize: "16px",
      fontWeight: "600",
      padding: "8px 16px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      fontFamily: "'Segoe UI', sans-serif",
    },
    activeLink: {
      color: "#2563eb", // Màu xanh (khi đang chọn)
      backgroundColor: "#eff6ff", // Nền xanh nhạt
    },
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const getLinkStyle = (path) => {
    // Nếu đường dẫn hiện tại trùng với path thì gộp thêm style active
    return location.pathname === path
      ? { ...styles.link, ...styles.activeLink }
      : styles.link;
  };

  return (
    <BrowserRouter>
      <div>
        {/* NAVIGATION BAR */}
        <nav style={styles.nav}>
          <Link to="/" style={getLinkStyle("/")}>
            Login
          </Link>

          <Link to="/product-list" style={getLinkStyle("/product-list")}>
            Products
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductForm />} />
        <Route path="/product-list" element={<ProductList />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}
