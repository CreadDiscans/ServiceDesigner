import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import Resizable from 're-resizable';
import PropertiesView from '../property/Property.view';
import PropertyDetailView from '../property/PropertyDetail.view';

class EditorView extends React.Component {

    render() {
        return <div style={styles.layout}>
            <Resizable defaultSize={{width:200, height:window.innerHeight}}
                enable={{left:true, right:false, top:false, bottom:false}}>

                <div style={styles.title}>EDITOR</div>
                <PropertiesView />
                <PropertyDetailView />
            </Resizable>
        </div>
    }
}

const styles:any = {
    layout: {
        background:Theme.bgHeadColor
    },
    title: {
        color:Theme.fontColor,
        fontSize:10,
        padding:10,
        fontWeight:300
    }
}

export default connectRouter(
    (state) => ({}),
    (dispatch) => ({}),
    EditorView
)