import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { DiReact } from 'react-icons/di';
import { IoMdClose } from 'react-icons/io';
import { bindActionCreators } from 'redux';
import * as elementActions from '../element/Element.action';
import * as layoutActions from '../layout/Layout.actions';
import { FrameType } from '../utils/constant';
import CodeSandbox from 'react-code-sandbox';
import { RenderService } from './Render.service';

class BoardView extends React.Component<any> {

    state = {
        hover:undefined
    }

    componentDidUpdate() {
        const {data, LayoutActions} = this.props;
        if (this.refs.frame) {
            try {
                const renderService = new RenderService(data.element.component, {
                    css: data.resource.css,
                    color: data.resource.color,
                    asset: data.resource.asset
                })
                const frame:any = this.refs.frame;
                const body = ReactDOMServer.renderToString(<CodeSandbox imports={renderService.imp}>
                    {renderService.getBody()}
                </CodeSandbox>)
                frame.contentWindow.document.open();
                frame.contentWindow.document.write(renderService.head  + body);
                frame.contentWindow.document.close();
                if (data.layout.message.text !== 'Rendering Successfully') {
                    LayoutActions.message({
                        background: Theme.success,
                        color: Theme.successFont,
                        text: 'Rendering Successfully'
                    })
                }
            } catch(e) {
                // console.error(e);
                if (data.layout.message.text !== 'Rendering Failed') {
                    LayoutActions.message({
                        background: Theme.danger,
                        color: Theme.dangerFont,
                        text: 'Rendering Failed'
                    })
                }
            }
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
            {data.layout.frameType === FrameType.Portrait && 
                <img alt='' style={styles.phonePortrait} src="/portrait.png" />}
            {data.layout.frameType === FrameType.Landscape && 
                <img alt='' style={styles.phoneLandscape} src="/landscape.png"/>}
            <div style={Object.assign({}, 
                data.layout.frameType === FrameType.Browser && styles.frame,
                data.layout.frameType === FrameType.Portrait && styles.frameProtrait,
                data.layout.frameType === FrameType.Landscape && styles.frameLandscape)}>
                    <iframe title="iframe" style={{width:'100%', height:'100%', position:'absolute', borderWidth:0}} ref="frame" />
            </div>
        </div>
    }
}

const styles:any = {
    layout: {
        flex:1,
        background: Theme.bgBoardColor,
        position:'relative',
        display:'flex'
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
    frameProtrait: {
        position:'absolute',
        top: 'calc(25px + 11.5%)',
        left: 'calc(13px + 50% - 21.5vh)',
        width: 'calc(-23px + 42.5vh)',
        height: 'calc(-47px + 76%)',
        borderWidth:0,
    },
    frameLandscape: {
        position:'absolute',
        left:'12.5%',
        width:'75.5%',
        marginTop: '-21%',
        top: 'calc(-2px + 50%)',
        paddingBottom:'42.5%',
        height:0
    },
    phonePortrait: {
        marginTop:29, 
        height:'calc(100% - 60px)',
        objectFit: 'contain',
        margin:'auto'
    },
    phoneLandscape: {
        width:'100%',
        objectFit: 'contain',
        margin:'auto'
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
            element: state.element,
            layout: state.layout,
            resource: state.resource
        }
    }),
    (dispatch)=>({
        ElementActions: bindActionCreators(elementActions, dispatch),
        LayoutActions: bindActionCreators(layoutActions, dispatch)
    }),
    BoardView
)