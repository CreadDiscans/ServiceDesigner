describe('Components', function() {
    beforeEach(function(){
        cy.visit('/')
    })

    function createFolder(name) {
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-folder"]>svg').click()
        cy.get('input[id="file-create-input"]').type(name+'{enter}')
    }

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

    it('Create Folder in Folder', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).click()
        createFolder('childFolder')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderchildFolder')
    })

    it('Create File in Folder', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).click()
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type('childFile{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderchildFile')
    })

    it('Collapse all', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).click()
        createFolder('childFolder')
        cy.get('span[id="icon-collapse"]>svg').click()
        cy.get('div[id="components-body"]').should('have.text', 'newFolder')
    })

    it('Unselect', function(){
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).click()
        cy.get('span[id="icon-unselect"]>svg').click()
        createFolder('nexfFolder')
        cy.get('.scrollarea-content').eq(0).find('div').eq(3).should('have.css', 'padding-left', '10px')
    })

    it('Create File in context menu', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="file-create-input"]').type('childFile{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderchildFile')
        cy.get('.scrollarea-content').eq(0).find('div').eq(3).should('have.css', 'padding-left', '15px')
    })

    it('Rename', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(3).click()
        cy.get('input[id="file-create-input"]').type('rename{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderrename')
    })

    it('Delete File', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(4).click()
        cy.get('div[id="components-body"]').should('have.text', '')
    })

    it('Create File from context menu in blank area', function() {
        createFolder('newFolder')
        cy.get('.scrollarea-content').eq(0).click()
        cy.get('div[id="components-body"]').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="file-create-input"]').type('nextFile{enter}')
        cy.get('.scrollarea-content').eq(0).find('div').eq(3).should('have.css', 'padding-left', '10px')
    })
})