import React from 'react';
import { File, FileType } from '../models/file';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { FaRegFolder, FaRegFile, FaRegClone, FaRegCircle } from 'react-icons/fa';
import { DiReact } from 'react-icons/di';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as componentsActions from './Components.action';
import * as elementsActions from '../elements/Elements.action';
import * as layoutActions from '../layout/Layout.actions';
import ScrollArea from 'react-scrollbar';
import Resizeable from 're-resizable';
import { Theme } from '../utils/Theme';
import { ContextMenuType } from '../utils/constant';

class ComponentsView extends React.Component<any> {

    state:any =  {
        hover:0,
        collapse: true,
    }

    compare(a,b) {
        if (a.type == FileType.FILE && b.type == FileType.FOLDER) {
            return 1;
        } else if (a.type == FileType.FOLDER && b.type == FileType.FILE) {
            return -1;
        } else {
            return a.name > b.name ? 1: -1
        }
    }

    clickItem(item) {
        if (item.type === FileType.FOLDER) {
            item.collapse = !item.collapse;
        }
        const { ComponentsActions, ElementsActions } = this.props;
        ComponentsActions.selectFile(item);
        ElementsActions.choiceComponent(item);
    }

    clickItemRight(e, item) {
        e.preventDefault();
        e.stopPropagation();
        const { LayoutActions, ComponentsActions } = this.props;
        ComponentsActions.selectFile(item);
        LayoutActions.showContextMenu({
            x:e.clientX,
            y:e.clientY,
            type: ContextMenuType.Component,
            target:item
        })
    }

    create(type:FileType) {
        const { data, ComponentsActions } = this.props;
        let focus;
        if (data.components.select === undefined) {
            focus = 'root'
        } else {
            focus = 'input_'+data.components.select.id
        }
        ComponentsActions.readyToCreate({create: true, type: type, focus:focus});
    }

    createComplete() {
        const { data, ComponentsActions } = this.props;
        if (data.components.name !== '') {
            if (data.components.rename === 0) {
                ComponentsActions.createFile({
                    name: data.components.name,
                    type: data.components.type
                })
            } else {
                data.components.select.name = data.components.name
            }
        }
        ComponentsActions.reset();
    }

    unselect() {
        const { ComponentsActions } = this.props;
        ComponentsActions.selectFile(undefined);
    }

    collapseAll() {
        const { ComponentsActions } = this.props;
        ComponentsActions.collapseFile();
    }

    recursive(item:any, dep:number) {
        const { data, ComponentsActions } = this.props;
        let marginLeft = 15+dep*5;
        if (data.components.select && data.components.select.type == FileType.FILE) {
            marginLeft -= 5;
        }
        return <div key={item.id}>
            {data.components.rename !== item.id && <div
                style={Object.assign({
                    paddingTop:1,
                    paddingBottom:1,
                    paddingLeft:10+dep*5
                }, this.state.hover === item.id && styles.hover, data.components.select && data.components.select.id == item.id && styles.active)} 
                onMouseEnter={()=> this.setState({hover:item.id})}
                onMouseLeave={()=> this.setState({hover:undefined})}
                onClick={()=> this.clickItem(item)}
                onContextMenu={(e)=>this.clickItemRight(e, item)}>
                {item.type === FileType.FOLDER ? [
                    !item.collapse && <IoMdArrowDropright style={styles.arrow} key={0} />,
                    item.collapse && <IoMdArrowDropdown style={styles.arrow} key={1} />
                ] : <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                {item.name}
            </div>}
            { data.components.select && data.components.select.id === item.id && data.components.create && <div style={{marginLeft:marginLeft}}>
                {data.components.type === FileType.FOLDER && <IoMdArrowDropright style={styles.arrow} key={0} />}
                {data.components.type === FileType.FILE && <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                <input id="file-create-input" style={{...styles.insertInput,...{width:'calc(100% - 18px)'}}} 
                    value={data.components.name} 
                    onChange={(e)=>ComponentsActions.updateName(e.target.value)}
                    onBlur={()=>this.createComplete()} ref={'input_'+item.id}
                    onKeyPress={(e)=>{
                        if (e.key === 'Enter') {
                            this.createComplete()
                        }
                    }}
                    autoComplete="off"/>
            </div> }
            { item.collapse && item.children.sort(this.compare).map((child:File)=> this.recursive(child, dep+1))}
        </div>
    }

    componentDidUpdate() {
        const { data, ComponentsActions } = this.props;
        if (data.components.focus !== undefined) {
            const focus:any = data.components.focus;
            const input:any = this.refs[focus];
            if (input) {
                input.focus();
                ComponentsActions.resetFocus();
            }
        }
    }

    renderTitle() {
        return <div id="components"
            style={styles.group} 
            onMouseEnter={()=>this.setState({hover:-1})}
            onMouseLeave={()=>this.setState({hover:undefined})}>
            <span onClick={()=>this.setState({collapse: !this.state.collapse})}>
                {!this.state.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
                {this.state.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
                COMPONENTS
            </span>
            {this.state.collapse && this.state.hover === -1 && [
                <span id="icon-collapse" key={0}><FaRegClone style={styles.actionIcon} onClick={()=> this.collapseAll()}/></span>, 
                <span id="icon-create-file" key={1}><FaRegFile style={styles.actionIcon} onClick={()=> this.create(FileType.FILE)}/></span>, 
                <span id="icon-create-folder" key={2}><FaRegFolder style={styles.actionIcon} onClick={()=> this.create(FileType.FOLDER)}/></span>,
                <span id="icon-unselect" key={3}><FaRegCircle style={styles.actionIcon} onClick={()=> this.unselect()}/></span>
            ]}
        </div>
    }

    render() {
        const { data, ComponentsActions } = this.props;
        return <div>
            {this.renderTitle()}
            <div id="components-body" style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)} ref="layout"
                onContextMenu={(e)=> this.clickItemRight(e, undefined)}>
                <Resizeable
                    maxHeight={window.innerHeight-300}
                    minHeight={100}
                    enable={{top:true, bottom:true, left:false, right:false}}>
                    <ScrollArea style={{height:this.refs.layout ? this.refs.layout['clientHeight'] : 'auto', userSelect:'none'}}
                        verticalScrollbarStyle={{backgroundColor:'white'}}>
                        {data.components.files.sort(this.compare).map((file:any)=> this.recursive(file, 0))}
                        {data.components.create && !data.components.select && <div style={{marginLeft:10}}>
                            {data.components.type === FileType.FOLDER && <IoMdArrowDropright style={styles.arrow} key={0} />}
                            {data.components.type === FileType.FILE && <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                            <input id="file-create-input" style={{...styles.insertInput,...{width:'calc(100% - 18px)'}}} 
                                value={data.components.name} 
                                onChange={(e)=>ComponentsActions.updateName(e.target.value)}
                                onBlur={()=>this.createComplete()} ref={'root'}
                                onKeyPress={(e)=>{
                                    if (e.key === 'Enter') {
                                        this.createComplete()
                                    }
                                }}
                                autoComplete="off"/>
                        </div>}
                    </ScrollArea>
                </Resizeable>
            </div>
        </div>
    }
}

const styles:any = {
    layout: {
        color:Theme.fontColor,
        fontSize:11,
        maxHeight: 0,
        transition: 'max-height 0.15s ease-out',
        overflow: 'hidden'
    },
    hover: {
        backgroundColor:Theme.bgBodyHoverColor,
        cursor:'pointer'
    },
    active: {
        backgroundColor:Theme.bgBodyActiveColor,
    },
    arrow: {
        marginTop: -1,
        fontSize: 13,
        marginRight:5
    },
    group: {
        backgroundColor:Theme.bgHeadColor,
        color:Theme.fontColor,
        fontSize:10,
        fontWeight:600,
        padding:2,
        cursor:'pointer',
        userSelect:'none'
    },
    groupHide: {
        maxHeight: 1000,
        transition: 'max-height 0.25s ease-in'
    },
    actionIcon: {
        marginTop:1,
        fontSize:12,
        marginRight:10,
        float:'right'
    },
    insertInput: {
        fontSize:12,
        color:Theme.fontColor,
        backgroundColor:Theme.bgBodyActiveColor,
        borderWidth:0,
        outline:'none'
    }
}

export default connectRouter(
    (state:any)=> ({
        data: {
            components: state.components,
            layout: state.layout
        }
    }),
    (dispatch:any) => ({
        ComponentsActions: bindActionCreators(componentsActions, dispatch),
        ElementsActions: bindActionCreators(elementsActions, dispatch),
        LayoutActions: bindActionCreators(layoutActions, dispatch)
    }),
    ComponentsView
)