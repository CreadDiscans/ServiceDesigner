import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { bindActionCreators } from 'redux';
import * as propertyActions from './Property.action';
import * as layoutActions from '../layout/Layout.actions';
import { ContextMenuType } from '../utils/constant';
import ScrollArea from 'react-scrollbar'

class PropertyView extends React.Component<any> {

    clickItemRight(e, item) {
        e.preventDefault();
        e.stopPropagation();
        const { LayoutActions } = this.props;
        LayoutActions.showContextMenu({
            x: e.clientX,
            y: e.clientY,
            type: ContextMenuType.Property,
            target: item
        })
    }

    render() {
        const { data } = this.props;
        console.log(data);
        return <div id="Property" onContextMenu={(e)=>this.clickItemRight(e, undefined)}>
            <div style={styles.group}>Properties</div>
            <ScrollArea style={{height:500}} verticalScrollbarStyle={{backgroundColor:'white'}}>
                {Object.keys(data.property.element.prop).map(name=> 
                    <div style={styles.item} key={name}>
                        <span style={styles.itemName}>{name}</span> 
                        <span style={styles.itemType}>{data.property.element.prop[name].type}</span>
                    </div>
                )}
            </ScrollArea>
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
    (state)=> ({
        data: {
            property: state.property
        }
    }),
    (dispatch)=> ({
        PropertyActions: bindActionCreators(propertyActions, dispatch),
        LayoutActions: bindActionCreators(layoutActions, dispatch)
    }),
    PropertyView
)