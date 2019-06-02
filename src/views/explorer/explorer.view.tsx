import React from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io'
import { View } from '../view';
import { ExplorerComponentsView } from './components.view';
import { ExplorerElementsView } from './elements.view';

export class ExplorerView extends View {
    
    state:any = {
        components: {
            collapse: true
        },
        elements: {
            collapse: true
        }
    }

    collapse(target:string) {
        this.state[target].collapse = !this.state[target].collapse;
        this.setState({});
    }

    render() {
        return <div style={styles.layout}>
            <div style={styles.title}>EXPLORER</div>
            <div style={styles.group} onClick={()=>this.collapse('components')}>
                {!this.state.components.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
                {this.state.components.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
                COMPONENTS
            </div>
            <ExplorerComponentsView style={this.state.components.collapse && styles.groupHide} />
            <div style={styles.group} onClick={()=>this.collapse('elements')}>
                {!this.state.elements.collapse && <IoMdArrowDropright style={styles.arrow} /> } 
                {this.state.elements.collapse && <IoMdArrowDropdown style={styles.arrow} /> } 
                ELEMENTS
            </div>
            <ExplorerElementsView style={this.state.elements.collapse && styles.groupHide} />
        </div>
    }
}

const styles:any = {
    layout: {
        backgroundColor:'#252525',
        height:'100%'
    },
    title:{
        color:'rgb(205,205,205)',
        fontSize:10,
        padding:10,
        fontWeight:300
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
    arrow: {
        marginTop: -3,
        fontSize: 15
    }
}