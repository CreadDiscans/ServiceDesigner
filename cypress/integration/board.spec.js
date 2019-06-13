describe('Board', function() {
    beforeEach(function(){
        cy.visit('/')
        cy.get('button[name="dev"]').click()
    })
    
    function createComponent(name) {
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type(name+'{enter}')
        cy.get('.component-item').last().click()
    }

    it('tab add/delete', function() {
        createComponent('first')
        createComponent('second')
        cy.get('#board-tab-wrap').should('have.text', 'firstsecond')
        cy.get('.board-tab').eq(1).trigger('mouseover')
        cy.get('.board-tab-close').eq(1).click()
        cy.get('#board-tab-wrap').should('have.text', 'first')
    }) 

    it('tab overflow', function() {
        createComponent('aaa')
        createComponent('bbb')
        createComponent('ccc')
        createComponent('ddd')
        createComponent('eee')
        createComponent('fff')
        createComponent('ggg')
    })
})