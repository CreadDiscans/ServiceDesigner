import React, { CSSProperties } from 'react';
import {Button} from 'reactstrap'
import {FaPlus, FaJs, FaTrashAlt, FaRegFolder, FaAngleRight, FaAngleDown} from 'react-icons/fa'
import Utils from '../../utils/utils';
import { FolderManager } from '../../manager/folder.manager';
import { FileType, File } from '../../models/file';
import { Action, Platform } from '../../utils/constant';
import { Element } from '../../models/element';
import { View } from '../view';

export class SidebarFolder extends View {

    state = {
        inserting: false,
        insertType: FileType.FOLDER,
        insertValue: '',
        selectId: 0,
    }

    async addFile(root:File, type:FileType) {
        const parent:File = await this.getSelectItem(root);
        if (parent.type !== FileType.FILE) {
            this.setState({
                inserting: true,
                insertType: type,
                insertValue: ''
            })
        }
    }

    async removeFile(root:File) {
        if (this.mainCtrl.getSelectedFile().id !== 0) {
            const parent:File = await this.getSelectItem(root);
            const index:number = Utils.search(parent.children, (item:File)=> item.id === this.state.selectId)[1];
            parent.children.splice(index, 1);
            this.mainCtrl.fileControl(Action.Delete, parent);
            this.setState({selectId:0});
        }
    }

    async collapse(item:File, value:boolean) {
        item.collapse = value;
        this.mainCtrl.fileControl(Action.Update, item);
    }

    async getSelectItem(root:File, parent = false, id=-1):Promise<File> {
        return new Promise(resolve=> {
            Utils.loop(root, (item:File)=> {
                if (parent) {
                    item.children.forEach((child:File)=> {
                        if (child.id === this.state.selectId) {
                            resolve(item);
                        }
                    }) 
                } else {
                    if (id === -1 && item.id === this.state.selectId) {
                        resolve(item);
                    } else if (item.id === id){
                        resolve(item);
                    }
                }
            }); 
        });
    }

    treeView = (item:File, root:File) => {
        return <div key={item.id} style={{...styles.tree,...{
            marginLeft: item.type === FileType.ROOT ? 0: 10
        }}}>
            {item.type === FileType.FILE && <span style={{marginLeft:5}}></span>}
            {item.type === FileType.FOLDER && (item.collapse ?  <FaAngleDown onClick={()=>{
                this.collapse(item, false);
            }}/>: <FaAngleRight onClick={()=> {
                this.collapse(item, true);
            }}/>)} 
            <span style={{
                    color: this.state.selectId === item.id ? 'red' : 'black'
                }}
                onClick={async()=>{
                    this.mainCtrl.selectFile(await this.getSelectItem(root, false, item.id));
                    this.setState({inserting:false, selectId: item.id});
                }}
            >{item.name}{item.type === FolderManager.TYPE_ROOT && '/'}</span>
            {
                item.collapse && item.children.map((subItem:File)=> this.treeView(subItem, root))
            }
            {
                this.state.selectId === item.id && this.state.inserting && <input 
                    onKeyPress={(e)=> this.handleKeyPress(e, root)}
                    onChange={(e)=> this.setState({insertValue:e.target.value})}
                />
            }
        </div>
    }

    handleKeyPress = async(e:any, root:File) => {
        if (e.key === 'Enter') {
            this.setState({inserting: false});
            const parent = await this.getSelectItem(root);
            const maxId = Utils.maxId(root);
            const name = this.state.insertType === FileType.FILE ? this.state.insertValue + '.js' : this.state.insertValue;
            const newOne = new File(maxId+1, name, this.state.insertType);
            if (this.mainCtrl.getPlatform() === Platform.React) {
                newOne.element = Element.getReactRootElement();
            } else if (this.mainCtrl.getPlatform() === Platform.ReactNative) {
                newOne.element = Element.getReactNativeRootElement();
            }
            parent.children.push(newOne);
            this.mainCtrl.fileControl(Action.Create, parent);
        }
    }


    render() {
        const root = this.mainCtrl.getFolderData();
        return <div>
            <h5>Folder</h5>
            <Button color="info" onClick={()=>this.addFile(root, FileType.FOLDER)}><FaPlus /> <FaRegFolder /></Button>{' '}
            <Button color="info" onClick={()=>this.addFile(root, FileType.FILE)}><FaPlus /> <FaJs /></Button> {' '}
            <Button color="danger" onClick={()=>this.removeFile(root)}><FaTrashAlt /></Button>
            {this.treeView(root, root)}
        </div>
    }
}

const styles:{[s: string]: CSSProperties;} = {
    tree: {
        cursor:'pointer'
    }
}