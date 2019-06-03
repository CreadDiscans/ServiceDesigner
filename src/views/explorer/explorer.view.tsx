import React from 'react';
import ComponentsView from '../../components/Components.view';
import ElementsView from '../../elements/Elements.view';

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
        backgroundColor:'#252525',
        height:'100%'
    },
    title:{
        color:'rgb(205,205,205)',
        fontSize:10,
        padding:10,
        fontWeight:300
    }
}