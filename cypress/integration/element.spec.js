describe('Element 관리', function() {
    it('Element를 추가 할 수 있다.', function(){
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="element"]').click()
        cy.get('li').eq(0).click()
        cy.get('li').eq(1).click()
        cy.get('span:last').should('have.text', 'div')   
    })

    it('Element를 삭제 할 수 있다.', function(){
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="element"]').click()
        cy.get('li').eq(0).click()
        cy.get('li').eq(1).click()
        cy.get('span:last').click()
        cy.get('button:last').click()
        cy.get('span:last').should('have.text', 'layout')  
    })

    it('Element는 collapse를 지원한다.', function(){
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="element"]').click()
        cy.get('li').eq(0).click()
        cy.get('li').eq(1).click()
        cy.get('span:last').should('have.text', 'div')  
        cy.get('svg').eq(18).click()
        cy.get('span:last').should('have.text', 'layout') 
        cy.get('svg').eq(18).click()  
        cy.get('span:last').should('have.text', 'div') 
    })

    it('undo/redo를 지원한다.', function() {
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="element"]').click()
        cy.get('li').eq(0).click()
        cy.get('li').eq(1).click()
        cy.get('span:last').should('have.text', 'div')
        cy.get('svg').eq(11).click()
        cy.get('span:last').should('have.text', 'layout')
        cy.get('svg').eq(12).click()
        cy.get('span:last').should('have.text', 'div')
    })
});