import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { DiReact } from 'react-icons/di';
import { IoMdClose } from 'react-icons/io';
import { FaCircle } from 'react-icons/fa';
import { bindActionCreators } from 'redux';
import * as elementActions from '../element/Element.action';
import * as layoutActions from '../layout/Layout.actions';
import { FrameType } from '../utils/constant';
import { RenderService } from './Render.service';
import imgJson from '../asset/image.json';
import { AppRegistry } from 'react-native-web';
import { FrameView } from './Frame.view';
import AntDesign from '../lib/react-native-vector-icons/Fonts/AntDesign.ttf';
import Entypo from '../lib/react-native-vector-icons/Fonts/Entypo.ttf';
import EvilIcons from '../lib/react-native-vector-icons/Fonts/EvilIcons.ttf';
import Feather from '../lib/react-native-vector-icons/Fonts/Feather.ttf';
import FontAwesome from '../lib/react-native-vector-icons/Fonts/FontAwesome.ttf';
import FontAwesome5_Brands from '../lib/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf';
import FontAwesome5_Regular from '../lib/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
import FontAwesome5_Solid from '../lib/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';
import Fontisto from '../lib/react-native-vector-icons/Fonts/Fontisto.ttf';
import Foundation from '../lib/react-native-vector-icons/Fonts/Foundation.ttf';
import Ionicons from '../lib/react-native-vector-icons/Fonts/Ionicons.ttf';
import MaterialCommunityIcons from '../lib/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import MaterialIcons from '../lib/react-native-vector-icons/Fonts/MaterialIcons.ttf';
import Octicons from '../lib/react-native-vector-icons/Fonts/Octicons.ttf';
import SimpleLineIcons from '../lib/react-native-vector-icons/Fonts/SimpleLineIcons.ttf';
import Zocial from '../lib/react-native-vector-icons/Fonts/Zocial.ttf';

class BoardView extends React.Component<any> {

    state = {
        hover:undefined
    }

    fontTable = [
        {name: 'AntDesign', font: AntDesign},
        {name: 'Entypo', font: Entypo},
        {name: 'EvilIcons', font: EvilIcons},
        {name: 'Feather', font: Feather},
        {name: 'FontAwesome', font: FontAwesome},
        {name: 'FontAwesome5_Brands', font: FontAwesome5_Brands},
        {name: 'FontAwesome5_Regular', font: FontAwesome5_Regular},
        {name: 'FontAwesome5_Solid', font: FontAwesome5_Solid},
        {name: 'Fontisto', font: Fontisto},
        {name: 'Foundation', font: Foundation},
        {name: 'Ionicons', font: Ionicons},
        {name: 'MaterialCommunityIcons', font: MaterialCommunityIcons},
        {name: 'MaterialIcons', font: MaterialIcons},
        {name: 'Octicons', font: Octicons},
        {name: 'SimpleLineIcons', font: SimpleLineIcons},
        {name: 'Zocial', font: Zocial},
    ]

    getFontStyles() {
        return this.fontTable.map(item=> {
            const iconFontStyles = `@font-face {
                src: url(${item.font});
                font-family: ${item.name};
            }`;

            const style:any = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
              style.styleSheet.cssText = iconFontStyles;
            } else {
              style.appendChild(document.createTextNode(iconFontStyles));
            }
            return style
        })
    }

    componentDidUpdate() {
        const {data, LayoutActions} = this.props;
        if (this.refs.frame && data.element.component.id !== -1) {
            const frame:any = this.refs.frame;
            let document;
            try {
                const renderService:RenderService = RenderService.getInstance(RenderService)
                renderService.renderOne(data.element.component, {
                    css: data.resource.css,
                    color: data.resource.color,
                    asset: data.resource.asset,
                    style: data.resource.style,
                    hover: data.element.hover,
                    select: data.element.select
                })
                AppRegistry.registerComponent('App', ()=> FrameView)
                const { element, getStyleElement } = AppRegistry.getApplication('App', {});
                const html = ReactDOMServer.renderToString(element)
                const css = ReactDOMServer.renderToStaticMarkup(getStyleElement({}));
                document = `
                <!DOCTYPE html>
                <html>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${renderService.head}
                ${css}
                <body style="height:100%;>
                <div id="root" style="display:flex; height: 100%">
                ${html}
                <script>
                    var forms = document.getElementsByTagName("form");
                    for(var i=0; i<forms.length; i++) {
                        forms[i].onsubmit = function() {
                            return false;
                        }
                    } 
                </script>
                </div>
                `

                
                if (data.layout.rendering === false) {
                    LayoutActions.rendering(true);
                }
            } catch(e) {
                document = e.toString()
                console.error(e);
                if (data.layout.rendering === true) {
                    LayoutActions.rendering(false);
                }
            }
            frame.contentWindow.document.open();
            frame.contentWindow.document.write(document);
            this.getFontStyles().forEach(style=> 
                frame.contentWindow.document.head.appendChild(style))
            frame.contentWindow.document.close();
        } else {
            if (this.refs.frame && data.element.component.id === -1) {
                const frame:any = this.refs.frame;
                frame.contentWindow.document.open();
                frame.contentWindow.document.write('');
                frame.contentWindow.document.close();
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
                    {
                        this.state.hover !== component.id && data.element.component.id === component.id ? 
                        <FaCircle style={Object.assign({}, styles.tabCloseIcon, 
                            {visibility: 'visible', fontSize: 10, marginTop:5},
                            data.layout.rendering ? {color: Theme.successFont} : {color:Theme.dangerFont})} />
                        :<IoMdClose className="board-tab-close" style={Object.assign({}, styles.tabCloseIcon, this.state.hover === component.id && {visibility: 'visible'})} 
                        onClick={(e)=> {
                            e.stopPropagation();
                            ElementActions.deleteHistory(component.id)
                        }}/>
                    }
                </div>)}
            </div>
            {data.layout.frameType === FrameType.Portrait && 
                <img alt='' style={styles.phonePortrait} src={imgJson.portrait} />}
            {data.layout.frameType === FrameType.Landscape && 
                <img alt='' style={styles.phoneLandscape} src={imgJson.landscape} />}
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
        position:'absolute',
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