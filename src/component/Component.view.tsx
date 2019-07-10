import React from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { FaRegFolder, FaRegFile, FaRegClone, FaRegCircle } from 'react-icons/fa';
import { DiReact } from 'react-icons/di';
import ScrollArea from 'react-scrollbar';
import Resizeable from 're-resizable';
import { Theme } from '../utils/Theme';
import { ContextMenuType, FileType } from '../utils/constant';
import { connection, Props } from '../redux/Reducers';

class ComponentView extends React.Component<Props> {

    state:any =  {
        hover:0,
        collapse: true,
        drag: undefined,
        drop: undefined
    }

    compare(a,b) {
        if (a.type === FileType.FILE && b.type === FileType.FOLDER) {
            return 1;
        } else if (a.type === FileType.FOLDER && b.type === FileType.FILE) {
            return -1;
        } else {
            return a.name > b.name ? 1: -1
        }
    }

    clickItem(item) {
        if (item.type === FileType.FOLDER) {
            item.collapse = !item.collapse;
        }
        const { ComponentAction, ElementAction, PropertyAction } = this.props;
        ComponentAction.selectFile(item);
        ElementAction.choiceComponent(item);
        PropertyAction.reset();
    }

    clickItemRight(e, item) {
        e.preventDefault();
        e.stopPropagation();
        const { LayoutAction, ComponentAction } = this.props;
        ComponentAction.selectFile(item);
        LayoutAction.showContextMenu(
            e.clientX,
            e.clientY,
            ContextMenuType.Component,
            item
        )
    }

    create(type:FileType) {
        const { data, ComponentAction } = this.props;
        let focus;
        if (data.component.select === undefined) {
            focus = 'root'
        } else {
            focus = 'input_'+data.component.select.id
        }
        ComponentAction.readyToCreate(true, type, focus);
    }

    createComplete() {
        const { data, ComponentAction } = this.props;
        if (data.component.name !== '') {
            if (data.component.rename === 0) {
                ComponentAction.createFile(
                    data.component.name,
                    data.component.type
                )
            } else {
                data.component.select.name = data.component.name
            }
        }
        ComponentAction.reset();
    }

    unselect() {
        const { ComponentAction } = this.props;
        ComponentAction.selectFile(undefined);
    }

    collapseAll() {
        const { ComponentAction } = this.props;
        ComponentAction.collapseFile();
    }

    recursive(item:any, dep:number) {
        const { data, ComponentAction } = this.props;
        let marginLeft = 15+dep*5;
        if (data.component.select && data.component.select.type === FileType.FILE) {
            marginLeft -= 5;
        }
        return <div className="component-item" key={item.id}>
            {data.component.rename !== item.id && <div
                style={Object.assign({
                    paddingTop:1,
                    paddingBottom:1,
                    paddingLeft:10+dep*5
                }, this.state.hover === item.id && styles.hover, 
                data.component.select && data.component.select.id === item.id && styles.active,
                this.state.drop && this.state.drop.id === item.id && {
                    background: Theme.primary
                })} 
                onMouseEnter={()=> this.setState({hover:item.id})}
                onMouseLeave={()=> this.setState({hover:undefined})}
                onClick={()=> this.clickItem(item)}
                onContextMenu={(e)=>this.clickItemRight(e, item)}
                onDragStart={()=> this.setState({drag: item})}
                onDragEnd={()=> {
                    ComponentAction.dragAndDropComponent(this.state.drag, this.state.drop)
                    this.setState({drag: undefined, drop:undefined})
                }}
                onDragOver={(e)=> {
                    e.stopPropagation();
                    this.setState({drop: item})
                }}
                draggable={true}>
                    {item.type === FileType.FOLDER ? [
                        !item.collapse && <IoMdArrowDropright style={styles.arrow} key={0} />,
                        item.collapse && <IoMdArrowDropdown style={styles.arrow} key={1} />
                    ] : <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} 
                    />}
                    {item.name}
            </div>}
            { data.component.select && data.component.select.id === item.id && data.component.create && <div style={{marginLeft:marginLeft}}>
                {data.component.type === FileType.FOLDER && <IoMdArrowDropright style={styles.arrow} key={0} />}
                {data.component.type === FileType.FILE && <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                <input id="file-create-input" style={{...styles.insertInput,...{width:'calc(100% - 18px)'}}} 
                    value={data.component.name} 
                    onChange={(e)=>ComponentAction.updateName(e.target.value)}
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
        const { data, ComponentAction } = this.props;
        if (data.component.focus !== undefined) {
            const focus:any = data.component.focus;
            const input:any = this.refs[focus];
            if (input) {
                input.focus();
                // ComponentAction.resetFocus();
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
        const { data, ComponentAction } = this.props;
        return <div>
            {this.renderTitle()}
            <div id="components-body" style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)} ref="layout"
                onContextMenu={(e)=> this.clickItemRight(e, undefined)}
                onDragOver={()=> this.setState({drop: undefined})}>
                <Resizeable
                    maxHeight={window.innerHeight-300}
                    minHeight={100}
                    enable={{top:false, bottom:true, left:false, right:false}}>
                    <ScrollArea style={{height:this.refs.layout ? this.refs.layout['clientHeight'] : 'auto', userSelect:'none'}}
                        verticalScrollbarStyle={{backgroundColor:'white'}}>
                        {data.component.files.sort(this.compare).map((file:any)=> this.recursive(file, 0))}
                        {data.component.create && !data.component.select && <div style={{marginLeft:10}}>
                            {data.component.type === FileType.FOLDER && <IoMdArrowDropright style={styles.arrow} key={0} />}
                            {data.component.type === FileType.FILE && <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                            <input id="file-create-input" style={{...styles.insertInput,...{width:'calc(100% - 18px)'}}} 
                                value={data.component.name} 
                                onChange={(e)=>ComponentAction.updateName(e.target.value)}
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

export default connection(ComponentView)