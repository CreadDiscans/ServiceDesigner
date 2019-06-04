describe('Components', function() {
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

    it('Choice Component', function(){
        createComponent('new')
        cy.get('div[id="element-title"]').should('have.text', 'new')
    })

    it('Add Element', function() {
        createComponent('new')
        cy.get('div[id="element-title"]').siblings('div').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type('div{enter}')
        cy.get('.scrollarea-content').eq(1).should('have.text', 'div')
    })
})