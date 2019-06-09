import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';

class PropertyView extends React.Component {

    render() {
        return <div>
            <div style={styles.group}>Properties</div>
            <div style={styles.item}>
                <span style={styles.itemName}>item</span> 
                <span style={styles.itemType}>type</span>
            </div>
            <div style={styles.item}>
                <span style={styles.itemName}>item</span> 
                <span style={styles.itemType}>type</span>
            </div>
            <div style={styles.item}>
                <span style={styles.itemName}>item</span> 
                <span style={styles.itemType}>type</span>
            </div>
        </div>
    }
}

const styles:any = {
    group: {
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: Theme.borderColor,
        color:Theme.fontColor,
        fontSize:10,
        fontWeight:600,
        userSelect:'none',
        padding: '5px 10px'
    },
    item: {
        color:Theme.fontColor,
        fontSize:10,
        padding: '2px 10px',
        cursor:'pointer'
    },
    itemName: {

    },
    itemType: {
        float:'right'
    }
}

export default connectRouter(
    (state)=>({}),
    (dispatch)=> ({}),
    PropertyView
)