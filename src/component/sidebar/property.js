import React from 'react';
import { Input, Label } from 'reactstrap'
import ReactJSONEditor from '../reactJsonEditor'
import Layout from './layout'
import Utils from '../../service/utils';
import { LayoutManager } from './../../manager/layout.manager';

export default class SidebarProperty extends React.Component {

    layoutManager
    
    componentWillMount() {
        this.layoutManager = LayoutManager.getInstance(LayoutManager);
    }
    
    render() {
        let selctedItem;
        Utils.loop(this.props.layout, item=> {
            if (this.props.selected === item.id) {
                selctedItem = item;
            }
        });

        return <div>
            <Layout layout={this.props.layout} selected={this.props.selected} tab={'property'}/>
            <h5>Style</h5>
            <ReactJSONEditor values={selctedItem.style} onChange={(values)=>{
                this.layoutManager.update({id:selctedItem.id, style:values});
            }}/>
            <h5>Property</h5>
            {
                Object.keys(selctedItem.property).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={selctedItem.property[key]} onChange={(e)=>{
                            selctedItem.property[key] = e.target.value
                            this.layoutManager.update({id:selctedItem.id, property:selctedItem.property});
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