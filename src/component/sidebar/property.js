import React from 'react';
import { Input, Label } from 'reactstrap'
import {FaAngleRight, FaAngleDown} from 'react-icons/fa'
import PubsubService from '../../service/pubsub.service'
import DataService from './../../service/data.service'
import ReactJSONEditor from '../reactJsonEditor'

export default class SidebarProperty extends React.Component {

    state = {
        tree: {
            component: 'layout',
            style: {},
            property: {},
            import: 'import {Container} from \'reactstrap\'',
            code: '<Container>{children}</Container>',
            collapse: true,
            children: []
        },
        selected: null,
        style: {},
        property: {}
    }

    componentWillMount() {
        PubsubService.sub(PubsubService.KEY_OPEN_PAGE).subscribe(page=> {
            if (page) {
                const data = DataService.getLayout(page)
                this.setState({tree: data})
            }
        })
    }

    selectView = (item) => {
        this.setState({
            selected: item,
            style: item.style,
            property: item.property
        })
    }

    treeView(item, index=0, depth=0) {
        return <div key={depth+'/'+index} style={{
                paddingLeft: depth === 0? 0: item.children.length === 0? 15: 10}}>
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
                onClick={()=> {this.selectView(item)}}>{item.component}</span>
            {
                item.collapse && item.children.map((child, i)=> this.treeView(child, i, depth+1))
            }
        </div>
    }

    render() {
        return <div>
            <h5>Layout</h5>
            {this.treeView(this.state.tree)}
            <h5>Style</h5>
            <ReactJSONEditor values={this.state.style} onChange={(values)=>{
                if (this.state.selected) {
                    const selected = this.state.selected
                    selected.style = values
                    PubsubService.pub(PubsubService.KEY_LAYOUT_UPDATED, true)
                    this.setState({style:values})
                }
            }}/>
            <h5>Property</h5>
            {
                Object.keys(this.state.property).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={this.state.property[key]} onChange={(e)=>{
                            const prop = this.state.property
                            prop[key] = e.target.value
                            this.setState({property: prop})
                            PubsubService.pub(PubsubService.KEY_LAYOUT_UPDATED, true)
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