import React from 'react';
import ExplorerView from './Explorer.view';
import BottomView from './Bottom.view';
import EditorView from './Editor.view';
import BoardView from '../board/Board.view';

export class HomeView extends React.Component {
    render() {
        return <div style={styles.layout}  onContextMenu={(e)=> e.preventDefault()}>
            {/* <ExplorerView /> */}
            <div style={styles.main}>
                <BoardView />
                <BottomView />
            </div>
            <EditorView />
        </div>
    }
}

const styles:any = {
    layout: {
        display:'flex',
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0
    },
    main: {
        flex:1,
        position:'relative',
        display:'flex'
    }
}