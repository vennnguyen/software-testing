import React, { useState } from "react";
import { validateUsername, validatePassword } from "../utils/validation";
import { login } from "../services/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' | 'error'
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);

    setUsernameError(uErr || "");
    setPasswordError(pErr || "");
    setMsg(""); // Reset message

    if (uErr || pErr) return;

    setIsLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        setMsg(res.message || "Đăng nhập thành công");
        setMsgType("success");
      } else {
        setMsg(res.message || "Đăng nhập thất bại");
        setMsgType("error");
      }
    } catch (e) {
      setMsg("Login failed. Vui lòng thử lại sau.");
      setMsgType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CSS Styles ---
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      marginBottom: "24px",
      color: "#1a1a1a",
      fontSize: "24px",
      fontWeight: "600",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#4a4a4a",
      fontSize: "14px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#ff4d4f",
    },
    errorMessage: {
      color: "#ff4d4f",
      fontSize: "13px",
      marginTop: "5px",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
      opacity: isLoading ? 0.7 : 1,
    },
    alert: {
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "20px",
      fontSize: "14px",
      textAlign: "center",
      backgroundColor: msgType === "success" ? "#f6ffed" : "#fff2f0",
      border: `1px solid ${msgType === "success" ? "#b7eb8f" : "#ffccc7"}`,
      color: msgType === "success" ? "#52c41a" : "#ff4d4f",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng nhập</h2>
        
        {msg && (
          <div style={styles.alert} data-testid="login-message">
            {msg}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              data-testid="username-input"
              type="text"
              style={{
                ...styles.input,
                ...(usernameError ? styles.inputError : {}),
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
            />
            {usernameError && (
              <div style={styles.errorMessage} data-testid="username-error">
                {usernameError}
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              data-testid="password-input"
              type="password"
              style={{
                ...styles.input,
                ...(passwordError ? styles.inputError : {}),
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
            {passwordError && (
              <div style={styles.errorMessage} data-testid="password-error">
                {passwordError}
              </div>
            )}
          </div>

          <button 
            data-testid="login-button" 
            type="submit" 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}