describe('공유 리소스 관리', function() {
    
    it('Css를 편집 및 적용 할 수 있다.', function(){
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#css').click()
        cy.get(".ace_text-input").type('.main {{} margin: 5px; }', {force:true})
        cy.get('button').eq(0).click()
        cy.get('#property').click()
        cy.get('input').eq(1).type('main')
        cy.get('#design > div > div').should('have.css', 'margin', '5px')    
        cy.get('#css').click()
        cy.get('#sidebar').find('div').eq(25).click()
        cy.get(".ace_text-input:first").type('{selectall}{backspace}.main {{} margin: 10px; }', {force:true})
        cy.get('button').eq(0).click()
        cy.get('#design > div > div').should('have.css', 'margin', '10px')
        cy.get('button').eq(1).click()
        cy.get('#design > div > div').should('have.css', 'margin', '0px')  
    })

    it('Color를 편집 및 적용 할 수 있다.', function(){
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#color').click()
        cy.get('input').eq(0).type('{selectall}{backspace}ff0000')
        cy.get('input').eq(5).type('red')
        cy.get('button').eq(0).click()
        cy.get('#property').click()
        cy.get(".ace_text-input").type('{leftarrow}padding:10px;background:"Color.red";', {force:true})
        cy.get('#design > div > div').should('have.css', 'background-color', 'rgb(255, 0, 0)')    
        cy.get('#color').click()
        cy.get('input').eq(5).type('red')
        cy.get('input').eq(0).type('{selectall}{backspace}0000ff')
        cy.get('button').eq(0).click()
        cy.get('#design > div > div').should('have.css', 'background-color', 'rgb(0, 0, 255)')
        cy.get('#sidebar').find('div').eq(69).should('have.text', 'red')
        cy.get('button').eq(1).click()
        cy.get('#sidebar').find('div').eq(69).should('have.not.text', 'red')
    })

    it('Asset을 편집 및 적용 할 수 있다.', function(){
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#asset').click()
        cy.get('input').eq(0).type('file')
        // cy.get('button').eq(0).click()
        cy.fixture('image.png').as('img')
        cy.get('input').eq(1).then(subject=> {
            return cy.fixture('image.png')
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob=> {
                const el = subject[0]
                const file = new File([blob], 'image.png', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                el.files = dataTransfer.files
                return subject
            })
        })
        cy.get('input').eq(1).trigger('change', {force:true});
        cy.get('#property').click()
        cy.get(".ace_text-input").type('{leftarrow}padding:100px;background: "Asset.file"', {force:true})
        cy.get('#design > div > div').should('have.css', 'background-image').and('match', /data:/)
    })

    it('Css undo/redo를 지원한다', function() {
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#property').click()
        cy.get('input').eq(1).type('main')
        cy.get('#css').click()
        cy.get(".ace_text-input").type('.main {{} margin: 5px; }', {force:true})
        cy.get('button').eq(0).click()
        cy.get('#design > div > div').should('have.css', 'margin', '5px')  
        cy.get('svg').eq(11).click()
        cy.get('#design > div > div').should('have.css', 'margin', '0px')  
        cy.get('svg').eq(12).click()
        cy.get('#design > div > div').should('have.css', 'margin', '5px')  
    })

    it('Color undo/redo를 지원한다.', function() {
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#property').click()
        cy.get(".ace_text-input").type('{leftarrow}padding:10px;background:"Color.red";', {force:true})
        cy.get('#color').click()
        cy.get('input').eq(0).type('{selectall}{backspace}ff0000')
        cy.get('input').eq(5).type('red')
        cy.get('button').eq(0).click()
        cy.get('input').eq(0).type('{selectall}{backspace}0000ff')
        cy.get('button').eq(0).click()
        cy.get('#design > div > div').should('have.css', 'background-color', 'rgb(0, 0, 255)')   
        cy.get('svg').eq(11).click() 
        cy.get('#design > div > div').should('have.css', 'background-color', 'rgb(255, 0, 0)') 
        cy.get('svg').eq(12).click()
        cy.get('#design > div > div').should('have.css', 'background-color', 'rgb(0, 0, 255)') 
    })

    it('Asset undo/redo를 지원한다.', function() {
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('#property').click()
        cy.get(".ace_text-input").type('{leftarrow}padding:100px;background: "Asset.file"', {force:true})
        cy.get('#asset').click()
        cy.get('input').eq(0).type('file')
        // cy.get('button').eq(0).click()
        cy.fixture('image.png').as('img')
        cy.get('input').eq(1).then(subject=> {
            return cy.fixture('image.png')
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob=> {
                const el = subject[0]
                const file = new File([blob], 'image.png', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                el.files = dataTransfer.files
                return subject
            })
        })
        cy.get('input').eq(1).trigger('change', {force:true});
        cy.get('#design > div > div').should('have.css', 'background-image').and('match', /data:/)  
        cy.get('svg').eq(11).click() 
        cy.get('#design > div > div').should('have.css', 'background-image').and('match', /data:/) 
        cy.get('svg').eq(12).click()
        cy.get('#design > div > div').should('have.css', 'background-image').and('match', /data:/) 
    })
})