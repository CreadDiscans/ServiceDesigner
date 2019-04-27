import React from 'react';
import {Button} from 'reactstrap'
import {FaPlus, FaJs, FaTrashAlt, FaRegFolder, FaAngleRight, FaAngleDown} from 'react-icons/fa'
import Utils from '../../utils/utils';
import { FolderManager } from '../../manager/folder.manager';

export default class SidebarFolder extends React.Component<any, any> {

    state = {
        inserting: false,
        insertType: 'js', // js, folder
        insertValue: ''
    }

    folderManager:FolderManager
    
    constructor(props:any) {
        super(props);
        this.folderManager = FolderManager.getInstance(FolderManager);
    }

    addFile = (type:any) => {
        let parent:any;
        Utils.loop(this.props.folder, (item:any)=> {
            if (this.props.selectedFolder === item.id) {
                parent = item;
            }
        });
        if (parent.type === 'js') return;
        this.setState({
            inserting: true,
            insertType: type,
            insertValue: ''
        })
    }

    removeFile = () => {
        this.folderManager.delete();
    }

    treeView = (item:any) => {
        return <div key={item.id} style={{...styles.tree,...{
            marginLeft: item.type === FolderManager.TYPE_ROOT ? 0: 10
        }}}>
            {item.type === FolderManager.TYPE_JS && <span style={{marginLeft:5}}></span>}
            {item.type === FolderManager.TYPE_FOLDER && (item.collapse ?  <FaAngleDown onClick={()=>{
                this.folderManager.update(item.id, false);
            }}/>: <FaAngleRight onClick={()=> {
                this.folderManager.update(item.id, true);
            }}/>)} 
            <span style={{
                    color: this.props.selectedFolder === item.id ? 'red' : 'black'
                }}
                onClick={()=>{
                    this.setState({inserting:false});
                    this.folderManager.select(item.id);
                }}
            >{item.name}{item.type === FolderManager.TYPE_ROOT && '/'}</span>
            {
                item.collapse && item.children.map((subItem:any)=> this.treeView(subItem))
            }
            {
                this.props.selectedFolder === item.id && this.state.inserting && <input 
                    onKeyPress={this.handleKeyPress}
                    onChange={(e)=> this.setState({insertValue:e.target.value})}
                />
            }
        </div>
    }

    handleKeyPress = (e:any) => {
        if (e.key === 'Enter') {
            this.setState({inserting: false});
            this.folderManager.create(this.state.insertValue ,this.state.insertType);
        }
    }


    render() {
        return <div>
            <h5>Folder</h5>
            <Button color="info" onClick={()=>this.addFile('folder')}><FaPlus /> <FaRegFolder /></Button>{' '}
            <Button color="info" onClick={()=>this.addFile('js')}><FaPlus /> <FaJs /></Button> {' '}
            <Button color="danger" onClick={()=>this.removeFile()}><FaTrashAlt /></Button>
            {this.treeView(this.props.folder)}
        </div>
    }
}

const styles = {
    tree: {
        cursor:'pointer'
    }
}