import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./Login";

import { validateUsername, validatePassword } from "../utils/validation";
import * as authService from "../services/auth";

jest.mock("../utils/validation");
jest.mock("../services/auth");

const mockedValidateUsername = jest.mocked(validateUsername);
const mockedValidatePassword = jest.mocked(validatePassword);
const mockedLogin = jest.mocked(authService.login);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Login Component Mock Tests", () => {
  test("Mock: Đăng nhập thành công", async () => {
    mockedValidateUsername.mockReturnValue("");
    mockedValidatePassword.mockReturnValue("");

    mockedLogin.mockResolvedValue({
      success: true,
      token: "Mock-token-123",
      message: "Đăng nhập thành công",
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validpass" },
    });

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledTimes(1);

      expect(mockedLogin).toHaveBeenCalledWith("validuser", "validpass");

      expect(screen.getByTestId("login-message")).toHaveTextContent(
        "Đăng nhập thành công"
      );
    });
  });

  test("Mock: hiển thị lỗi Login failed khi API trả về lỗi", async () => {
    mockedValidateUsername.mockReturnValue("");
    mockedValidatePassword.mockReturnValue("");

    mockedLogin.mockRejectedValue(new Error("API Error"));

    render(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validpass" },
    });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledTimes(1);

      expect(mockedLogin).toHaveBeenCalledWith("validuser", "validpass");

      expect(screen.getByTestId("login-message")).toHaveTextContent(
        "Login failed"
      );
    });
  });

  test("Mock: hiển thị thông báo thất bại từ server khi success là false", async () => {
    mockedValidateUsername.mockReturnValue("");
    mockedValidatePassword.mockReturnValue("");

    mockedLogin.mockResolvedValue({
      success: false,
      message: "Sai mật khẩu.",
    });

    render(<Login />);
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByTestId("login-message")).toHaveTextContent(
        "Sai mật khẩu."
      );
    });
  });
});
