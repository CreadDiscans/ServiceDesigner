import React from 'react';
import { Input, Label } from 'reactstrap'
import ReactJSONEditor from '../reactJsonEditor'
import Layout from './layout'
import { ActionService } from './../../service/action.service';
import Utils from '../../service/utils';
import DataService from '../../service/data.service';

export default class SidebarProperty extends React.Component {
    
    render() {
        return <div>
            <Layout layout={this.props.layout} selected={this.props.selected} tab={'property'}/>
            <h5>Style</h5>
            <ReactJSONEditor values={this.props.selected ? this.props.selected.style : {}} onChange={(values)=>{
                if (this.props.selected) {
                    ActionService.do({
                        type: ActionService.ACTION_CHANGE_STYLE,
                        tab: 'property',
                        target: Utils.deepcopy(this.props.selected),
                        before: Utils.deepcopy(this.props.selected.style),
                        after: Utils.deepcopy(values),
                        page: DataService.page
                    });
                }
            }}/>
            <h5>Property</h5>
            {
                this.props.selected && Object.keys(this.props.selected.property).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={this.props.selected.property[key]} onChange={(e)=>{
                            const after = Utils.deepcopy(this.props.selected.property);
                            after[key] = e.target.value;
                            ActionService.do({
                                type: ActionService.ACTION_CHANGE_PROPERTY,
                                tab: 'property',
                                target: Utils.deepcopy(this.props.selected),
                                before: Utils.deepcopy(this.props.selected.property),
                                after: after,
                                page: DataService.page
                            })
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