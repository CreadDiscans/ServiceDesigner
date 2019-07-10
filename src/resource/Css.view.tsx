import React from 'react';
import { Theme } from '../utils/Theme';
import AceEditor from 'react-ace';
import { CSSType } from '../utils/constant';
import { Props, connection } from '../redux/Reducers';

declare var window:Window & {FileReader: typeof FileReader};

class CssView extends React.Component<Props> {

    state = {
        hover:undefined,
        url:'',
        name: '',
        style:'',
        type: undefined,
    }

    fileSelect = (e:any) => {
        const FileReader = new window.FileReader();
        const name = e.target.files[0].name; 
        FileReader.onload = (e:any) => {
            const { ResourceAction } = this.props;
            ResourceAction.createCss(
                name,
                e.target.result,
                CSSType.Style
            )
        }
        FileReader.readAsText(e.target.files[0]);
    }

    render() {
        const { data, ResourceAction } = this.props;
        return <div>
            <div id="css-item-wrap" style={styles.colors}>
                {data.resource.css.map(css=> <div className="css-item" key={css.name}
                    style={Object.assign({}, styles.cssItem, 
                        this.state.hover === 'item-'+css.name && {backgroundColor:Theme.bgBodyHoverColor}, 
                        this.state.type !== undefined && this.state.name === css.name && {backgroundColor: Theme.bgHeadActiveColor, color:Theme.fontActiveColor})}
                    onMouseEnter={()=> this.setState({hover: 'item-'+css.name})}
                    onMouseLeave={()=> this.setState({hover: undefined})}
                    onClick={()=> {
                        if (css.type === CSSType.Style) {
                            this.setState({name: css.name, type: css.type, style: css.value});
                        } else if (css.type === CSSType.Url) {
                            this.setState({name: css.name, type: css.type, url: css.value});
                        }
                    }}>
                    <input style={{marginRight:5}} type="checkbox" checked={css.active} onChange={()=> ResourceAction.updateCss(css.name, undefined , !css.active)}/>
                    {css.name}
                    <span style={{float:'right'}}>{css.type}</span>
                </div>)}
            </div>
            <div style={styles.pallete}>
                <div>
                    {(this.state.type === undefined || this.state.type === CSSType.Url) && 
                    <input id="css-input-url" style={styles.itemInput} value={this.state.url} onChange={(e)=>this.setState({url: e.target.value})} placeholder="Url"/>}
                </div>
                <div>
                    {this.state.type === undefined ? [
                        <button id="css-button-add-url" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'url' && styles.btnHover)} key={0}
                            onMouseEnter={()=>this.setState({hover:'url'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> {
                                if (this.state.url !== '') {
                                    const block = this.state.url.split('/')
                                    ResourceAction.createCss(
                                        block[block.length-1],
                                        this.state.url,
                                        CSSType.Url
                                    )
                                    this.setState({
                                        url:'',
                                        name:'',
                                        style:'',
                                        select: undefined
                                    })
                                }
                            }}>Add URL</button>,
                        <button id="css-button-add-file" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'file' && styles.btnHover)} key={1}
                            onMouseEnter={()=>this.setState({hover:'file'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> {
                                const input:any = this.refs.file;
                                input.click()
                            }}>Add File</button>,
                        <button id="css-button-add-style" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'style' && styles.btnHover)} key={2}
                            onMouseEnter={()=>this.setState({hover:'style'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> {
                                if (this.state.name !== '') {
                                    ResourceAction.createCss(
                                        this.state.name,
                                        this.state.style,
                                        CSSType.Style
                                    )
                                    this.setState({
                                        url:'',
                                        name:'',
                                        style:'',
                                        type: undefined
                                    })
                                }
                            }}>Add Style</button>,
                    ] : [
                        <button id="css-button-update" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'update' && styles.btnHover)} key={0}
                            onMouseEnter={()=>this.setState({hover:'update'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> {
                                let value;
                                if (this.state.type === CSSType.Style) {
                                    value = this.state.style;
                                } else if (this.state.type === CSSType.Url) {
                                    value = this.state.url;
                                }

                                ResourceAction.updateCss(
                                    this.state.name, 
                                    value,
                                    true
                                )
                            }}>Update</button>,
                        <button id="css-button-delete" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'delete' && styles.btnHover)} key={1}
                            onMouseEnter={()=>this.setState({hover:'delete'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> {
                                ResourceAction.deleteCss(this.state.name);
                                this.setState({
                                    url:'',
                                    name:'',
                                    style:'',
                                    type: undefined})
                            }}>Delete</button>,
                        <button id="css-button-cancel" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'cancel' && styles.btnHover)} key={2}
                            onMouseEnter={()=>this.setState({hover:'cancel'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> this.setState({
                                name:'',
                                url:'',
                                style:'',
                                type: undefined
                            })}>Cancel</button>,
                    ]}
                    <input id="css-input-file" onChange={this.fileSelect} type="file" ref={'file'} hidden/>
                </div>
                <div id="css-editor">
                    {(this.state.type === CSSType.Style || this.state.type === undefined) && 
                    [this.state.type === undefined && <input id="css-input-name" style={styles.itemInput} value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} placeholder="Name" key={0}/>,
                    <AceEditor
                        key={1}
                        style={{width:'100%', height: 300}}
                        theme="tomorrow_night" 
                        mode={'css'}
                        value={this.state.style}
                        onChange={(value)=> this.setState({style: value})}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        editorProps={{$blockScrolling: Infinity }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2
                        }}
                    />]}
                </div>
            </div>
        </div>
    }
}

const styles = {
    layout: {
        padding:10,
        height:'100%'
    },
    colors: {
        display:'inline-block',
        width:'50%',
        padding:5,
        verticalAlign:'top'
    },
    pallete: {
        display:'inline-block',
        width:'50%',
        padding:5
    }, 
    btn: {
        color:Theme.fontColor,
        backgroundColor: Theme.bgHeadColor,
        cursor:'pointer',
        borderWidth:0,
        padding:'5px 8px',
        fontSize:14,
        borderRadius: 6,
        margin:5
    },
    btnHover: {
        backgroundColor:Theme.bgBodyHoverColor
    },
    itemInput: {
        fontSize:12,
        color:Theme.fontColor,
        backgroundColor:Theme.bgBodyActiveColor,
        borderWidth:0,
        outline:'none',
        width:'100%'
    },
    cssItem: {
        fontSize:12,
        color:Theme.fontColor,
        padding:5,
        width:'100%',
        cursor:'pointer'
    }
}

export default connection(CssView);