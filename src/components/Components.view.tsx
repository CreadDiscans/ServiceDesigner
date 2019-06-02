import React from 'react';
import { File, FileType } from '../models/file';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { FaRegFolder, FaRegFile, FaRegClone, FaRegCircle } from 'react-icons/fa';
import { DiReact } from 'react-icons/di';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as componentsActions from './Components.action';

class ComponentsView extends React.Component<any> {

    state =  {
        hover:0,
        active:0,
        collapse: true,
        create: false,
        type: undefined,
        name: '',
        focus: undefined
    }

    clickItem(item:File) {
        if (item.type === FileType.FOLDER) {
            item.collapse = !item.collapse;
        }
        const { ComponentsActions } = this.props;
        ComponentsActions.selectFile(item)
        this.setState({active:item.id});
    }

    create(e:any, type:FileType) {
        e.stopPropagation();
        const { data } = this.props;
        let focus;
        if (data.components.select === undefined) {
            focus = 'root'
        } else {
            focus = 'input_'+data.components.select.id
        }
        this.setState({create: true, type: type, focus:focus});
    }

    createComplete() {
        if (this.state.name !== '') {
            const { ComponentsActions } = this.props;
            ComponentsActions.createFile({
                name: this.state.name,
                type: this.state.type
            })
        }
        this.setState({name:'', type:undefined, create:false})
    }

    unselect(e:any) {
        e.stopPropagation();
        this.setState({active:0});
    }

    collapseAll(e:any) {
        e.stopPropagation();
        const { ComponentsActions } = this.props;
        ComponentsActions.collapseFile();
    }

    recursive(item:any, dep:number) {
        const { data } = this.props;
        return <div key={item.id} >
            <div
                style={Object.assign({
                    paddingTop:1,
                    paddingBottom:1,
                    paddingLeft:10+dep*5
                }, this.state.hover === item.id && styles.hover, this.state.active == item.id && styles.active)} 
                onMouseEnter={()=> this.setState({hover:item.id})}
                onMouseLeave={()=> this.setState({hover:undefined})}
                onClick={()=> this.clickItem(item)}>
                {item.type === FileType.FOLDER ? [
                    !item.collapse && <IoMdArrowDropright style={styles.arrow} key={0} />,
                    item.collapse && <IoMdArrowDropdown style={styles.arrow} key={1} />
                ] : <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                {item.name}
            </div>
            { data.components.select && data.components.select.id === item.id && this.state.create && <div style={{marginLeft:15+dep*5}}>
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
                    }}/>
            </div> }
            { item.collapse && item.children.map((child:File)=> this.recursive(child, dep+1))}
        </div>
    }

    componentDidUpdate() {
        if (this.state.focus !== undefined) {
            const focus:any = this.state.focus;
            const input:any = this.refs[focus];
            input.focus();
            this.setState({focus: undefined});
        }
    }

    render() {
        const { data } = this.props;
        console.log(data);
        return <div>
            <div id="components"
                style={styles.group} 
                onClick={()=>this.setState({collapse: !this.state.collapse})}
                onMouseEnter={()=>this.setState({hover:-1})}
                onMouseLeave={()=>this.setState({hover:undefined})}>
                {!this.state.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
                {this.state.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
                COMPONENTS
                {this.state.collapse && this.state.hover === -1 && [
                    <span id="icon-collapse" key={0}><FaRegClone style={styles.actionIcon} onClick={(e)=> this.collapseAll(e)}/></span>, 
                    <span id="icon-create-file" key={1}><FaRegFile style={styles.actionIcon} onClick={(e)=> this.create(e, FileType.FILE)} key={1}/></span>, 
                    <span id="icon-create-folder" key={2}><FaRegFolder style={styles.actionIcon} onClick={(e)=> this.create(e, FileType.FOLDER)}/></span>,
                    <span id="icon-unselect" key={3}><FaRegCircle style={styles.actionIcon} onClick={(e)=> this.unselect(e)}/></span>
                ]}
            </div>
            <div id="components-body" style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)}>
                {data.components.files.map((file:any)=> this.recursive(file, 0))}
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
                        }}/>
                </div>}
            </div>
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