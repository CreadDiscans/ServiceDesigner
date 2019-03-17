import React from 'react';
import {Button} from 'reactstrap'
import {FaPlus, FaJs, FaTrashAlt, FaRegFolder} from 'react-icons/fa'

export default class SidebarFolder extends React.Component {

    state = {
        tree: {
            id: 0,
            name: '',
            type: 'root',
            children: []
        },
        selected: -1,
        inserting: false,
        insertValue: ''
    }

    getMaxId = (id=0, item=this.state.tree) => {
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

    findItem = (id, item=this.state.tree) => {
        if (id === 0) {
            return [item, null, 0]
        } else if (id === item.id) {
            return item
        } else if (item.type === 'js') {
            return false
        } else {
            let value = false
            let index = 0
            let isParent = false
            item.children.forEach((child, i)=> {
                const tmp = this.findItem(id, child)
                if (tmp) {
                    if (!Array.isArray(tmp)) {
                        isParent = true
                        index = i
                    }
                    value = tmp
                }
            })
            if (isParent) {
                return [value, item, index]
            } else {
                return value
            }
        }
    }

    addFile = (type) => {
        let selectedFolder = this.findItem(this.state.selected)[0]
        if (!selectedFolder || this.state.inserting) return
        if (selectedFolder.type === 'root' || selectedFolder.type === 'folder') {
            const maxId = this.getMaxId()
            selectedFolder.children.push({
                id: maxId + 1,
                name: '',
                type: type + ' insert',
                children: []
            })
            this.setState({
                selected: maxId + 1,
                tree: this.state.tree,
                inserting: true,
                insertValue: ''
            })
        }
    }

    removeFile = () => {
        if (this.state.selected === 0 || this.state.selected === -1) return
        const tmp = this.findItem(this.state.selected)
        const parent = tmp[1]
        const index = tmp[2]
        parent.children.splice(index, 1)
        this.setState({
            tree: this.state.tree,
            selected: -1,
            inserting: false
        })
    }

    treeView = (item) => {
        return <div key={item.id} style={styles.tree}>
            <div style={{
                    color: this.state.selected === item.id ? 'red' : 'black'
                }}
                onClick={()=>{
                    if (!this.state.inserting) {
                        if (this.state.selected === item.id) {
                            this.setState({selected: -1})
                        } else {
                            this.setState({selected: item.id})
                        }
                    }
                }}
            >{item.type.indexOf('insert') !== -1 ? <input 
                onKeyPress={this.handleKeyPress}
                onChange={(e)=> this.setState({insertValue:e.target.value})}
                /> : '/'+item.name}</div>
            {item.children.map(subItem=> this.treeView(subItem))}
        </div>
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const item = this.findItem(this.state.selected)[0]
            item.name = this.state.insertValue
            if (item.type.indexOf('js') !== -1) {
                item.name += '.js'
            }
            item.type = item.type.replace(' insert', '')
            this.setState({
                tree: this.state.tree,
                inserting: false
            })
        }
    }

    render() {
        console.log(this.state.tree)
        return <div>
            <h5>Folder</h5>
            <Button color="info" onClick={()=>this.addFile('folder')}><FaPlus /> <FaRegFolder /></Button>{' '}
            <Button color="info" onClick={()=>this.addFile('js')}><FaPlus /> <FaJs /></Button> {' '}
            <Button color="danger" onClick={()=>this.removeFile()}><FaTrashAlt /></Button>
            {this.treeView(this.state.tree)}
        </div>
    }
}

const styles = {
    tree: {
        marginLeft:10,
        cursor:'pointer'
    }
}