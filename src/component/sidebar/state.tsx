import React from 'react';
import { DataManager } from '../../manager/data.manager';
import ReactJSONEditor from '../reactJsonEditor';
import { LayoutManager } from '../../manager/layout.manager';

export class SidebarState extends React.Component<any, any>{

    layoutManager: LayoutManager;
    dataManager:DataManager;
    constructor(props:any) {
        super(props);
        this.layoutManager = LayoutManager.getInstance(LayoutManager);
        this.dataManager = DataManager.getInstance(DataManager);
    }

    render() {
        return <div>
            <h5>State</h5>
            <div>- {this.dataManager.page}</div>
            <ReactJSONEditor style={{height:400}} values={this.props.layout.state} onChange={(values:any)=>{
                this.layoutManager.setState(values);
            }}/>
        </div>
    }
}