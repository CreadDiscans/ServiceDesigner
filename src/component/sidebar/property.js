import React from 'react';
import { Input, Label } from 'reactstrap'
import {FaAngleRight, FaAngleDown} from 'react-icons/fa'

export default class SidebarProperty extends React.Component {

    state = {
        tree: {
            name: 'layout',
            style: {},
            properties: {},
            import: '',
            code: '<div>{children}</div>',
            collapse: true,
            children: []
        },
        selected: null,
        style: '{}',
        properties: {}
    }

    selectView = (item) => {
        this.setState({
            selected: item,
            style: JSON.stringify(item.style),
            properties: item.properties
        })
    }

    treeView(item, key=0) {
        return <div key={key}>
            {
                item.children.length > 0 && (
                    item.collapse ? <FaAngleDown onClick={()=> {
                        item.collapse = false
                        this.setState({tree: this.state.tree})
                    }}/> : <FaAngleRight onClick={()=>{
                        item.collapse = true
                        this.setState({tree: this.state.tree})
                    }}/>
                )
            }
            <span 
                style={{
                    color:this.state.selected === item ? 'red' : 'black',
                    cursor:'pointer'
                }}
                onClick={()=> {this.selectView(item)}}>{item.name}</span>
        </div>
    }

    render() {
        return <div>
            <h5>Layout</h5>
            {this.treeView(this.state.tree)}
            <h5>Style</h5>
            <Input type="textarea" value={this.state.style} onChange={(e)=>this.setState({style:e.target.value})}/>
            <h5>Properties</h5>
            {
                Object.keys(this.state.properties).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={this.state.properties[key]} onChange={(e)=>{
                            const prop = this.state.properties
                            prop[key] = e.target.value
                            this.setState({properties: prop})
                        }}/>
                    </div>
                })
            }
        </div>
    }
}

const styles = {
    propLabel: {
        display:'inline-block',
        width:'30%'
    },
    propValue: {
        display: 'inline-block',
        width:'70%'
    }
}