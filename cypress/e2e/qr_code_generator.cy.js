describe('QR Code Generator', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the page and shows the main UI', () => {
    cy.get('#url-input').should('exist');
    cy.get('#qrcode').should('exist');
    cy.get('#download-btn').should('exist');
    cy.get('#copy-link-btn').should('exist');
    cy.get('#clear-btn').should('exist');
    cy.get('#image-overlay').should('exist');
  });

  it('generates a QR code when a URL is entered', () => {
    cy.get('#url-input').type('https://example.com');
    cy.get('#qrcode img, #qrcode canvas').should('exist');
  });

  it('can clear all fields', () => {
    cy.get('#url-input').type('https://example.com');
    cy.get('#clear-btn').click();
    cy.get('#url-input').should('have.value', '');
    cy.get('#qrcode img, #qrcode canvas').should('not.exist');
  });
}); 