import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import * as auth from "../services/auth";

jest.mock("../services/auth");

describe("Login Component Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Nên hiển thị lỗi validation khi submit form rỗng", async () => {
    render(<Login />);
    const submitButton = screen.getByTestId("login-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("username-error")).toHaveTextContent(
        "Tên đăng nhập không được để trống"
      );
      expect(auth.login).not.toHaveBeenCalled();
    });
  });

  test("Nên gọi API và hiển thị thông báo thành công với credentials hợp lệ", async () => {
    auth.login.mockResolvedValue({
      success: true,
      message: "Đăng nhập thành công",
      token: "mock-token-123",
    });

    render(<Login />);
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("login-button");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "Test123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledWith("testuser", "Test123");
      expect(screen.getByTestId("login-message")).toHaveTextContent(
        "Đăng nhập thành công"
      );
    });
  });

  test("Nên hiển thị thông báo lỗi khi đăng nhập thất bại từ API", async () => {
    auth.login.mockResolvedValue({
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không đúng",
    });

    render(<Login />);
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("login-button");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "WrongPass123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("login-message")).toHaveTextContent(
        "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    });
  });
});
