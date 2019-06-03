import React from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DiReact, DiHtml5, DiBootstrap } from 'react-icons/di';
import ScrollArea from 'react-scrollbar';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as elementsActions from './Elements.action';
import { Theme } from './../utils/Theme';

class ElementsView extends React.Component<any> {

    state:any =  {
        hover:'',
        collapse: true
    }

    componentWillMount() {

    }

    clickItem(groupName:string) {
        if (this.state.collapse.indexOf(groupName) === -1) {
            this.state.collapse.push(groupName);
        } else {
            this.state.collapse.splice(this.state.collapse.indexOf(groupName), 1);
        }
        this.setState({})
    }

    clickElem(elem:Element) {
        console.log(elem);
    }

    getLibIcon(group:string) {
        if (group === 'HtmlDomElement') {
            return <DiHtml5 style={{...styles.arrow,...{color:'#de4b25'}}}/>
        } else if (group === 'reactstrap') {
            return <DiBootstrap style={{...styles.arrow,...{color:'#563d7c'}}}/>
        } else {
            return <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />
        }
    }

    elemGroup(name:string, items:any) {
        return <div key={name} >
            <div
                style={Object.assign({
                    paddingTop:1,
                    paddingBottom:1,
                    paddingLeft:10
                }, this.state.hover === name && styles.hover)} 
                onMouseEnter={()=>this.setState({hover:name})}
                onMouseLeave={()=>this.setState({hover:undefined})}
                onClick={()=>this.clickItem(name)}>
                {this.state.collapse.indexOf(name) === -1 ?
                    <IoMdArrowDropright style={styles.arrow} /> :
                    <IoMdArrowDropdown style={styles.arrow} /> }
                {name}
            </div>
            { this.state.collapse.indexOf(name) !== -1 && items.map((item:Element)=> this.elemItem(item, name))}
        </div>
    }

    elemItem(elem, group:string) {
        return <div key={elem.name}>
            <div style={Object.assign({
                paddingTop:1,
                paddingBottom:1,
                paddingLeft:15
            }, this.state.hover === elem.name && styles.hover)}
            onMouseEnter={()=>this.setState({hover:elem.name})}
            onMouseLeave={()=>this.setState({hover:undefined})}
            onClick={()=> this.clickElem(elem)}>
                {this.getLibIcon(group)}
                {elem.name}
            </div>
        </div>
    }

    renderTitle() {
        return <div style={styles.group}>
          <span onClick={()=>this.setState({collapse: !this.state.collapse})}>
            {!this.state.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
            {this.state.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
            ELEMENTS
          </span>
        </div>
    }

    renderElement(elem) {
        return <div>

        </div>
    }

    render() {
        let height = 0;
        if (this.refs.layout) {
            const layout:any = this.refs.layout
            height = window.innerHeight - layout.offsetTop;
        }
        const { data } = this.props;
        console.log(data);
        return <div>
            {this.renderTitle()}
            <div style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)} ref='layout' >
                <ScrollArea style={{height:height}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                    {data.component && data.component.elements.chilren.map(elem=> this.renderElement(elem))}
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
    }
}

export default connectRouter(
  (state) => ({
      data: {
          elements: state.elements
      }
  }),
  (dispatch) => ({
      ElementsActions: bindActionCreators(elementsActions, dispatch)
  }),
  ElementsView
)