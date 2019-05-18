import { View } from '../view';
import React, {CSSProperties} from 'react';

export class PropertyView extends View {

    render() {
        const elem = this.mainCtrl.getSelectedElement();
        console.log(elem);
        return <div style={style.layout}>
            <h5>Property</h5>
            
        </div>
    }
}

const style: {[s:string]: CSSProperties;} = {
    layout: {
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        width:200,
        background:'#EEE',
        borderTop:'solid 1px #CCC',
        borderLeft:'solid 1px #CCC'
    }
}