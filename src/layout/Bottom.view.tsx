import React from 'react';
import { connectRouter } from '../redux/connection';
import { Theme } from '../utils/Theme';
import { IoIosArrowDown } from 'react-icons/io';
import { DiReact } from 'react-icons/di';
import Resizable from 're-resizable';
import AceEditor from 'react-ace';
import ScrollArea from 'react-scrollbar';
import 'brace/theme/tomorrow_night';
import 'brace/mode/json';


class BottomView extends React.Component<any> {

    state = {
        active: undefined,
        height:100,
        value: ''
    }

    renderActive() {
        return <div style={{height:'calc(100% - 28px)', overflow:'auto'}} ref={'layout'}>
            <ScrollArea style={{height:this.refs.layout? this.refs.layout['clientHeight'] : this.state.height-28}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                <AceEditor
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
                                data.elements.component.state = JSON.parse(this.state.value)
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
            </ScrollArea>
        </div>
    }

    render() {
        return <div style={styles.layout}>
            <Resizable
                defaultSize={{height:this.state.active === undefined ? 28 : this.state.height}}
                enable={{top:this.state.active !== undefined, bottom:false, right:false, left:false}}
                minHeight={this.state.active === undefined ? 0 : 100}
                maxHeight={this.state.active === undefined ? 28 : window.innerHeight - 100}
                onResize={(e:any)=>this.setState({height: window.innerHeight-e.clientY})}>
                {['Style'].map(tab=> 
                    <div key={tab} 
                    style={Object.assign({}, styles.tab, this.state.active === tab && styles.tabActive)}
                    onClick={()=>this.setState({active:tab})}>
                        <DiReact style={styles.tabIcon}/>
                        {tab}
                    </div>
                )}
                {this.state.active !== undefined && <IoIosArrowDown style={styles.icon} onClick={()=>this.setState({active:undefined})}/>}
                {this.state.active && this.renderActive()}
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
        cursor:'pointer'
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
            elements: state.elements
        }
    }),
    (dispatch)=>({}),
    BottomView
)