
declare var window:any;

// const { remote } = window.require('electron')
// const fs = window.require('fs')
// if (!this.cachePath || !useCache) {
//     this.cachePath = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })[0];
// }

// fs.writeFile(this.cachePath+'/designData.json', JSON.stringify(json), (err:any)=> {
//     if (err) {
//         return console.log(err)
//     }
//     console.log('saved json')
//     document.getElementsByTagName('title')[0].innerText = 'Service Designer';
// });
// fs.writeFile(this.cachePath+'/design.tsx', js, (err:any)=> {
//     if (err) {
//         return console.log(err)
//     }
//     console.log('saved tsx')
// });
// document.getElementsByTagName('title')[0].innerText = 'Service Designer';

export class Menu {

    cachePath = undefined;

    init(openFile, saveFile) {
        try {
            const { remote } = window.require('electron');
            const {Menu} = remote;
            const fs = window.require('fs')
            // define template
            const template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'Open file',
                            click: ()=> {
                                const file = remote.dialog.showOpenDialog({ properties: ['openFile'] })
                                fs.readFile(file[0], (err:any, data:any)=> {
                                    if (err) throw err
                                    openFile(data)
                                });
                            },
                            accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O'
                        },
                        {
                            label: 'Save file',
                            click: ()=> {
                                const data = saveFile()
                                
                                if (this.cachePath === undefined) {
                                    this.cachePath = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })[0];
                                }
                                
                                fs.writeFile(this.cachePath+'/design.save.json', JSON.stringify(data.json), (err:any)=> {
                                    if (err) {
                                        return console.log(err)
                                    }
                                    console.log('saved json')
                                });
                                fs.writeFile(this.cachePath+'/design.tsx', data.js, (err:any)=> {
                                    if (err) {
                                        return console.log(err)
                                    }
                                    console.log('saved tsx')
                                });
                                if (data.css) {
                                    fs.writeFile(this.cachePath+'/design.style.css', data.css, (err:any)=> {
                                        if (err) {
                                            return console.log(err)
                                        }
                                        console.log('saved css')
                                    })
                                }
                            },
                            accelerator: process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S'
                        },
                        {
                            label: 'Save to another foleder',
                            click: ()=> {
                                const data = saveFile()
                                this.cachePath = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })[0];
                                
                                fs.writeFile(this.cachePath+'/design.save.json', JSON.stringify(data.json), (err:any)=> {
                                    if (err) {
                                        return console.log(err)
                                    }
                                    console.log('saved json')
                                });
                                fs.writeFile(this.cachePath+'/design.tsx', data.js, (err:any)=> {
                                    if (err) {
                                        return console.log(err)
                                    }
                                    console.log('saved tsx')
                                });
                                if (data.css) {
                                    fs.writeFile(this.cachePath+'/design.style.css', data.css, (err:any)=> {
                                        if (err) {
                                            return console.log(err)
                                        }
                                        console.log('saved css')
                                    })
                                }
                            },
                            accelerator: process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S'
                        }
                    ]
                }
            ];
            
            const menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);
        } catch(e) {}
    }
}

