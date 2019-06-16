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

    function createElement(name) {
        cy.get('#element-wrap').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type(name+'{enter}')
        cy.get('.element-item').last().click()
    }

    function createProperty(name) {
        cy.get('div[id="Property"]').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="property-name-input"]').type(name)
        cy.get('input[id="property-value-input"]').type('value')
        cy.get('button[id="property-submit"]').click()
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

    it('render', function() {
        createComponent('new')
        createElement('div')
        createProperty('text')
        createElement('render')
        cy.get('.property-item').first().click()
        cy.get('#property-value-input').type('name')
        cy.get('#property-type-select').select('variable')
        cy.get('#property-value-input').type('this.state.value')
    })

    it('render for loop', function() {
        createComponent('new')
        cy.get('.bottomTab').eq(0).click()
        cy.get('#bottom-view').find('textarea').first().type('{{}"arr":[{{}"arr2":["1-1", "1-2"]}, {{}"arr2":["2-1", "2-2"]}]}', {force:true})
        createElement('div')
        createProperty('for')
        cy.get('.property-item').last().click()
        cy.get('#property-type-select').select('variable')
        cy.get('#property-value-input').type('this.state.arr')
        cy.get('.element-item').last().trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type('div{enter}')
        cy.get('.element-item').last().click()
        createProperty('for')
        cy.get('.property-item').last().click()
        cy.get('#property-type-select').select('variable')
        cy.get('#property-value-input').type('item0.arr2')
        createProperty('text')
        cy.get('.property-item').last().click()
        cy.get('#property-type-select').select('variable')
        cy.get('#property-value-input').type('item1')
    })

    it('render color', function() {
        createComponent('new')
        cy.get('.bottomTab').eq(1).click()
        cy.get('.sketch-picker').find('input').eq(0).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}ff0000')
        cy.get('#color-input').focus().type('new')
        cy.get('#color-create').click()
        createElement('div')
        createProperty('style')
        cy.get('.property-item').last().click()
        cy.get('#property-type-select').select('object')
        cy.get('#property-value-object').find('textarea').last().focus().type('{{}background:Color.new; padding:10}{del}', {force:true})
        cy.get('.property-item').last().click()
    })

    it('render asset', function() {
        createComponent('new')
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
        createElement('img')
        cy.get('div[id="Property"]').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="property-name-input"]').type('src')
        cy.get('input[id="property-value-input"]').type('Asset.new')
        cy.get('button[id="property-submit"]').click()
    })

    it('render css', function() {
        createComponent('new')
        cy.get('.bottomTab').eq(3).click()
        cy.get('#css-editor').find('textarea').first().focus().type('body {{}background:blue}', {force:true});
        cy.get('#css-input-name').type('fitst_css')
        cy.get('#css-button-add-style').click()
    })
})