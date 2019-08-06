<!-- TUTORIAL -->
# ServiceDesigner Tutorial
## Contents
* [File](#file)  
* [Component](#component)  
* [Element](#element)  
* [Property](#property)  
* [Feature](#feature)
    * [State](#state)
    * [Color](#color)
    * [Asset](#asset)
    * [Css](#css)
    * [Style](#style)

## File  
> Open saved 'design.save.json' file to update your project at ServiceDesigner.  

### Save File
> If you haven't used **_ServiceDesigner_** before, you need to save file.
> Whenever you're ready, click the '_file_' menu and '_save_' menu.
> Ths short cut key is _ctrl_ + _s_.
> Then create '_design_' directory at '_src_', just in case separate design code file from other code files.
![ServiceDesigner](./src/asset/img/saveFile.gif)  

### OpenFile
> If you have used **_ServiceDesigner_** and saved file before, just open your file.

<!-- ![ServiceDesigner](./src/asset/img/saveFile.gif)   -->

## Component  
## Element  
## Property  
> The property supports following special scheme.
## Feature

### State  
> The scheme is json.  

### Color
> Support Color variables. The variables should be defined color tab.  
```
Color.XXX
```
```
{ "backgroundColor": "Color.red" }
```

### Asset
> Support Asset variables. The variables should be defined asset tab.
```
Asset.XXX
```
### Css

### Style


<!-- - File : Open saved 'design.save.json' file to update your project at ServiceDesigner.
- State : The scheme is json.
- Style : The Style supports following special shceme.

  Color.XXX : Support Color variables. The variables should be defined color tab.
  Asset.XXX : Support Asset variables. The variables should be defined asset tab.
  ex ) { "backgroundColor": "Color.red" }

- Property : the property supports following special shceme.

  First checkbox is if the attribute is active.
  Second checkbox is if the attribute is binded with state variable.
  Asset.XXX : Asset tab scheme. -->