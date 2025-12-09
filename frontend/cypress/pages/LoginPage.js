class LoginPage {
  // Selectors
  usernameInput = '[data-testid="username-input"]';
  passwordInput = '[data-testid="password-input"]';
  loginButton = '[data-testid="login-button"]';
  loginMessage = '[data-testid="login-message"]';
  usernameError = '[data-testid="username-error"]';
  passwordError = '[data-testid="password-error"]';

  // Actions
  visit() {
    cy.visit("/login");
  }

  getUsernameInput() {
    return cy.get(this.usernameInput);
  }

  getPasswordInput() {
    return cy.get(this.passwordInput);
  }

  getLoginButton() {
    return cy.get(this.loginButton);
  }

  fillLoginForm(username, password) {
    this.getUsernameInput().type(username);
    this.getPasswordInput().type(password);
  }

  submit() {
    cy.get(this.loginButton).click();
  }

  getLoginMessage() {
    return cy.get(this.loginMessage);
  }

  getUsernameError() {
    return cy.get(this.usernameError);
  }

  getPasswordError() {
    return cy.get(this.passwordError);
  }
}

export default new LoginPage();
