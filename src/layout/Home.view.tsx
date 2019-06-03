import React from 'react';
import { ExplorerView } from './Explorer.view';
import Resizable from 're-resizable';

export class HomeView extends React.Component {
    render() {
        return <div>
            <Resizable defaultSize={{width:200, height:window.innerHeight}}
                maxWidth={window.innerWidth-200}
                minWidth={150}
                enable={{top:false, left:false, bottom:false, right:true}}
                style={{overflow: 'hidden'}}>
                <ExplorerView />
            </Resizable>
            <iframe></iframe>
        </div>
    }
}