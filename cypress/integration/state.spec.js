describe('State 관리', function() {
    
    it('State를 Property로 사용 할 수 있다.', function(){
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#state').click()
        cy.get(".ace_text-input").type('{leftarrow}"title":"hello world"', {force:true})
        cy.get('#element').click()
        cy.get('li').eq(0).click()
        cy.get('li').eq(1).click()
        cy.get('#property').click()
        cy.get('span').eq(1).click()
        cy.get('input').eq(3).type('{{}this.state.title}')
        cy.get('#design > div > div').should('have.text', 'hello world')    
    })
})