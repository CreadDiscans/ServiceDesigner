import React from 'react';
import ComponentsView from '../components/Components.view';
import ElementsView from '../elements/Elements.view';
import { Theme } from '../utils/Theme';

export class ExplorerView extends React.Component {

    render() {
        return <div style={styles.layout}>
            <div style={styles.title}>EXPLORER</div>
            <ComponentsView />
            <ElementsView />
        </div>
    }
}

const styles:any = {
    layout: {
        backgroundColor:Theme.bgBodyColor,
        height:'100%'
    },
    title:{
        color:Theme.fontColor,
        fontSize:10,
        padding:10,
        fontWeight:300
    }
}