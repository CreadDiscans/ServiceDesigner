import React from 'react';
import { File, FileType } from '../models/file';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { FaRegFolder, FaRegFile, FaRegClone, FaRegCircle } from 'react-icons/fa';
import { DiReact } from 'react-icons/di';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as componentsActions from './Components.action';

class ComponentsView extends React.Component<any> {

    state:any =  {
        hover:0,
        collapse: true,
        create: false,
        type: undefined,
        name: '',
        focus: undefined,
        ctxMenu:{
            x:0,
            y:0,
            display:'none',
            target:undefined
        },
        rename: 0,
    }

    componentWillMount() {
        document.addEventListener('click', ()=> {
            if (this.state.ctxMenu.display === 'block') {
                this.setState({
                    ctxMenu: {
                    ...this.state.ctxMenu,
                    display:'none'
                }})
            }
        })
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
        const { ComponentsActions } = this.props;
        ComponentsActions.selectFile(item)
    }

    clickItemRight(e, item) {
        e.preventDefault();
        this.setState({ctxMenu:{
            x:e.clientX,
            y:e.clientY,
            display:'block',
            target:item
        }})
    }

    create(type:FileType, select=undefined) {
        const { data } = this.props;
        let focus;
        if (data.components.select === undefined) {
            focus = 'root'
        } else {
            focus = 'input_'+data.components.select.id
        }
        if (select) {
            select.collapse = true;
        }
        this.setState({create: true, type: type, focus:focus});
    }

    rename(){
        this.setState({
            name:this.state.ctxMenu.target.name,
            create: true, 
            type: this.state.ctxMenu.target.type, 
            focus:'input_'+this.state.ctxMenu.target.id, 
            rename: this.state.ctxMenu.target.id
        });
    }

    createComplete() {
        if (this.state.name !== '') {
            if (this.state.rename === 0) {
                const { ComponentsActions } = this.props;
                ComponentsActions.createFile({
                    name: this.state.name,
                    type: this.state.type
                })
            } else {
                this.state.ctxMenu.target.name = this.state.name
            }
        }
        this.setState({name:'', type:undefined, create:false, rename:0})
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
        const { data } = this.props;
        let marginLeft = 15+dep*5;
        if (data.components.select && data.components.select.type == FileType.FILE) {
            marginLeft -= 5;
        }
        return <div key={item.id} >
            {this.state.rename !== item.id && <div
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
            { data.components.select && data.components.select.id === item.id && this.state.create && <div style={{marginLeft:marginLeft}}>
                {this.state.type === FileType.FOLDER && <IoMdArrowDropright style={styles.arrow} key={0} />}
                {this.state.type === FileType.FILE && <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                <input id="file-create-input" style={styles.insertInput} 
                    value={this.state.name} 
                    onChange={(e)=>this.setState({name:e.target.value})}
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
        if (this.state.focus !== undefined) {
            const focus:any = this.state.focus;
            const input:any = this.refs[focus];
            if (input) {
                input.focus();
                this.setState({focus: undefined});
            }
        }
    }

    renderContextMenu() {
        return <div id="contextMenu" 
                style={{...styles.contextMenu,...{
                    left: this.state.ctxMenu.x - 40,
                    top: this.state.ctxMenu.y,
                    display:this.state.ctxMenu.display
            }}}>
            <div style={Object.assign({}, styles.contextMenuItem, this.state.hover === 'menu_1' && styles.hover)} 
                onMouseEnter={()=> this.setState({hover:'menu_1'})} 
                onMouseLeave={()=>this.setState({hover:undefined})}
                onClick={()=>{
                    const { ComponentsActions } = this.props;
                    ComponentsActions.selectFile(this.state.ctxMenu.target);
                    this.create(FileType.FILE, this.state.ctxMenu.target);
                }}>New File</div>
            <div style={Object.assign({}, styles.contextMenuItem, this.state.hover === 'menu_2' && styles.hover)} 
                onMouseEnter={()=> this.setState({hover:'menu_2'})} 
                onMouseLeave={()=>this.setState({hover:undefined})}
                onClick={()=>{
                    const { ComponentsActions } = this.props;
                    ComponentsActions.selectFile(this.state.ctxMenu.target);
                    this.create(FileType.FOLDER, this.state.ctxMenu.target);
                }}>New Folder</div>
            <div style={Object.assign({}, styles.contextMenuItem, this.state.hover === 'menu_3' && styles.hover)} 
                onMouseEnter={()=> this.setState({hover:'menu_3'})} 
                onMouseLeave={()=>this.setState({hover:undefined})}
                onClick={()=>this.unselect()}>Unselect</div>
            <div style={Object.assign({}, styles.contextMenuItem, this.state.hover === 'menu_4' && styles.hover)} 
                onMouseEnter={()=> this.setState({hover:'menu_4'})} 
                onMouseLeave={()=>this.setState({hover:undefined})}
                onClick={()=>this.rename()}>Rename</div>
            <div style={Object.assign({}, styles.contextMenuItem, this.state.hover === 'menu_5' && styles.hover)} 
                onMouseEnter={()=> this.setState({hover:'menu_5'})} 
                onMouseLeave={()=>this.setState({hover:undefined})}
                onClick={()=>{
                    const { ComponentsActions } = this.props;
                    ComponentsActions.deleteFile(this.state.ctxMenu.target);
                }}>Delete</div>
        </div>
    }

    render() {
        const { data } = this.props;
        console.log(data, this.state);
        return <div>
            <div id="components"
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
                    <span id="icon-create-file" key={1}><FaRegFile style={styles.actionIcon} onClick={()=> this.create(FileType.FILE)} key={1}/></span>, 
                    <span id="icon-create-folder" key={2}><FaRegFolder style={styles.actionIcon} onClick={()=> this.create(FileType.FOLDER)}/></span>,
                    <span id="icon-unselect" key={3}><FaRegCircle style={styles.actionIcon} onClick={()=> this.unselect()}/></span>
                ]}
            </div>
            <div id="components-body" style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)}>
                {data.components.files.sort(this.compare).map((file:any)=> this.recursive(file, 0))}
                {this.state.create && !data.components.select && <div style={{marginLeft:10}}>
                    {this.state.type === FileType.FOLDER && <IoMdArrowDropright style={styles.arrow} key={0} />}
                    {this.state.type === FileType.FILE && <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                    <input id="file-create-input" style={styles.insertInput} 
                        value={this.state.name} 
                        onChange={(e)=>this.setState({name:e.target.value})}
                        onBlur={()=>this.createComplete()} ref={'root'}
                        onKeyPress={(e)=>{
                            if (e.key === 'Enter') {
                                this.createComplete()
                            }
                        }}
                        autoComplete="off"/>
                </div>}
            </div>
            {this.renderContextMenu()}
        </div>
    }
}

const styles:any = {
    layout: {
        color:'rgb(205,205,205)',
        fontSize:11,
        maxHeight: 0,
        transition: 'max-height 0.15s ease-out',
        overflow: 'hidden'
    },
    hover: {
        backgroundColor:'rgb(56,56,56)',
        cursor:'pointer'
    },
    active: {
        backgroundColor:'#393938',
    },
    arrow: {
        marginTop: -1,
        fontSize: 13,
        marginRight:5
    },
    group: {
        backgroundColor:'#333333',
        color:'#c1c1c1',
        fontSize:10,
        fontWeight:600,
        padding:2,
        cursor:'pointer'
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
        color:'#c1c1c1',
        backgroundColor:'#393938',
        borderWidth:0,
        outline:'none'
    },
    contextMenu: {
        position: 'absolute',
        left:100,
        width: 100,
        backgroundColor: '#484747',
        color:'#c1c1c1',
        fontSize:12,
        padding: '5px 0',
        zIndex:10
    },
    contextMenuItem: {
        padding: '0 5px'
    }
}

export default connectRouter(
    (state:any)=> ({
        data: {
            components: state.components,
        }
    }),
    (dispatch:any) => ({
        ComponentsActions: bindActionCreators(componentsActions, dispatch)
    }),
    ComponentsView
)