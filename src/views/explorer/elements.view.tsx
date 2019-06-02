import React from 'react';
import { View } from '../view';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DiReact, DiHtml5, DiBootstrap } from 'react-icons/di';
import { Element } from '../../models/element';
import ScrollArea from 'react-scrollbar';

export class ExplorerElementsView extends View {

    state:any =  {
        hover:'',
        collapse: []
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

    elemItem(elem:Element, group:string) {
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
        const elements:any = this.mainCtrl.getElements();
        const styleProp = this.props.style ? this.props.style : {}
        let height = 0;
        if (this.refs.layout) {
            const layout:any = this.refs.layout
            height = window.innerHeight - layout.offsetTop;
        }
        return <div style={{...styles.layout, ...styleProp}} ref='layout' >
            <ScrollArea style={{height:height}}
                verticalScrollbarStyle={{backgroundColor:'white'}}>
                {Object.keys(elements).map((group:string)=> this.elemGroup(group, elements[group]))}
            </ScrollArea>
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
    }
}