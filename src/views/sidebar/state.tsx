import React from 'react';
import ReactJSONEditor from '../reactJsonEditor';
import { View } from '../view';

export class SidebarState extends View {

    render() {
        const file = this.mainCtrl.getSelectedFile();
        return <div>
            <h5>State</h5>
            <div>- {file.name}</div>
            <ReactJSONEditor style={{height:400}} values={file.state} onChange={(values:any)=>{
                file.setState(values);
                this.mainCtrl.home$.next(true);
            }}/>
        </div>
    }
}