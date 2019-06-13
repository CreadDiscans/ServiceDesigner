import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { DiReact } from 'react-icons/di';
import { IoMdClose } from 'react-icons/io';
import { bindActionCreators } from 'redux';
import * as elementActions from '../element/Element.action';

class BoardView extends React.Component<any> {

    state = {
        hover:undefined
    }

    componentDidUpdate() {
        const {data} = this.props;
        console.log(data);
        if (this.refs.frame) {
            const frame:any = this.refs.frame;
            console.log(frame.contentDocument);
            // frame.contentDocument.write('<h1>hello</hi>')
        }
    }

    render() {
        const {data, ElementActions} = this.props;
        return <div style={styles.layout}>
            <div id="board-tab-wrap" style={styles.tabWrap}>
                {data.element.history.map(component=> <div className="board-tab"
                    style={Object.assign({},styles.tab, data.element.component.id === component.id && styles.tabActive) } key={component.id}
                    onMouseEnter={()=>this.setState({hover: component.id})}
                    onMouseLeave={()=>this.setState({hover:undefined})}
                    onClick={()=>ElementActions.choiceComponent(component)}>
                    <DiReact style={styles.tabIcon} />
                    {component.name}
                    <IoMdClose className="board-tab-close" style={Object.assign({}, styles.tabCloseIcon, this.state.hover === component.id && {visibility: 'visible'})} 
                        onClick={(e)=> {
                            e.stopPropagation();
                            ElementActions.deleteHistory(component.id)
                        }}/>
                </div>)}
            </div>
            <iframe title="iframe" style={styles.frame} ref='frame'></iframe>
        </div>
    }
}

const styles:any = {
    layout: {
        flex:1,
        background: Theme.bgBoardColor,
        position:'relative'
    },
    tabWrap: {
        width:'max-content',
        minWidth: '100%',
        height:29,
        background: Theme.bgBodyColor,
        position:'absolute',
        right:0
    },
    frame: {
        width:'100%',
        borderWidth:0,
        background:'white',
        height:'calc(100% - 58px)',
        marginTop:29
    },
    tab: {
        padding: '5px 10px',
        minWidth: 100,
        backgroundColor:Theme.bgHeadColor,
        color:Theme.fontColor,
        fontSize:12,
        display:'inline-block',
        cursor:'pointer',
        userSelect: 'none'
    },
    tabActive: {
        backgroundColor:Theme.bgHeadActiveColor,
        color:Theme.fontActiveColor
    },
    tabIcon: {
        color: Theme.iconReactColor,
        fontSize: 14,
        marginTop: -3,
        marginRight: 5
    },
    tabCloseIcon: {
        float: 'right',
        fontSize: 14,
        marginTop:4,
        color: 'white',
        visibility: 'hidden'
    }
}

export default connectRouter(
    (state)=>({
        data: {
            element: state.element
        }
    }),
    (dispatch)=>({
        ElementActions: bindActionCreators(elementActions, dispatch)
    }),
    BoardView
)