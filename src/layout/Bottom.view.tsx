import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { IoIosArrowDown, IoMdColorPalette, IoMdPhotos, IoIosPhonePortrait, IoIosPhoneLandscape, IoMdBrowsers } from 'react-icons/io';
import { DiReact, DiCss3 } from 'react-icons/di';
import Resizable from 're-resizable';
import AceEditor from 'react-ace';
import ScrollArea from 'react-scrollbar';
import 'brace/theme/tomorrow_night';
import 'brace/mode/json';
import ColorView from '../resource/Color.view';
import AssetView from '../resource/Asset.view';
import CssView from '../resource/Css.view';
import { bindActionCreators } from 'redux';
import * as layoutActions from '../layout/Layout.actions';
import { FrameType } from '../utils/constant';


class BottomView extends React.Component<any> {

    state = {
        active: undefined,
        height:100,
        value: ''
    }

    renderState() {
        return <AceEditor
            style={{width:'100%', height: window.innerHeight}}
            theme="tomorrow_night" 
            mode="json" 
            value={this.state.value}
            onChange={(value)=> {
                this.setState({value:value})
            }}
            onValidate={(value)=> {
                let error = false;
                value.forEach(item=> {
                    if (item.type === 'error') error = true;
                });
                if (!error) {
                    const { data } = this.props;
                    try{
                        data.element.component.state = JSON.parse(this.state.value)
                    } catch(e) {}
                }
            }}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            editorProps={{$blockScrolling: Infinity }}
            setOptions={{
                showLineNumbers: true,
                tabSize: 2
            }}
            />
    }

    render() {
        const { data, LayoutActions } = this.props;
        return <div style={styles.layout}>
            <Resizable
                defaultSize={{height:this.state.active === undefined ? 28 : this.state.height}}
                enable={{top:this.state.active !== undefined, bottom:false, right:false, left:false}}
                minHeight={this.state.active === undefined ? 0 : 100}
                maxHeight={this.state.active === undefined ? 28 : window.innerHeight - 100}
                onResize={(e:any)=>this.setState({height: window.innerHeight-e.clientY})}>
                {['State', 'Color', 'Asset', 'Css'].map(tab=> 
                    <div className="bottomTab" key={tab} 
                    style={Object.assign({}, styles.tab, this.state.active === tab && styles.tabActive)}
                    onClick={()=>{
                            if (this.state.active === tab) {
                                this.setState({active: undefined})
                            } else {
                                this.setState({active:tab})
                            }
                        }}>
                        {tab === 'State' && <DiReact style={styles.tabIcon}/>}
                        {tab === 'Color' && <IoMdColorPalette style={{...styles.tabIcon,...{color:'#C33'}}}/>}
                        {tab === 'Asset' && <IoMdPhotos style={{...styles.tabIcon,...{color:'#CCC'}}}/>}
                        {tab === 'Css' && <DiCss3 style={{...styles.tabIcon,...{color:'#006db2'}}}/>}
                        {tab}
                    </div>
                )}
                <IoIosArrowDown style={Object.assign({}, styles.icon, this.state.active === undefined && {visibility: 'hidden'})} onClick={()=>this.setState({active:undefined})}/>
                <IoIosPhoneLandscape style={Object.assign({}, styles.icon, data.layout.frameType === FrameType.Landscape && styles.iconActive)} 
                    onClick={()=> LayoutActions.setFrameType(FrameType.Landscape)}/>
                <IoIosPhonePortrait style={Object.assign({}, styles.icon, data.layout.frameType === FrameType.Portrait && styles.iconActive)} 
                    onClick={()=> LayoutActions.setFrameType(FrameType.Portrait)}/>
                <IoMdBrowsers style={Object.assign({}, styles.icon, data.layout.frameType === FrameType.Browser && styles.iconActive)}  
                    onClick={()=> LayoutActions.setFrameType(FrameType.Browser)}/>
                <div id="bottom-view" style={{height:'calc(100% - 28px)', overflow:'auto', backgroundColor:Theme.bgBodyDarkColor,}} ref={'layout'}>
                    <ScrollArea style={{height:this.refs.layout? this.refs.layout['clientHeight'] : this.state.height-28, minHeight:'100%'}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                        {this.state.active === 'State' && this.renderState()}
                        {this.state.active === 'Color' && <ColorView />}
                        {this.state.active === 'Asset' && <AssetView />}
                        {this.state.active === 'Css' && <CssView />}
                    </ScrollArea>
                </div>
            </Resizable>
        </div>
    }
}

const styles:any = {
    layout: {
        backgroundColor:Theme.bgBodyColor,
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: Theme.borderColor
    },
    tab: {
        padding: '5px 10px',
        minWidth: 80,
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
    icon: {
        color:Theme.fontColor,
        float:'right',
        padding:5,
        fontSize:28,
        cursor:'pointer'
    },
    iconActive: {
        backgroundColor: Theme.bgHeadActiveColor,
        color: Theme.fontActiveColor
    },
    tabIcon: {
        color: Theme.iconReactColor,
        fontSize: 14,
        marginTop: -3,
        marginRight: 5
    }
}

export default connectRouter(
    (state)=>({
        data: {
            element: state.element,
            layout: state.layout
        }
    }),
    (dispatch)=>({
        LayoutActions: bindActionCreators(layoutActions, dispatch)
    }),
    BottomView
)