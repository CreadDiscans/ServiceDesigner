describe('Components', function() {
    beforeEach(function(){
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('div[id="explorer"]').click()
    })

    it('Create File by enter', function(){
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type('newFile{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFile')
    })

    it('Create File by blur', function(){
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type('newFile')
        cy.get('iframe').click()
        cy.get('div[id="components-body"]').should('have.text', 'newFile')
    })

    it('Create Folder by enter', function(){
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-folder"]>svg').click()
        cy.get('input[id="file-create-input"]').type('newFolder{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFolder')
    })

    it('Create Folder by blur', function(){
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-folder"]>svg').click()
        cy.get('input[id="file-create-input"]').type('newFolder')
        cy.get('iframe').click()
        cy.get('div[id="components-body"]').should('have.text', 'newFolder')
    })

    // it('Create Folder in Folder', function() {

    // })

    // it('Create File in Folder', function() {

    // })

    // it('Collapse all', function() {

    // })

    // it('Delete File', function() {

    // })

    // it('Delete Folder', function() {

    // })


})