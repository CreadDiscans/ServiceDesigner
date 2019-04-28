describe('파일관리', function() {

    it('React 프로젝트에서 폴더를 추가 할 수 있다.', function() {
        cy.visit('/');
        
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
    })
})