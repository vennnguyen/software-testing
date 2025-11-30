import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; //
import Login from './components/Login'; //

// 1. Import các hàm chúng ta cần giả lập (mock)
import { validateUsername, validatePassword } from '../utils/validation';
import * as authService from '../services/auth';

// 2. Yêu cầu Jest "chặn" các file này và thay bằng bản giả (mock)
jest.mock('../utils/validation');
jest.mock('../services/auth');

// 3. Ép kiểu các hàm mock để VS Code (hoặc TypeScript) nhận diện
const mockedValidateUsername = validateUsername;
const mockedValidatePassword = validatePassword;
const mockedLogin = authService.login;

describe('Login Component Mock Tests', () => {

  // Xóa lịch sử (số lần gọi) của các hàm mock trước mỗi test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Đăng nhập thành công
  test('Mock: Đăng nhập thành công', async () => {

    mockedValidateUsername.mockReturnValue('');
    mockedValidatePassword.mockReturnValue('');

    mockedLogin.mockResolvedValue({ success:true, token:"Mock-token-123", message:"Đăng nhập thành công" });

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'validpass' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      // Kiểm tra xem hàm mockedLogin có được gọi đúng 1 lần
      expect(mockedLogin).toHaveBeenCalledTimes(1);
      // Kiểm tra xem nó được gọi với đúng tham số
      expect(mockedLogin).toHaveBeenCalledWith('validuser', 'validpass');

      // Kiểm tra xem thông báo thành công có hiển thị
      expect(screen.getByTestId('login-message')).toHaveTextContent('Đăng nhập thành công');
    });
  });

  // Đăng nhập thất bại (do API lỗi)
  test('Mock: hiển thị lỗi "Login failed" khi API trả về lỗi', async () => {

    mockedValidateUsername.mockReturnValue('');
    mockedValidatePassword.mockReturnValue('');

    mockedLogin.mockRejectedValue(new Error('API Error'));

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'validpass' } });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      // Kiểm tra hàm login có được gọi
      expect(mockedLogin).toHaveBeenCalledTimes(1);

      // Kiểm tra xem nó được gọi với đúng tham số
      expect(mockedLogin).toHaveBeenCalledWith('validuser', 'validpass');

      // Kiểm tra xem thông báo lỗi có hiển thị
      expect(screen.getByTestId('login-message')).toHaveTextContent('Login failed');
    });
  });

  // Lỗi API (Logic nghiệp vụ - success: false) ---
    test('Mock: hiển thị thông báo thất bại từ server khi success là false', async () => {
        // Arrange
        mockedValidateUsername.mockReturnValue('');
        mockedValidatePassword.mockReturnValue('');

        mockedLogin.mockResolvedValue({
            success: false,
            message: "Sai mật khẩu."
        });

        // Act
        render(<Login />);
        fireEvent.click(screen.getByTestId('login-button'));

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId('login-message')).toHaveTextContent('Sai mật khẩu.');
        });
    });
});