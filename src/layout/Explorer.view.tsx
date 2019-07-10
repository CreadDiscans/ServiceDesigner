import React from 'react';
import ComponentsView from '../component/Component.view';
import ElementsView from '../element/Element.view';
import { Theme } from '../utils/Theme';
import Resizable from 're-resizable';
import { ContextMenuType, ElementType, FileType } from '../utils/constant';
import { Props, connection } from '../redux/Reducers';

class ExplorerView extends React.Component<Props> {

    state = {
        hover:''
    }

    createFile(type) {
        const { data, ComponentAction, LayoutAction } = this.props;
        let focus;
        if (data.layout.contextMenu.target === undefined) {
            focus = 'root'
        } else if ('id' in data.layout.contextMenu.target) {
            focus = 'input_'+data.layout.contextMenu.target.id
            data.layout.contextMenu.target.collapse = true;
        }
        if (data.layout.contextMenu.target === undefined)
            ComponentAction.readyToCreateByMenu(true, type, focus, undefined);
        else if (!('tag' in data.layout.contextMenu.target) && !('value' in data.layout.contextMenu.target))
            ComponentAction.readyToCreateByMenu(true, type, focus, data.layout.contextMenu.target);
        LayoutAction.hideContextMenu();
    }

    menuItems = {
        [ContextMenuType.Component]: [
            {
                name:'New Component',
                click: ()=> this.createFile(FileType.FILE)
            }, {
                name: 'New Group',
                click: ()=> this.createFile(FileType.FOLDER)
            },{
                name: 'Unselect',
                click: ()=> {
                    const { ComponentAction, LayoutAction } = this.props;
                    ComponentAction.selectFile(undefined);
                    LayoutAction.hideContextMenu();
                }
            },{
                name:'Rename',
                click: ()=> {
                    const { data, ComponentAction, LayoutAction } = this.props;
                    if (data.layout.contextMenu.target) {
                        if (!('tag' in data.layout.contextMenu.target) && !('value' in data.layout.contextMenu.target))
                            ComponentAction.readyToRename(
                                data.layout.contextMenu.target.name,
                                'input_'+data.layout.contextMenu.target.id,
                                data.layout.contextMenu.target.type,
                                data.layout.contextMenu.target.id
                            );
                    }
                    LayoutAction.hideContextMenu();
                } 
            },{
                name:'Delete',
                click: ()=> {
                    const { data, ComponentAction, LayoutAction } = this.props;
                    if (!('tag' in data.layout.contextMenu.target) && !('value' in data.layout.contextMenu.target))
                        ComponentAction.deleteFile(data.layout.contextMenu.target);
                    LayoutAction.hideContextMenu();
                }
            }
        ],
        [ContextMenuType.Element]: [
            {
                name: 'Add HTML',
                click: ()=> {
                    const { data, ElementAction, LayoutAction } = this.props;
                    if (data.element.component.element.id !== -1) {
                        ElementAction.readyToAdd(ElementType.Html);
                    }
                    LayoutAction.hideContextMenu();
                }
            }, {
                name: 'Add Reactstrap',
                click: ()=> {
                    const { data, ElementAction, LayoutAction } = this.props;
                    if (data.element.component.element.id !== -1) {
                        ElementAction.readyToAdd(ElementType.Reactstrap);
                    }
                    LayoutAction.hideContextMenu();
                }
            }, {
                name: 'Add React Icons',
                click: ()=> {
                    const { data, ElementAction, LayoutAction } = this.props;
                    if (data.element.component.element.id !== -1) {
                        ElementAction.readyToAdd(ElementType.ReactIcons);
                    }
                    LayoutAction.hideContextMenu();
                }
            },{
                name: 'Add React Native',
                click: ()=> {
                    const { data, ElementAction, LayoutAction } = this.props;
                    if (data.element.component.element.id !== -1) {
                        ElementAction.readyToAdd(ElementType.ReactNative);
                    }
                    LayoutAction.hideContextMenu();
                }
            },{
                name: 'Add RN Elements',
                click: ()=> {
                    const { data, ElementAction, LayoutAction } = this.props;
                    if (data.element.component.element.id !== -1) {
                        ElementAction.readyToAdd(ElementType.ReactNativeElements);
                    }
                    LayoutAction.hideContextMenu();
                }
            },{
                name: 'Delete',
                click: ()=> {
                    const { data, ElementAction, LayoutAction } = this.props;
                    if ('tag' in data.layout.contextMenu.target)
                        ElementAction.deleteElement(data.layout.contextMenu.target);
                    LayoutAction.hideContextMenu();
                }
            }
        ]
    }

    componentWillMount() {
        document.addEventListener('click', (e:any)=> {
            const { data, LayoutAction } = this.props;
            if (data.layout.contextMenu.display === 'block') 
                LayoutAction.hideContextMenu();
        })
    }

    renderContextMenu() {
        const { data } = this.props;
        return <div id="contextMenu" 
            style={{...styles.contextMenu,...{
                left: data.layout.contextMenu.x,
                top: data.layout.contextMenu.y,
                display:data.layout.contextMenu.display}}}>
            
            { this.menuItems[data.layout.contextMenu.type]
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
        return <div style={{display:'inline-block', zIndex: 10}}>
            <Resizable defaultSize={{width:200, height:'100%'}}
                maxWidth={window.innerWidth-200}
                minWidth={150}
                enable={{top:false, left:false, bottom:false, right:true}}
                style={{overflow: 'hidden'}}>
                <div style={styles.layout}>
                    <div style={styles.title}>EXPLORER</div>
                    <ComponentsView />
                    <ElementsView />
                    <div style={Object.assign({}, styles.message, 
                        data.layout.message.background !== undefined && {
                            background: data.layout.message.background, 
                            color: data.layout.message.color,
                            opacity: 1
                        })}>
                        {data.layout.message.text}</div>
                </div>
            </Resizable>
            {(data.layout.contextMenu.type === ContextMenuType.Component ||
                data.layout.contextMenu.type === ContextMenuType.Element)  && this.renderContextMenu()}
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
    },
    message: {
        position:'absolute',
        bottom:0,
        background:Theme.success,
        width:'100%',
        height:29,
        paddingLeft:5,
        paddingTop:3,
        color:Theme.successFont,
        transition: 'opacity ease .5s 0s',
        opacity: 0 
    }
}

export default connection(ExplorerView);