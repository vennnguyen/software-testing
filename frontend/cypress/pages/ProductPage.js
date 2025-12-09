class ProductPage {
  addNewButton = '[data-testid="add-new-btn"]'
  modal = '[data-testid="modal-overlay"]'
  closeModel = '[data-testid="close-modal-btn"]'
  nameProductInput = '[data-testid="product-name-input"]'
  priceProductInput = '[data-testid="product-price-input"]'
  submitButton = '[data-testid="submit-btn"]'
  successMessage = '[data-testid="success-message"]'
  productItem = '[data-testid="product-item"]'
  editButton = '[data-testid^="edit-btn-"]'
  deleteButton = '[data-testid^="delete-btn-"]'
  searchInput = '[data-testid="search-input"]'
  sortSelect = '[data-testid="sort-select"]'

  visit() {
    cy.visit("/product-list");
  }

  clickAddNew() {
    cy.get(this.addNewButton).click();
  }

  shouldModalBeVisible() {
    cy.get(this.modal).should("be.visible");
  }

  closeFormModal() {
    cy.get(this.closeModel).click();
  }

  fillProductForm(product) {
    cy.get(this.nameProductInput).clear().type(product.name);
    cy.get(this.priceProductInput).clear().type(product.price);
  }

  submitForm() {
    cy.get(this.submitButton).click();
  }

  getSuccessMessage() {
    return cy.get(this.successMessage);
  }

  getProductInList(name) {
    return cy.contains(this.productItem, name);
  }

  clickEditButton(name) {
    this.getProductInList(name).find(this.editButton).click();
  }

  clickDeleteButton(name) {
    this.getProductInList(name).find(this.deleteButton).click();
  }

  fillSearchInput(keyword) {
    cy.get(this.searchInput).clear().type(keyword);
  }

  selectSortByNewest() {
    cy.get(this.sortSelect).select("id-desc");
  }
}

export default ProductPage;
