describe('Components', function() {
    beforeEach(function(){
        cy.visit('/')
        cy.get('button[name="react"]').click()
        cy.get('div[id="explorer"]').click()
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
        cy.get('div[id="components-body"]>div>div').click()
        createFolder('childFolder')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderchildFolder')
    })

    it('Create File in Folder', function() {
        createFolder('newFolder')
        cy.get('div[id="components-body"]>div>div').click()
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type('childFile{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderchildFile')
    })

    it('Collapse all', function() {
        createFolder('newFolder')
        cy.get('div[id="components-body"]>div>div').click()
        createFolder('childFolder')
        cy.get('span[id="icon-collapse"]>svg').click()
        cy.get('div[id="components-body"]').should('have.text', 'newFolder')
    })

    it('Unselect', function(){
        createFolder('newFolder')
        cy.get('div[id="components-body"]>div>div').click()
        cy.get('span[id="icon-unselect"]>svg').click()
        createFolder('nexfFolder')
        cy.get('div[id="components-body"]>div>div').eq(1).should('have.css', 'padding-left', '10px')
    })

    it('Create File in context menu', function() {
        createFolder('newFolder')
        cy.get('div[id="components-body"]>div>div').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="file-create-input"]').type('childFile{enter}')
        cy.get('div[id="components-body"]').should('have.text', 'newFolderchildFile')
    })

    // it('Delete File', function() {
    //     createFolder('newFolder')
    //     cy.get('div[id="components-body"]>div>div').trigger('contextmenu')
    // })

    // it('Delete Folder', function() {

    // })


})