class ProductPage {
  visit() {
    cy.visit("/product-list");
  }

  clickAddNew() {
    cy.get('[data-testid="add-new-btn"]').click();
  }

  openFormModal() {
    cy.get('[data-testid="modal-overlay"]').should(
      "be.visible"
    );
  }

  closeFormModal() {
    cy.get('[data-testid="close-modal-btn"]').click();
  }

  fillProductForm(product) {
    cy.get('[data-testid="product-name-input"]').clear().type(product.name);
    cy.get('[data-testid="product-price-input"]').clear().type(product.price);
  }

  submitForm() {
    cy.get('[data-testid="submit-btn"]').click();
  }

  getSuccessMessage() {
    return cy.get('[data-testid="success-message"]');
  }

  getProductInList(name) {
    return cy.contains('[data-testid="product-item"]', name);
  }

  clickEditButton(name) {
    this.getProductInList(name).find('[data-testid^="edit-btn-"]').click();
  }

  clickDeleteButton(name) {
    this.getProductInList(name).find('[data-testid^="delete-btn-"]').click();
  }

  fillSearchInput(keyword) {
    cy.get('[data-testid="search-input"]').clear().type(keyword);
  }

  selectSortByNewest() {
    cy.get('[data-testid="sort-select"]').select("id-desc");
  }
}

export default ProductPage;
