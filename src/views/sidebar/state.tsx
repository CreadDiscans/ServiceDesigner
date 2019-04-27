import React from 'react';
import ReactJSONEditor from '../reactJsonEditor';
import { MainController } from './../../controllers/main.controller';
import { IProps } from './../../utils/interface';

export class SidebarState extends React.Component{

    mainCtrl:MainController;
    constructor(props:IProps) {
        super(props);
        this.mainCtrl = MainController.getInstance(MainController);
    }

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