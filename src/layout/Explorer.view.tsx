import React from 'react';
import ComponentsView from '../component/Component.view';
import ElementsView from '../elements/Elements.view';
import { Theme } from '../utils/Theme';
import Resizable from 're-resizable';
import { connectRouter } from '../redux/connection';
import { ContextMenuType, ElementType } from '../utils/constant';
import * as layoutActions from './Layout.actions';
import * as componentsActions from '../component/Component.action';
import * as elementsActions from '../elements/Elements.action';
import { bindActionCreators } from 'redux';
import { FileType } from '../models/file';

class ExplorerView extends React.Component<any> {

    state = {
        hover:''
    }

    createFile(type) {
        const { data, ComponentsActions, LayoutActions } = this.props;
        let focus;
        if (data.layout.contextMenu.target === undefined) {
            focus = 'root'
        } else {
            focus = 'input_'+data.layout.contextMenu.target.id
            data.layout.contextMenu.target.collapse = true;
        }
        ComponentsActions.readyToCreateByMenu({create:true, type:type, focus:focus, select:data.layout.contextMenu.target});
        LayoutActions.hideContextMenu();
    }

    menuItems = {
        [ContextMenuType.Component]: [
            {
                name:'New File',
                click: ()=> this.createFile(FileType.FILE)
            }, {
                name: 'New Folder',
                click: ()=> this.createFile(FileType.FOLDER)
            },{
                name: 'Unselect',
                click: ()=> {
                    const { ComponentsActions, LayoutActions } = this.props;
                    ComponentsActions.selectFile(undefined);
                    LayoutActions.hideContextMenu();
                }
            },{
                name:'Rename',
                click: ()=> {
                    const { data, ComponentsActions, LayoutActions } = this.props;
                    if (data.layout.contextMenu.target) {
                        ComponentsActions.readyToRename({
                            name: data.layout.contextMenu.target.name,
                            create:true,
                            focus: 'input_'+data.layout.contextMenu.target.id,
                            type: data.layout.contextMenu.target.type,
                            rename: data.layout.contextMenu.target.id
                        });
                    }
                    LayoutActions.hideContextMenu();
                } 
            },{
                name:'Delete',
                click: ()=> {
                    const { data, ComponentsActions, LayoutActions } = this.props;
                    ComponentsActions.deleteFile(data.layout.contextMenu.target);
                    LayoutActions.hideContextMenu();
                }
            }
        ],
        [ContextMenuType.Element]: [
            {
                name: 'Add HTML',
                click: ()=> {
                    const { ElementsActions, LayoutActions } = this.props;
                    ElementsActions.readyToAdd(ElementType.Html);
                    LayoutActions.hideContextMenu();
                }
            }, {
                name: 'Add Reactstrap',
                click: ()=> {
                    const { ElementsActions, LayoutActions } = this.props;
                    ElementsActions.readyToAdd(ElementType.Reactstrap);
                    LayoutActions.hideContextMenu();
                }
            }, {
                name: 'Add React Native',
                click: ()=> {
                    const { ElementsActions, LayoutActions } = this.props;
                    ElementsActions.readyToAdd(ElementType.ReactNative);
                    LayoutActions.hideContextMenu();
                }
            }, {
                name: 'Delete',
                click: ()=> {
                    const { data, ElementsActions, LayoutActions } = this.props;
                    ElementsActions.deleteElement(data.layout.contextMenu.target);
                    LayoutActions.hideContextMenu();
                }
            }
        ]
    }

    componentWillMount() {
        document.addEventListener('click', (e:any)=> {
            const { data, LayoutActions } = this.props;
            if (data.layout.contextMenu.display === 'block') 
                LayoutActions.hideContextMenu();
        })
    }

    renderContextMenu() {
        const { data } = this.props;
        return <div id="contextMenu" 
            style={{...styles.contextMenu,...{
                left: data.layout.contextMenu.x,
                top: data.layout.contextMenu.y,
                display:data.layout.contextMenu.display}}}>
            
            {data.layout.contextMenu.type && this.menuItems[data.layout.contextMenu.type]
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
        return <div style={{display:'inline-block'}}>
            <Resizable defaultSize={{width:200, height:window.innerHeight}}
                maxWidth={window.innerWidth-200}
                minWidth={150}
                enable={{top:false, left:false, bottom:false, right:true}}
                style={{overflow: 'hidden'}}>
                <div style={styles.layout}>
                    <div style={styles.title}>EXPLORER</div>
                    <ComponentsView />
                    <ElementsView />
                </div>
            </Resizable>
            {this.renderContextMenu()}
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
    (state)=> ({
        data: {
            layout:state.layout
        }
    }),
    (dispatch)=> ({
        LayoutActions: bindActionCreators(layoutActions, dispatch),
        ComponentsActions: bindActionCreators(componentsActions, dispatch),
        ElementsActions: bindActionCreators(elementsActions, dispatch)
    }),
    ExplorerView
)