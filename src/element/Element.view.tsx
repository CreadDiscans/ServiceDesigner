import React from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DiReact, DiHtml5, DiBootstrap } from 'react-icons/di';
import ScrollArea from 'react-scrollbar';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as elementActions from './Element.action';
import * as layoutActions from '../layout/Layout.actions';
import * as propertyActions from '../property/Property.action';
import { Theme } from '../utils/Theme';
import { ContextMenuType, ElementType } from '../utils/constant';
import htmlJson from '../asset/html.json';
import reactstrapJson from '../asset/reactstrap.json';
import reactNativeJson from '../asset/react-native.json';
import _ from 'lodash';

class ElementView extends React.Component<any> {

    state:any =  {
        hover:'',
        collapse: true,
        ctxMenu:{
            x:0,
            y:0,
            display:'none',
            target:undefined
        },
        drag: undefined,
        drop: undefined
    }

    clickItem(item) {
        const { ElementActions, PropertyActions } = this.props;
        ElementActions.selectElement(item);
        PropertyActions.choiceElement(item);
    }

    clickItemRight(e, item) {
        e.preventDefault();
        e.stopPropagation();
        const { LayoutActions, ElementActions, PropertyActions } = this.props;
        ElementActions.selectElement(item);
        PropertyActions.choiceElement(item);
        LayoutActions.showContextMenu({
            x:e.clientX,
            y:e.clientY,
            type: ContextMenuType.Element,
            target:item
        })
    }

    completeAdd() {
        const { ElementActions } = this.props;
        ElementActions.completeAdd()
    }

    getLibIcon(type:ElementType) {
        if (type === ElementType.Html) {
            return <DiHtml5 style={{...styles.arrow,...{color:Theme.iconHtmlColor}}} key={0}/>
        } else if (type === ElementType.Reactstrap) {
            return <DiBootstrap style={{...styles.arrow,...{color:Theme.iconBootstrapColor}}} key={0}/>
        } else {
            return <DiReact style={{...styles.arrow,...{color:Theme.iconReactColor}}} key={0}/>
        }
    }

    componentDidUpdate() {
        if (this.refs.input) {
            const input:any = this.refs.input;
            input.focus();
        }
    }

    renderTitle() {
        const { data } = this.props;
        return <div id="element-title" style={styles.group}>
          <span onClick={()=>this.setState({collapse: !this.state.collapse})}>
            {!this.state.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
            {this.state.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
            {data.element.component.name ? 
                data.element.component.name :
                'ELEMENTS'}
          </span>
        </div>
    }

    renderElement(elem, dep:number=0) {
        const { data, ElementActions } = this.props; 
        const nameProp = _.last(elem.prop.filter(prop=>prop.name === 'name'));
        return <div key={elem.id}>
            <div className="element-item" style={Object.assign({
                    cursor:'move',
                    color:Theme.fontColor,
                    paddingTop:1,
                    paddingBottom:1,
                    paddingLeft:10+dep*5,
                }, this.state.hover === elem.id && styles.hover, 
                data.element.select && data.element.select.id === elem.id && styles.active,
                this.state.drop && this.state.drop.id === elem.id && {
                    background: Theme.primary
                })} 
                onMouseEnter={()=> {
                    this.setState({hover:elem.id})
                    ElementActions.hoverElement(elem);
                }}
                onMouseLeave={()=> {
                    this.setState({hover:undefined})
                    ElementActions.hoverElement(undefined);
                }}
                onDragStart={()=> this.setState({drag: elem})}
                onDragEnd={()=> {
                    ElementActions.dragAndDropElement({from: this.state.drag, to: this.state.drop})
                    this.setState({drag: undefined, drop:undefined})
                }}
                onDragOver={(e)=> {
                    e.stopPropagation();
                    this.setState({drop: elem})
                }}
                draggable={true}
                onClick={()=> this.clickItem(elem)}
                onContextMenu={(e)=>this.clickItemRight(e, elem)}>
                {elem.children.length === 0 ? this.getLibIcon(elem.lib) : elem.collapse ? 
                    <IoMdArrowDropdown onClick={()=> ElementActions.collapseElement(elem)} style={styles.arrow} /> : 
                    <IoMdArrowDropright onClick={()=> ElementActions.collapseElement(elem)} style={styles.arrow} /> }
                {elem.tag}
                {nameProp && nameProp.value !== '' && '[' + nameProp.value + ']'}
                {this.renderInput(elem)}
            </div>
            { elem.collapse && elem.children.map(item=> this.renderElement(item, dep+1))}
        </div>
    }

    renderInput(item) {
        const { data, ElementActions } = this.props;
        return <div style={{marginLeft:10}}>
            {data.element.insert.ing && (item ? (data.element.select && item.id === data.element.select.id) : data.element.select === undefined) && 
            [this.getLibIcon(data.element.insert.type),
            <input key={1} id="element-input"
            list={data.element.insert.type}
            style={{...styles.insertInput,...{width:'calc(100% - 18px)'}}} 
            onChange={(e)=> ElementActions.updateName(e.target.value)} 
            onBlur={()=> this.completeAdd()}
            ref={'input'}
            onKeyPress={(e)=> {
                if (e.key === 'Enter') {
                    this.completeAdd()
                }
            }}/>]}
        </div>
    }

    renderDataList() {
        return <div>
            <datalist id={ElementType.Html}>
                {Object.keys(htmlJson).map(tag=> <option key={tag} value={tag}/>)}
            </datalist>
            <datalist id={ElementType.Reactstrap}>
                {Object.keys(reactstrapJson).map(tag=> <option key={tag} value={tag}/>)}
            </datalist>
            <datalist id={ElementType.ReactNative}>
                {Object.keys(reactNativeJson).map(tag=> <option key={tag} value={tag}/>)}
            </datalist>
        </div>
    }

    render() {
        let height = 1000;
        if (this.refs.layout) {
            const layout:any = this.refs.layout
            height = window.innerHeight - layout.offsetTop-29;
        }
        const { data } = this.props;
        return <div>
            {this.renderTitle()}
            <div id="element-wrap" style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)} ref='layout' 
                onDragOver={()=> this.setState({drop: undefined})}
                onContextMenu={(e)=> this.clickItemRight(e, undefined)}>
                <ScrollArea style={{height:height}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                    {data.element.component && data.element.component.element.children.map(elem=> this.renderElement(elem))}
                    {this.renderInput(undefined)}
                </ScrollArea>
            </div>
            {this.renderDataList()}
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
        cursor: 'pointer'
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
            element: state.element
        }
    }),
    (dispatch) => ({
            ElementActions: bindActionCreators(elementActions, dispatch),
            LayoutActions: bindActionCreators(layoutActions, dispatch),
            PropertyActions: bindActionCreators(propertyActions, dispatch)
    }),
    ElementView
)