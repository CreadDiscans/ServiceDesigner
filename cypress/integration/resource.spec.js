describe('Resource', function() {
    beforeEach(function(){
        cy.visit('/')
        cy.get('button[name="dev"]').click()
    })

    it('Color', function() {
        cy.get('.bottomTab').eq(1).click()
        cy.get('.sketch-picker').find('input').eq(0).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}ff0000')
        cy.get('#color-input').focus().type('new')
        cy.get('#color-create').click()
        cy.get('.color-item').click()
        cy.get('.color-item').should('have.css', 'backgroundColor', 'rgb(0, 0, 0)')
        cy.get('#color-cancel').click()
        cy.get('.color-item').should('have.css', 'backgroundColor', 'rgba(0, 0, 0, 0)')
        cy.get('.sketch-picker').find('input').eq(0).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}0000ff')
        cy.get('.color-item').click()
        cy.get('.sketch-picker').find('input').eq(0).should('have.value', 'FF0000')
        cy.get('.sketch-picker').find('input').eq(0).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}0000ff')
        cy.get('#color-update').click()
        cy.get('.color-item').should('have.text', 'new#0000ff')
        cy.get('#color-delete').click()
        cy.get('#color-item-wrap').should('have.text', '')

    })
})