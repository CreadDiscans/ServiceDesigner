import React from 'react';
import { View } from '../view';
import { File, FileType } from '../../models/file';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DiReact } from 'react-icons/di';

export class ExplorerComponentsView extends View {

    state =  {
        hover:0,
        active:0
    }

    clickItem(item:File) {
        if (item.type === FileType.FOLDER) {
            item.collapse = !item.collapse;
        }
        this.setState({active:item.id});
    }

    removeJsInName(name:string) {
        if (name.indexOf('.js') === name.length -3) {
            return name.substr(0, name.length -3)
        } else {
            return name
        }
    }

    recursive(item:File, dep:number) {
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
                    !item.collapse && <IoMdArrowDropright style={styles.arrow} />,
                    item.collapse && <IoMdArrowDropdown style={styles.arrow} />
                ] : <DiReact style={{...styles.arrow,...{color:'#61dafb'}}} />}
                {this.removeJsInName(item.name)}
            </div>
            { item.collapse && item.children.sort(File.compare).map((child:File)=> this.recursive(child, dep+1))}
        </div>
    }

    render() {
        const root = this.mainCtrl.getFolderData();
        const styleProp = this.props.style ? this.props.style : {}
        return <div style={{...styles.layout, ...styleProp}}>
            {root.children.sort(File.compare).map((file:File)=> this.recursive(file, 0))}
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