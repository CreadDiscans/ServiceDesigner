describe('파일관리', function() {

    it('React 프로젝트에서 폴더를 추가 할 수 있다.', function() {
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-folder"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').should('have.text', 'next')
    })
    
    it('React 프로젝트에서 파일를 추가 할 수 있다.', function() {
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-file"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').should('have.text', 'next.js')
    })

    it('React 프로젝트에서 폴더를 삭제 할 수 있다.', function() {
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-folder"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').click()
        cy.get('button[id="remove-file"]').click()
        cy.get('span:last').should('have.not.text', 'next')
    })

    it('React 프로젝트에서 파일를 삭제 할 수 있다.', function() {
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-file"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').click()
        cy.get('button[id="remove-file"]').click()
        cy.get('span:last').should('have.not.text', 'next.js')
    })

    it('React-Native 프로젝트에서 폴더를 추가 할 수 있다.', function() {
        cy.visit('/');
        cy.get('button[name="react-native"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-folder"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').should('have.text', 'next')
    })
    
    it('React-Native 프로젝트에서 파일를 추가 할 수 있다.', function() {
        cy.visit('/');
        cy.get('button[name="react-native"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-file"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').should('have.text', 'next.js')
    })

    it('React-Native 프로젝트에서 폴더를 삭제 할 수 있다.', function() {
        cy.visit('/')
        cy.get('button[name="react-native"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-folder"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').click()
        cy.get('button[id="remove-file"]').click()
        cy.get('span:last').should('have.not.text', 'next')
    })

    it('React-Native 프로젝트에서 파일를 삭제 할 수 있다.', function() {
        cy.visit('/')
        cy.get('button[name="react-native"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-file"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').click()
        cy.get('button[id="remove-file"]').click()
        cy.get('span:last').should('have.not.text', 'next.js')
    })

    it('folder는 collapse기능을 지원한다.', function() {
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-folder"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').click()
        cy.get('button[id="add-file"]').click()
        cy.get('input').type('in_next{enter}')
        cy.get('svg').eq(18).click()
        cy.get('span:last').should('have.text', 'next')
        cy.get('svg').eq(18).click()
        cy.get('span:last').should('have.text', 'in_next.js')
    })

    it('folder/file을 선택 할 수 있다.', function() {
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-folder"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span').eq(2).click()
        cy.get('span').eq(2).should('have.css', 'color', 'rgb(255, 0, 0)')
        cy.get('span').eq(3).should('have.css', 'color', 'rgb(0, 0, 0)')
        cy.get('span').eq(3).click()
        cy.get('span').eq(2).should('have.css', 'color', 'rgb(0, 0, 0)')
        cy.get('span').eq(3).should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    it('undo/redu를 지원한다.', function() {
        cy.visit('/');
        cy.get('button[name="react"]').click()
        cy.get('div[id="folder"]').click()
        cy.get('button[id="add-file"]').click()
        cy.get('input').type('next{enter}')
        cy.get('span:last').should('have.text', 'next.js')
        cy.get('svg').eq(11).click()
        cy.get('span:last').should('have.text', 'home.js')
        cy.get('svg').eq(12).click()
        cy.get('span:last').should('have.text', 'next.js')
    })
})