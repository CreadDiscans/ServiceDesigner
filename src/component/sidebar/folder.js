import React from 'react';
import {Button} from 'reactstrap'
import {FaPlus, FaJs, FaTrashAlt, FaRegFolder, FaAngleRight, FaAngleDown} from 'react-icons/fa'
import PubsubService from '../../service/pubsub.service';
import DataService from './../../service/data.service';
import Utils from './../../service/utils';
import { ActionService } from './../../service/action.service';

export default class SidebarFolder extends React.Component {

    state = {
        inserting: false,
        insertType: 'js', // js, folder
        insertValue: ''
    }

    // _isMounted = false

    // componentWillMount() {
    //     this._isMounted = true
    //     PubsubService.sub(PubsubService.KEY_LOAD_JSON).subscribe(value=> {
    //         if(value && this._isMounted) {
    //             this.setState({
    //                 tree: DataService.getFolder(),
    //                 selected: -1,
    //                 inserting: false,
    //                 insertValue: ''
    //             })
    //         }
    //     })
    // }

    // componentWillUnmount() {
    //     this._isMounted = false
    // }

    getMaxId = (id=0, item=this.props.folder) => {
        if (id < item.id) {
            id = item.id
        }
        if (item.type === 'root' || item.type === 'folder') {
            item.children.forEach(sub=> {
                id = this.getMaxId(id, sub)
            })
        }
        return id
    }

    findItem = (id, item=this.props.folder) => {
        if (id === 0) {
            return [item, null, 0, '']
        } else if (id === item.id) {
            return item
        } else if (item.type === 'js') {
            return false
        } else {
            let value = false
            let index = 0
            let isParent = false
            let path = item.name
            item.children.forEach((child, i)=> {
                const tmp = this.findItem(id, child)
                if (tmp) {
                    if (!Array.isArray(tmp)) {
                        isParent = true
                        index = i
                        path += '/' + tmp.name
                    } else {
                        path += '/' + tmp[3]
                    }
                    value = tmp
                }
            })
            if (isParent) {
                return [value, item, index, path]
            } else {
                return value
            }
        }
    }

    addFile = (type) => {
        let parent;
        Utils.loop(this.props.folder, (item)=> {
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

        // let selectedFolder = this.findItem(this.props.selectedFolder)[0]
        // if (!selectedFolder || this.state.inserting) return
        // if (selectedFolder.type === 'root' || selectedFolder.type === 'folder') {
        //     this.setState({
        //         inserting: true,
        //         insertType: type
        //     })
        //     const maxId = this.getMaxId()

        //     selectedFolder.children.push({
        //         id: maxId + 1,
        //         name: '',
        //         type: type + ' insert',
        //         collapse: true,
        //         children: []
        //     })
        //     // this.setState({
        //     //     selected: maxId + 1,
        //     //     tree: this.state.tree,
        //     //     inserting: true,
        //     //     insertValue: ''
        //     // })
        // }
    }

    removeFile = () => {
        if (this.props.selectedFolder === 0 || this.props.selectedFolder === -1) return
        const tmp = this.findItem(this.props.selectedFolder)
        const parent = tmp[1]
        const index = tmp[2]
        parent.children.splice(index, 1)
        // this.setState({
        //     tree: this.state.tree,
        //     selected: -1,
        //     inserting: false
        // })
    }

    treeView = (item) => {
        return <div key={item.id} style={{...styles.tree,...{
            marginLeft: item.type === 'root' ? 0: 10
        }}}>
            {item.type === 'js' && <span style={{marginLeft:5}}></span>}
            {item.type === 'folder' && (item.collapse ?  <FaAngleDown onClick={()=>{
                PubsubService.pub(PubsubService.KEY_UPDATE_FOLDER, {
                    type:'collapse',
                    id: item.id,
                    value: false
                });
            }}/>: <FaAngleRight onClick={()=> {
                PubsubService.pub(PubsubService.KEY_UPDATE_FOLDER, {
                    type:'collapse',
                    id: item.id,
                    value: true
                });
            }}/>)} 
            <span style={{
                    color: this.props.selectedFolder === item.id ? 'red' : 'black'
                }}
                onClick={()=>{
                    this.setState({inserting:false});
                    if (this.props.selectedFolder !== item.id) {
                        PubsubService.pub(PubsubService.KEY_UPDATE_FOLDER, {
                            type:'selected',
                            id: item.id
                        });
                        if (item.type === 'js') {
                            this.openJs(item.id)
                        }
                    }
                }}
            >{item.name}{item.type === 'root' && '/'}</span>
            {
                item.collapse && item.children.map(subItem=> this.treeView(subItem))
            }
            {
                this.props.selectedFolder === item.id && this.state.inserting && <input 
                    onKeyPress={this.handleKeyPress}
                    onChange={(e)=> this.setState({insertValue:e.target.value})}
                />
            }
        </div>
    }

    openJs = (id) => {
        const item = this.findItem(id)
        PubsubService.pub(PubsubService.KEY_OPEN_PAGE, item[3])
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.isValid(this.state.insertType)) {
                ActionService.do({
                    type: ActionService.ACTION_CREATE_FILE,
                    parent: this.props.selectedFolder,
                    item: {
                        id:Utils.maxId(this.props.folder) + 1,
                        name: this.state.insertType === 'js' ? this.state.insertValue + '.js' : this.state.insertValue,
                        type:this.state.insertType,
                        collapse: true,
                        children: []
                    }
                });
                this.setState({inserting: false});
            }
            // const tmp = this.findItem(this.props.selectedFolder)
            // const item = tmp[0]
            // const parent = tmp[1]
            // const type = item.type.replace(' insert', '')
            // if (this.isValid(type)) {
            //     item.name = this.state.insertValue
            //     item.type = type
            //     if (item.type.indexOf('js') !== -1) {
            //         item.name += '.js'
            //         this.openJs(item.id)
            //     }
            //     parent.children.sort((a,b)=> {
            //         if (a.type === b.type) {
            //             return a.name > b.name ? 1 : -1
            //         } else if (a.type === 'folder') {
            //             return -1
            //         } else if (b.type === 'folder') {
            //             return 1
            //         } else {
            //             return 0
            //         }
            //     })
            //     // this.setState({
            //     //     tree: this.state.tree,
            //     //     inserting: false
            //     // })
            // }
        }
    }

    isValid(type) {
        // let targetKey
        // const keyList = []
        // const makeMap = (item, path) => {
        //     if (this.props.selectedFolder === item.id) {
        //         targetKey = path + '/' + this.state.insertValue
        //         if (type==='js') {
        //             targetKey += '.js'
        //         }
        //         return
        //     }
        //     path += '/'+item.name
        //     keyList.push(path)
        //     item.children.forEach(subItem=> makeMap(subItem, path))
        // }
        // makeMap(this.state.tree, '')

        // if (keyList.indexOf(targetKey) !== -1) {
        //     return false
        // } else {
            return true
        // }
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