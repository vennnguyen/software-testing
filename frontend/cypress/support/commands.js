const apiUrl = Cypress.env("apiUrl") || "http://localhost:8080";

Cypress.Commands.add("login", (username, password) => {
  cy.request("POST", `${apiUrl}/api/auth/login`, {
    username,
    password,
  }).then((res) => {
    localStorage.setItem("authToken", res.body.token);
  });
});
