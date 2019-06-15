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
})