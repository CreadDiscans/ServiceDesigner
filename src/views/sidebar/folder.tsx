import React, { CSSProperties } from 'react';
import {Button} from 'reactstrap'
import {FaPlus, FaJs, FaTrashAlt, FaRegFolder, FaAngleRight, FaAngleDown} from 'react-icons/fa'
import Utils from '../../utils/utils';
import { FolderManager } from '../../manager/folder.manager';
import { IProps } from './../../utils/interface';
import { MainController } from './../../controllers/main.controller';
import { FileType, File } from '../../models/file';
import { Action } from '../../utils/constant';

export default class SidebarFolder extends React.Component<IProps> {

    state = {
        inserting: false,
        insertType: FileType.FOLDER,
        insertValue: '',
        selectId: 0
    }

    mainCtrl:MainController;
    
    constructor(props:IProps) {
        super(props);
        this.mainCtrl = MainController.getInstance(MainController);
    }

    async addFile(type:FileType) {
        const parent:File = await this.getSelectItem();
        if (parent.type !== FileType.FILE) {
            this.setState({
                inserting: true,
                insertType: type,
                insertValue: ''
            })
        }
    }

    async removeFile() {
        if (this.state.selectId !== 0) {
            const parent:File = await this.getSelectItem(true);
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

    async getSelectItem(parent = false):Promise<File> {
        return new Promise(resolve=> {
            if (!this.props.root) {
                throw 'root is null';
            }
            Utils.loop(this.props.root, (item:File)=> {
                if (parent) {
                    item.children.forEach((child:File)=> {
                        if (child.id === this.state.selectId) {
                            resolve(item);
                        }
                    }) 
                } else {
                    if (item.id === this.state.selectId) {
                        resolve(item);
                    }
                }
            }); 
        });
    }

    treeView = (item:File) => {
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
                onClick={()=>{
                    this.setState({inserting:false, selectId: item.id});
                }}
            >{item.name}{item.type === FolderManager.TYPE_ROOT && '/'}</span>
            {
                item.collapse && item.children.map((subItem:File)=> this.treeView(subItem))
            }
            {
                this.state.selectId === item.id && this.state.inserting && <input 
                    onKeyPress={this.handleKeyPress}
                    onChange={(e)=> this.setState({insertValue:e.target.value})}
                />
            }
        </div>
    }

    handleKeyPress = async(e:any) => {
        if (e.key === 'Enter') {
            this.setState({inserting: false});
            const parent = await this.getSelectItem();
            const maxId = Utils.maxId(this.props.root);
            const name = this.state.insertType === FileType.FILE ? this.state.insertValue + '.js' : this.state.insertValue;
            const newOne = new File(maxId+1, name, this.state.insertType);
            parent.children.push(newOne);
            this.mainCtrl.fileControl(Action.Create, parent);
        }
    }


    render() {
        return <div>
            <h5>Folder</h5>
            <Button color="info" onClick={()=>this.addFile(FileType.FOLDER)}><FaPlus /> <FaRegFolder /></Button>{' '}
            <Button color="info" onClick={()=>this.addFile(FileType.FILE)}><FaPlus /> <FaJs /></Button> {' '}
            <Button color="danger" onClick={()=>this.removeFile()}><FaTrashAlt /></Button>
            {this.props.root && this.treeView(this.props.root)}
        </div>
    }
}

const styles:{[s: string]: CSSProperties;} = {
    tree: {
        cursor:'pointer'
    }
}