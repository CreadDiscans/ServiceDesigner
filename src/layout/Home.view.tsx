import React from 'react';
import ExplorerView from './Explorer.view';
import BottomView from './Bottom.view';
import EditorView from './Editor.view';

export class HomeView extends React.Component {
    render() {
        return <div style={styles.layout}  onContextMenu={(e)=> e.preventDefault()}>
            <ExplorerView />
            <div style={styles.main}>
                <iframe title="iframe"></iframe>
                <BottomView />
            </div>
            <EditorView />
        </div>
    }
}

const styles:any = {
    layout: {
        display:'flex'
    },
    main: {
        flex:1,
        position:'relative'
    }
}