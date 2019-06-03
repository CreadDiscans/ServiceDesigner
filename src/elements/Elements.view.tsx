import React from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DiReact, DiHtml5, DiBootstrap } from 'react-icons/di';
import ScrollArea from 'react-scrollbar';
import { connectRouter } from '../redux/connection';

class ElementsView extends React.Component {

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

    render() {
        let height = 0;
        if (this.refs.layout) {
            const layout:any = this.refs.layout
            height = window.innerHeight - layout.offsetTop;
        }
        return <div>
          <div style={styles.group}>
            <span onClick={()=>this.setState({collapse: !this.state.collapse})}>
              {!this.state.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
              {this.state.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
              ELEMENTS
            </span>
          </div>
          <div style={Object.assign({}, styles.layout, this.state.collapse && styles.groupHide)} ref='layout' >
              <ScrollArea style={{height:height}}
                  verticalScrollbarStyle={{backgroundColor:'white'}}>
                  {/* {Object.keys(elements).map((group:string)=> this.elemGroup(group, elements[group]))} */}
              </ScrollArea>
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
    }
}

export default connectRouter(
  (state) => ({}),
  (dispatch) => ({}),
  ElementsView
)