import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { Resizable } from 're-resizable';
import PropertiesView from '../property/Property.view';
import PropertyDetailView from '../property/PropertyDetail.view';
import { ContextMenuType } from '../utils/constant';
import { bindActionCreators } from 'redux';
import * as layoutActions from '../layout/Layout.actions';
import * as propertyActions from '../property/Property.action';

class EditorView extends React.Component<any> {

    state = {
        hover: ''
    }

    menuItems = {
        [ContextMenuType.Property]: [
            {
                name: 'Add Property',
                click: ()=> {
                    const { PropertyActions, LayoutActions } = this.props;
                    PropertyActions.readyToCreate();
                    LayoutActions.hideContextMenu();
                }
            },
            {
                name: 'Delete Property',
                click: ()=> {
                    const { data, PropertyActions, LayoutActions } = this.props;
                    if (data.layout.contextMenu.target) {
                        PropertyActions.deleteProperty(data.layout.contextMenu.target.name);
                        LayoutActions.hideContextMenu();
                    }
                }
            }
        ]
    }

    renderContextMenu() {
        const { data } = this.props;
        return <div id="contextMenu" 
            style={{...styles.contextMenu,...{
                left: data.layout.contextMenu.x,
                top: data.layout.contextMenu.y,
                display:data.layout.contextMenu.display}}}>
            
            {this.menuItems[data.layout.contextMenu.type]
                .map(menu=> <div key={menu.name}
                    style={Object.assign({}, styles.contextMenuItem, this.state.hover === menu && styles.hover)}
                    onMouseEnter={()=> this.setState({hover:menu})}
                    onMouseLeave={()=>this.setState({hover:undefined})}
                    onClick={()=> menu.click()}>
                    {menu.name}
                </div>)}
        </div>
    }

    render() {
        const { data } = this.props;
        return <div style={styles.layout}>
            <Resizable defaultSize={{width:200, height:window.innerHeight}}
                enable={{left:true, right:false, top:false, bottom:false}}>

                <div style={styles.title}>EDITOR</div>
                <PropertiesView />
                <PropertyDetailView />
            </Resizable>
            {data.layout.contextMenu.type === ContextMenuType.Property && this.renderContextMenu()}
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
    },
    contextMenu: {
        position: 'absolute',
        left:100,
        width: 130,
        backgroundColor: Theme.bgBodyColor,
        color:Theme.fontColor,
        fontSize:11,
        padding: '5px 0px',
        zIndex:10,
        boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 1)'
    },
    contextMenuItem: {
        padding: '2px 10px'
    },
    hover: {
        backgroundColor:Theme.bgBodyHoverColor,
        cursor:'pointer'
    }
}

export default connectRouter(
    (state) => ({
        data: {
            layout: state.layout
        }
    }),
    (dispatch) => ({
        LayoutActions: bindActionCreators(layoutActions, dispatch),
        PropertyActions: bindActionCreators(propertyActions, dispatch)
    }),
    EditorView
)