import React from 'react';
import { DataManager } from './../../manager/data.manager';
import ReactJSONEditor from './../reactJsonEditor';
import { LayoutManager } from '../../manager/layout.manager';

export class SidebarState extends React.Component{

    render() {
        return <div>
            <h5>State</h5>
            <div>- {DataManager.getInstance(DataManager).page}</div>
            <ReactJSONEditor values={this.props.layout.state} onChange={(values)=>{
                LayoutManager.getInstance(LayoutManager).setState(values);
            }}/>
        </div>
    }
}