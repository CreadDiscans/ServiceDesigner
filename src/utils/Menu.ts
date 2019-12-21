
declare var window:any;

export class Menu {

    cachePath = undefined;

    init(openFile, saveFile) {
        try {
            
            const electron = window.require('electron');
            const remote = electron.remote;
            const Menu = electron.Menu || remote.Menu;
            const MenuItem = electron.MenuItem || remote.MenuItem;
            const fs = window.require('fs')
            const path = window.require('path')
            const save = async() => {
                if (this.cachePath === undefined) {
                    return;
                }
                const data = await saveFile()
                if (data === undefined) {
                    return;
                }
                fs.writeFileSync(this.cachePath+'/design.save.json', data.json);
                fs.writeFileSync(this.cachePath+'/design.component.tsx', data.js);
                if (data.css !== undefined) {
                    fs.writeFileSync(this.cachePath+'/design.style.css', data.css)
                }
                fs.writeFileSync(this.cachePath+'/design.resource.json', data.rsc)
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
                                    const data = fs.readFileSync(file[0]);
                                    openFile(data.toString())
                                    this.cachePath = path.dirname(file[0])
                                }
                            },
                            accelerator: remote.process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O'                            
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
                            accelerator: remote.process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S'
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
                            accelerator: remote.process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S'
                        },
                        {
                            label: 'reload',
                            click: ()=> window.location.reload()
                        },
                        {
                            label: 'Exit',
                            click: ()=> {
                                remote.getCurrentWindow().close()
                            }
                        }
                    ]
                },
                {
                    label: 'Info',
                    submenu: [
                        {
                            label: 'Version',
                            click: ()=> {
                                alert('Version '+ remote.app.getVersion())
                            }
                        }
                    ]
                }
            ];
            if (remote.process.platform === 'darwin') {
                template.push({ 
                    label: 'Edit', 
                    submenu: [
                        new MenuItem({ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" }),
                        new MenuItem({ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" }),
                        new MenuItem({ type: "separator" }),
                        new MenuItem({ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" }),
                        new MenuItem({ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" }),
                        new MenuItem({ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }),
                        new MenuItem({ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" })
                    ] 
                  })
              }
            const menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);
        } catch(e) {}
    }
}
