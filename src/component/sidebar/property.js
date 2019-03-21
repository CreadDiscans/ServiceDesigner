import React from 'react';
import { Input, Label } from 'reactstrap'
import PubsubService from '../../service/pubsub.service'
import ReactJSONEditor from '../reactJsonEditor'
import Layout from './layout'

export default class SidebarProperty extends React.Component {
    
    render() {
        return <div>
            <Layout layout={this.props.layout} selected={this.props.selected} />
            <h5>Style</h5>
            <ReactJSONEditor values={this.props.selected ? this.props.selected.style : {}} onChange={(values)=>{
                if (this.props.selected) {
                    const selected = this.props.selected
                    selected.style = values
                    PubsubService.pub(PubsubService.KEY_LAYOUT_UPDATED, true)
                }
            }}/>
            <h5>Property</h5>
            {
                this.props.selected && Object.keys(this.props.selected.property).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={this.props.selected.property[key]} onChange={(e)=>{
                            const prop = this.props.selected.property
                            prop[key] = e.target.value
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