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

    it('Asset', function() {
        cy.get('.bottomTab').eq(2).click()
        cy.get('#asset-input').focus().type('new')
        cy.fixture('image.png').as('img')
        cy.get('#asset-file-input').then(subject=> {
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
        cy.get('#asset-file-input').trigger('change', {force:true});
        cy.get('.asset-item').should('have.css', 'backgroundColor', 'rgb(0, 0, 0)')
        cy.get('#asset-cancel').click()
        cy.get('.asset-item').should('have.css', 'backgroundColor', 'rgba(0, 0, 0, 0)')
        cy.get('.asset-item').click()
        cy.get('#asset-delete').click()
        cy.get('#asset-item-wrap').should('have.text', '')
    })

    it('Css', function() {
        cy.get('.bottomTab').eq(3).click()
        cy.get('#css-input-url').type('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
        cy.get('#css-button-add-url').click()
        cy.get('.css-item').click()
        cy.get('#css-input-url').should('have.value', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
        cy.get('#css-input-url').type('{backspace}')
        cy.get('#css-button-update').click()
        cy.get('#css-button-cancel').click()
        cy.get('#css-input-url').should('have.value', '')
        cy.get('.css-item').click()
        cy.get('#css-input-url').should('have.value', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.cs')
        cy.get('#css-button-delete').click()
        cy.get("#css-item-wrap").should('have.text', '')

        cy.get('#css-input-file').then(subject=> {
            return cy.fixture('test.css')
            .then(style=> {
                const el = subject[0]
                const file = new File([style], 'test.css', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                el.files = dataTransfer.files
                return subject
            })
        })
        cy.get('#css-input-file').trigger('change', {force:true});
        cy.get('#css-input-name').type('new');
        cy.get('#css-editor').find('textarea').focus().type('style', {force: true});
        cy.get('#css-button-add-style').click()
        cy.get('.css-item').eq(1).click()
    })

    it('Style', function() {
        // add style
        cy.get('.bottomTab').eq(4).click()
        cy.get('#style-input-name').focus().type('temp')
        cy.get('#style-editor').find('textarea').first().focus().type('.blue {{}background:blue;padding:10}{del}', {force:true})
        cy.get('#css-button-add-style').click()
        // add component
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type('new{enter}')
        cy.get('.scrollarea-content').eq(0).click()
        // add element
        cy.get('#element-wrap').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type('div{enter}')
        cy.get('.element-item').first().click()
        // add property
        cy.get('div[id="Property"]').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="property-name-input"]').type('styleName')
        cy.get('input[id="property-value-input"]').type('blue')
        cy.get('button[id="property-submit"]').click()
    })
})