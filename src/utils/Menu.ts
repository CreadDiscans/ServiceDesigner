
declare var window:any;

export class Menu {

    cachePath = undefined;

    init(openFile, saveFile) {
        try {
            const { remote } = window.require('electron');
            const {Menu} = remote;
            const fs = window.require('fs')

            const save = async() => {
                const data = await saveFile()
                if (data === undefined) {
                    return;
                }
                fs.writeFile(this.cachePath+'/design.save.json', data.json, (err:any)=> {
                    if (err) {
                        return console.log(err)
                    }
                    console.log('saved json')
                });
                fs.writeFile(this.cachePath+'/design.component.tsx', data.js, (err:any)=> {
                    if (err) {
                        return console.log(err)
                    }
                    console.log('saved tsx')
                });
                if (data.css !== undefined) {
                    fs.writeFile(this.cachePath+'/design.style.css', data.css, (err:any)=> {
                        if (err) {
                            return console.log(err)
                        }
                        console.log('saved css')
                    })
                }
            }

            // define template
            const template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'Open file',
                            click: ()=> {
                                const file = remote.dialog.showOpenDialog({ properties: ['openFile'] })
                                if (file !== undefined) {
                                    fs.readFile(file[0], (err:any, data:any)=> {
                                        if (err) throw err
                                        openFile(data.toString())
                                    });
                                }
                            },
                            accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O'
                        },
                        {
                            label: 'Save file',
                            click: ()=> {
                                if (this.cachePath === undefined) {
                                    const paths = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
                                    if (paths !== undefined) {
                                        this.cachePath = paths[0];
                                    }
                                }
                                save();
                                
                            },
                            accelerator: process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S'
                        },
                        {
                            label: 'Save to another foleder',
                            click: async()=> {
                                const paths = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
                                if (paths !== undefined) {
                                    this.cachePath = paths[0];
                                }
                                save();
                            },
                            accelerator: process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S'
                        },
                        {
                            label: 'Exit',
                            click: ()=> {
                                remote.getCurrentWindow().close()
                            }
                        }
                    ]
                }
            ];
            
            const menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);
        } catch(e) {}
    }
}

