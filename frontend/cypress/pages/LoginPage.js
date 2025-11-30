class LoginPage {
  // Selectors
  usernameInput = '[data-testid="username-input"]';
  passwordInput = '[data-testid="password-input"]';
  loginButton = '[data-testid="login-button"]';
  loginMessage = '[data-testid="login-message"]';
  usernameError = '[data-testid="username-error"]';

  // Actions
  visit() {
    cy.visit("/login");
  }

  fillLoginForm(username, password) {
    cy.get(this.usernameInput).type(username);
    cy.get(this.passwordInput).type(password);
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
}

export default new LoginPage();
