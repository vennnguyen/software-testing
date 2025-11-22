// File: src/utils/validation.test.js

import { validateUsername, validatePassword } from './validation';

describe('Login Validation Tests', () => {

    // --- a) Unit Tests cho validateUsername() (2 điểm) ---
    describe('validateUsername()', () => {
        // Test username rỗng
        test('TC1: Username rỗng nên trả về lỗi', () => {
            // Đây là lỗi mong muốn nếu hàm trả về chuỗi lỗi, hoặc true/false
            expect(validateUsername('')).toBe('Tên đăng nhập không được để trống');
        });

        // Test username quá ngắn (Boundary Test: < 3 ký tự)
        test('TC2: Username quá ngắn (2 ký tự) nên trả về lỗi', () => {
            expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
        });

        // Test username quá dài (Boundary Test: > 50 ký tự)
        test('TC3: Username quá dài (51 ký tự) nên trả về lỗi', () => {
            // Chuỗi 51 ký tự
            const longUsername = 'a'.repeat(51); 
            expect(validateUsername(longUsername)).toBe('Tên đăng nhập không được vượt quá 50 ký tự');
        });

        // Test ký tự đặc biệt không hợp lệ
        test('TC4: Username chứa ký tự đặc biệt (@, #) nên trả về lỗi', () => {
            expect(validateUsername('user@123')).toBe('Tên đăng nhập chỉ được chứa a-z, A-Z, 0-9');
        });
        
        // Test username hợp lệ
        test('TC5: Username hợp lệ (user123) nên không có lỗi', () => {
            expect(validateUsername('user123')).toBe('');
        });
    });

    // --- b) Unit Tests cho validatePassword() (2 điểm) ---
    describe('validatePassword()', () => {
        // Test password rỗng
        test('TC6: Password rỗng nên trả về lỗi', () => {
            expect(validatePassword('')).toBe('Mật khẩu không được để trống');
        });

        // Test password quá ngắn (Boundary Test: < 6 ký tự)
        test('TC7: Password quá ngắn (5 ký tự) nên trả về lỗi', () => {
            expect(validatePassword('Pass1')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
        });
        
        // Test password không có chữ hoặc số
        test('TC8: Password không có số nên trả về lỗi', () => {
            expect(validatePassword('testtest')).toBe('Mật khẩu phải chứa cả chữ và số');
        });

        test('TC9: Password không có chữ nên trả về lỗi', () => {
            expect(validatePassword('1234567')).toBe('Mật khẩu phải chứa cả chữ và số');
        });

        // Test password hợp lệ
        test('TC10: Password hợp lệ (Test123) nên không có lỗi', () => {
            expect(validatePassword('Test123')).toBe('');
        });
    });
    
    // c) Coverage >= 90% cho validation module (1 điểm) 
    // Yêu cầu này được đáp ứng bằng việc đảm bảo các tests trên cover tất cả các nhánh logic trong hàm validateUsername và validatePassword.
});