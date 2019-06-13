import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';

class BoardView extends React.Component {

    render() {
        return <div style={styles.layout}>
            <iframe title="iframe" style={styles.frame}></iframe>
        </div>
    }
}

const styles = {
    layout: {
        flex:1,
        background: Theme.bgBoardColor,
        padding:5
    },
    frame: {
        width:'100%',
        borderWidth:0,
        background:'white',
        height:'calc(100% - 29px)'
    }
}

export default connectRouter(
    (state)=>({}),
    (dispatch)=>({}),
    BoardView
)