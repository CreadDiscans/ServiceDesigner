import React from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DiReact, DiHtml5, DiBootstrap } from 'react-icons/di';
import ScrollArea from 'react-scrollbar';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as elementsActions from './Elements.action';
import * as layoutActions from '../layout/Layout.actions';
import { Theme } from './../utils/Theme';
import { ContextMenuType, ElementType } from '../utils/constant';

class ElementsView extends React.Component<any> {

    state:any =  {
        hover:'',
        collapse: true,
        ctxMenu:{
            x:0,
            y:0,
            display:'none',
            target:undefined
        },
    }

    clickItem(item) {
        const { ElementsActions } = this.props;
        item.collapse = !item.collapse;
        ElementsActions.selectElement(item);
    }

    clickItemRight(e, item) {
        e.preventDefault();
        e.stopPropagation();
        const { LayoutActions, ElementsActions } = this.props;
        ElementsActions.selectElement(item);
        LayoutActions.showContextMenu({
            x:e.clientX,
            y:e.clientY,
            type: ContextMenuType.Element,
            target:item
        })
    }

    completeAdd() {
        const { ElementsActions } = this.props;
        ElementsActions.completeAdd()
    }

    getLibIcon(type:ElementType) {
        if (type === ElementType.Html) {
            return <DiHtml5 style={{...styles.arrow,...{color:'#de4b25'}}} key={0}/>
        } else if (type === ElementType.Reactstrap) {
            return <DiBootstrap style={{...styles.arrow,...{color:'#563d7c'}}} key={0}/>
        } else {
            return <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} key={0}/>
        }
    }

    // elemGroup(name:string, items:any) {
    //     return <div key={name} >
    //         <div
    //             style={Object.assign({
    //                 paddingTop:1,
    //                 paddingBottom:1,
    //                 paddingLeft:10
    //             }, this.state.hover === name && styles.hover)} 
    //             onMouseEnter={()=>this.setState({hover:name})}
    //             onMouseLeave={()=>this.setState({hover:undefined})}
    //             onClick={()=>this.clickItem(name)}>
    //             {this.state.collapse.indexOf(name) === -1 ?
    //                 <IoMdArrowDropright style={styles.arrow} /> :
    //                 <IoMdArrowDropdown style={styles.arrow} /> }
    //             {name}
    //         </div>
    //         { this.state.collapse.indexOf(name) !== -1 && items.map((item:Element)=> this.elemItem(item, name))}
    //     </div>
    // }

    // elemItem(elem, group:string) {
    //     return <div key={elem.name}>
    //         <div style={Object.assign({
    //             paddingTop:1,
    //             paddingBottom:1,
    //             paddingLeft:15
    //         }, this.state.hover === elem.name && styles.hover)}
    //         onMouseEnter={()=>this.setState({hover:elem.name})}
    //         onMouseLeave={()=>this.setState({hover:undefined})}
    //         onClick={()=> this.clickElem(elem)}>
    //             {this.getLibIcon(group)}
    //             {elem.name}
    //         </div>
    //     </div>
    // }

    renderTitle() {
        const { data } = this.props;
        return <div id="element-title" style={styles.group}>
          <span onClick={()=>this.setState({collapse: !this.state.collapse})}>
            {!this.state.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
            {this.state.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
            {data.elements.component.name ? 
                data.elements.component.name :
                'ELEMENTS'}
          </span>
        </div>
    }

    renderElement(elem, dep:number=0) {
        const { data } = this.props; 
        return <div key={elem.id}
            style={Object.assign({
                color:Theme.fontColor,
                paddingTop:1,
                paddingBottom:1,
                paddingLeft:10+dep*5
            }, this.state.hover === elem.id && styles.hover, data.elements.select && data.elements.select.id == elem.id && styles.active)} 
            onMouseEnter={()=> this.setState({hover:elem.id})}
            onMouseLeave={()=> this.setState({hover:undefined})}
            onClick={()=> this.clickItem(elem)}
            onContextMenu={(e)=>this.clickItemRight(e, elem)}>
            {this.getLibIcon(elem.lib)}
            {elem.tag}
            {elem.prop.name !== '' && '[' + elem.prop.name + ']'}
        </div>
    }

    renderInput(item) {
        const { data, ElementsActions } = this.props;
        return <div style={{marginLeft:10}}>
            {data.elements.insert.ing && (item ? item.id === data.elements.select.id : data.elements.select === undefined) && 
            [this.getLibIcon(data.elements.insert.type),
            <input key={1} id="element-input"
            style={{...styles.insertInput,...{width:'calc(100% - 18px)'}}} 
            onChange={(e)=> ElementsActions.updateName(e.target.value)} 
            onBlur={()=> this.completeAdd()}
            onKeyPress={(e)=> {
                if (e.key === 'Enter') {
                    this.completeAdd()
                }
            }}/>]}
        </div>
    }

    render() {
        let height = 1000;
        if (this.refs.layout) {
            const layout:any = this.refs.layout
            height = window.innerHeight - layout.offsetTop;
        }
        const { data } = this.props;
        console.log(data);
        return <div>
            {this.renderTitle()}
            <div style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)} ref='layout' 
                onContextMenu={(e)=> this.clickItemRight(e, undefined)}>
                <ScrollArea style={{height:height}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                    {data.elements.component && data.elements.component.elements.children.map(elem=> this.renderElement(elem))}
                    {this.renderInput(undefined)}
                </ScrollArea>
            </div>
        </div>
    }
}

const styles:any = {
    layout: {
        color:Theme.bgBodyColor,
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
    insertInput: {
        fontSize:12,
        color:Theme.fontColor,
        backgroundColor:Theme.bgBodyActiveColor,
        borderWidth:0,
        outline:'none'
    }
}

export default connectRouter(
    (state) => ({
        data: {
            elements: state.elements
        }
    }),
    (dispatch) => ({
            ElementsActions: bindActionCreators(elementsActions, dispatch),
            LayoutActions: bindActionCreators(layoutActions, dispatch)
    }),
    ElementsView
)