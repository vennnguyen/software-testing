import LoginPage from "../pages/LoginPage";

describe("Login E2E Tests (5.1.2)", () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it("TC1: Hiển thị form login và kiểm tra tương tác cơ bản", () => {
    LoginPage.getUsernameInput()
      .should("be.visible")
      .and("have.attr", "type", "text");
    LoginPage.getPasswordInput()
      .should("be.visible")
      .and("have.attr", "type", "password");
    LoginPage.getLoginButton().should("be.visible").and("be.enabled");

    LoginPage.getUsernameInput().type("temp").should("have.value", "temp");
    LoginPage.getUsernameInput().clear().should("have.value", "");
  });

  it("TC2: Đăng nhập thành công với credentials hợp lệ", () => {
    LoginPage.fillLoginForm("admin", "Test123");
    LoginPage.submit();

    LoginPage.getLoginMessage().should("contain", "Đăng nhập thành công");
  });

  it("TC3: Đăng nhập thất bại với credentials sai (API Error)", () => {
    LoginPage.fillLoginForm("testuser", "WrongPass456");
    LoginPage.submit();

    LoginPage.getLoginMessage().should("contain", "Sai thông tin đăng nhập");
  });

  it("TC4: Hiển thị lỗi validation khi Username quá ngắn (Boundary Test)", () => {
    LoginPage.fillLoginForm("ab", "Test123");
    LoginPage.submit();

    LoginPage.getUsernameError()
      .should("be.visible")
      .and("contain", "phải có ít nhất 3 ký tự");
  });

  it("TC5: Hiển thị lỗi validation khi Password không có chữ hoặc số (Negative Test)", () => {
    LoginPage.fillLoginForm("testuser", "abcdef");
    LoginPage.submit();

    cy.get('[data-testid="password-error"]')
      .should("be.visible")
      .and("contain", "Mật khẩu phải chứa cả chữ và số");
  });

  it("TC6: Ngăn chặn ký tự đặc biệt không hợp lệ trong Username (Edge Case)", () => {
    LoginPage.fillLoginForm("user!@#", "Test123");
    LoginPage.submit();

    LoginPage.getUsernameError()
      .should("be.visible")
      .and("contain", "Tên đăng nhập chỉ được chứa a-z, A-Z, 0-9");
  });
});
