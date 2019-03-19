import React from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'

export default class ReactJSONEditor extends React.Component {

  componentWillReceiveProps(nextProps) {
    let editorValues
    try{
      editorValues = this.editor.get()
    } catch(e) {}
    if (
      JSON.stringify(nextProps.values) !== JSON.stringify(this.props.values) && 
      JSON.stringify(editorValues) !== JSON.stringify(nextProps.values)) {
      try {
        this.editor.set(nextProps.values)
      } catch(e) {}
    }
  }

  componentDidMount() {
    this.options = {
      onChange: () => {
        if (this.props.onChange) {
          try{
            let newValues = this.editor.get()
            this.props.onChange(newValues)
          } catch(e) {}
        }
      },
      mode:'code',
      statusBar: false,
      mainMenuBar: false
    }
    this.editor = new JSONEditor(this.container, this.options)
    this.editor.set(this.props.values)
  }
  
  render() {
    return (
      <div className="react-json-editor-wrapper" ref={(el) => {this.container = el}} />
    )
  }
}