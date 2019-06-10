describe('Elements', function() {
    beforeEach(function(){
        cy.visit('/')
        cy.get('button[name="dev"]').click()
    })

    function createComponent(name) {
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type(name+'{enter}')
        cy.get('.scrollarea-content').eq(0).click()
    }

    function createElement(name) {
        cy.get('div[id="element-title"]').siblings('div').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type(name+'{enter}')
    }

    it('Create String Property', function(){
        createComponent('new')
        createElement('div')
        cy.get('.scrollarea-content').eq(1).find('div').eq(0).click()
        cy.get('div[id="Property"]').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="property-name-input"]').type('new')
        cy.get('input[id="property-value-input"]').type('value')
        cy.get('button[id="property-submit"]').click()
        cy.get('div[id="property-list"]').find('div').eq(1).should('have.text', 'newstring')
        cy.get('input[id="property-name-input"]').should('have.value', '')
        cy.get('div[id="property-list"]').find('div').eq(1).click()
        cy.get('input[id="property-value-input"]').should('have.value', 'value')
    })
});