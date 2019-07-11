import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { bindActionCreators } from 'redux';
import * as propertyActions from './Property.action';
import * as layoutActions from '../layout/Layout.actions';
import { ContextMenuType } from '../utils/constant';
import ScrollArea from 'react-scrollbar';
import Resizeable from 're-resizable';

class PropertyView extends React.Component<any> {

    state = {
        hover:undefined
    }

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
        const { data, PropertyActions } = this.props;
        return <div id="Property" onContextMenu={(e)=>this.clickItemRight(e, undefined)}>
            <div style={styles.group}>Properties</div>
            <div ref={'layout'}>
                <Resizeable
                    maxHeight={window.innerHeight-300}
                    minHeight={100}
                    enable={{top:false, bottom:true, left:false, right:false}}>
                    <ScrollArea style={{height:this.refs.layout ? this.refs.layout['clientHeight'] : 'auto', userSelect:'none'}}
                        verticalScrollbarStyle={{backgroundColor:'white'}}>
                        <div id="property-list">
                            {data.property.element.prop.map(prop=> 
                                <div className="property-item" style={Object.assign({},styles.item, this.state.hover === prop.name && styles.hover)} key={prop.name}
                                    onMouseEnter={()=> this.setState({hover: prop.name})}
                                    onMouseLeave={()=> this.setState({hover: undefined})}
                                    onContextMenu={(e)=>this.clickItemRight(e, prop)}
                                    onClick={()=> {
                                        PropertyActions.selectProperty(prop)
                                    }}>
                                    <span style={styles.itemName}>{prop.name}</span> 
                                    <span style={styles.itemType}>{prop.type}</span>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </Resizeable>
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
    },
    hover: {
        backgroundColor:Theme.bgBodyHoverColor,
        cursor:'pointer'
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