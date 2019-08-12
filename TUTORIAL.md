<!-- TUTORIAL -->
# ServiceDesigner Tutorial
## Contents
* [Menu](#menu)
    * [File](#file)  
        * [Save File](#save-file)
        * [Open File](#open-file)
        * [Other Fuctions of File Menu](#other-functions-of-file-menu)
* [Explorer](#explorer)
    * [Components](#components)  
        * [Create](#create)
        * [Rename](#rename)
        * [Delete](#delete)
        * [Other Fuctions of Components Tab](#other-functions-of-components-tab)
    * [Element](#element)  
        * [HTML](#html)  
        * [Reactstrap](#reactstrap)  
        * [React Icons](#react-icons)  
        * [React Native](#react-native)  
        * [RN Elements](#rn-elements)  
* [Editor](#editor)
    * [Properties](#properties)  
    * [Property Detail](#property-detail)
* [Fuction](#function)
    * [State](#state)
    * [Color](#color)
    * [Asset](#asset)
    * [Css](#css)
    * [Style](#style)  
* [Extend](#extend)



## 1. Menu
## File  
**File** menu is for to save or open design file at **_ServiceDesigner_**, so user can update or test their UI.  
> You can check there are **three** type files : _design.component.tsx_, _design.save.json_, _design.style_.  
> * _design.component.tsx_ be used when extend it at the each _web_ or _app_ component and implement it.  
> * _design.save.json_ be used when opening file in **_ServiceDesigner_**. You can update and save design file through this json file.  
> * _design.style_ be used when set style or css of each component.  

### Save File  
![SavingFile](./asset/img/savingFile.gif)  

> * Click the _file_ menu and _save_. (The short cut key is _ctrl_ + _s_)  
> * Then create _design_ directory at _src_, just in case separate design code file from other code files.  
> * If you already created _design_ directory before, just save it.

### Open File  
![OpeningFile](./asset/img/openingFile.gif)  

> * Click the _file_ menu and _open_.  (The short cut key is _ctrl_ + _o_)
> * Select the _design.save.json_ file and open it.

### Other Fuctions of File Menu 
#### 1. _Save to another folder_  
> You can move newly updated design files to another folder and save them through this function. (The short cut key is _ctrl_ + _shift_ + _s_)
#### 2. _reload_
> Reload **_ServiceDesigner_**.
  


## 2. Explorer
## Components  
**Components** tab is for managing _group_ or _component_. 

### Create  
![CreatingComponents](./asset/img/creatingComponents.gif)  

> * Right-click at the **Components** tab and click _New Group_ or _New Component_.  
> * If you don't input new _group_ or _component_'s name, they will not be created.  
> * So please remember to _input the group or component's name_.  
> * Also, you can use short cut buttons to create group or component.

### Rename  
![RenamingComponents](./asset/img/renamingComponents.gif)  

> * Just like _create_, right-click and click _rename_ what you want to do it.
> * If you don't input _group_ or _component_'s name newly, it's name will not be changed.  

### Delete  
![DeletingComponents](./asset/img/deletingComponents.gif)  

> * Right-click and click _delete_ whatever you want, like other functions. 
> * Just in case, let's imagine the situation that you deleteed some group or component.
> * _However_ it was accident, not you really wanted.
> * Don't be panic already! Please open your file again, before you save it.
> * Then you can check there will be a group or component which you deleted before reopening it.

### Other Functions of Components Tab  
#### 1. _ShortCuts_  
![ComponentsMenu](./asset/img/componentsMenu.JPG)  

> When you hover on the **Components** tab, there will be some buttons on the right side of the tab.  
> There are **three** main functions in these short cuts : _create group_, _create component_, _collapse groups_.  
> * _create group_ & _create component_ are same functions from [Create](#create).  
> * _collapse groups_ literally collapses all groups in the **Components** tab.  

#### 2. _Unselect_  
> If there is a selected group or component, that one will be highlighted because it was activated.  
> So if you click _Unselect_, nothing will be selected in **Components** tab.  



## Element  
**Element** tab is for working with UI to render using _React_ or _React Native_ framework and several libraries.  

### HTML  
![HTML](./asset/img/html.gif)  

> * Using html tag just like in your coding editor.  
> * Right-click and clcik _Add Html_, and put the name of what you want to add in your component.  
> * Please remember it, if you don't intput the name, it will be not added. Just like at the Components tab.  

### Reactstrap  
![ReactStrap](./asset/img/reactStrap.gif)  

> **ReactStrap** is really helpfull when you use React and set UI design simply by using bootstrap library.  
> You can use Bootstrap 4 components like React components in this tab.  
> * You can use ReactStrap Library in **_ServiceDesigner_**.  
> * You don't have to import each components whenever you use it anymore!  
> * Just input the name of one of ReactStrap's components, and set property if you want.  

- [Reactstrap](https://reactstrap.github.io/) : React Bootstrap 4 components  

### React Icons  
![React Icons](./asset/img/reactIcons.gif)  

> **React Icons** provides free open srouce icons for React framework.  
> There are **eight** type of icon libraries that you can use through React Icons.  
> _Font Awesome_, _Ionicons_, _Material Design icons_, _Typicons_, _Github Octicons_, _Feather_, _Game Icons_, _Weather Icons_.  
> * Set element's name as the name of library's icon what you want to use.
> * Then set size, color and other properties as you want to at the Property tab if you want.

- [React Icons](http://react-icons.github.io/react-icons/)  

### React Native  
![React Native](./asset/img/reactNative.gif)  

> * Before you use React Native element, set the screen as mobile by clicking one of the buttons from the bottom.  
> * You can set the screen _to Portrait_ or _to Landscape_ easily from these buttons.  
> * Just click the button what you want to set.  
> * Then right-click and add element and input the name what you will use. It's really simple.  
> * You must input the name in this function also.

### RN Elements  
![RN Elements](./asset/img/reactNativeElements.gif)  

> * If you want to implement and check any detail of project's UI, set the screen as mobile.  
> * After that, right-click and add element just like adding other element.  
> * Set the property if it is necessary.

- [React Native Elements](https://react-native-training.github.io/react-native-elements/) : React Native UI Toolkit  

### Delete  

> * You can delete elements in this tab. If you input wrong name, just right-click, delete it and add new one!  
> * If you deleted some element, and saved your file already, you can't work with that element anymore.  
> * So please be careful when you delete element or component. 

## 3. Editor  

## Properties
![Properties](./asset/img/properties.gif)  

> There is an editor on the right side of **_ServiceDesigner_** to handle property.  
> When you add an element at your component, **two** derfault properties also created automatically : _name_, _style_.  
> * _name_ is for setting name of element.  
>> You can check the name of element in **Elements** tab as you set.  
>> You will use _name_ to call the element when you extended design component to your project's component.  
> * _style_ is for setting style of element.  
>> You can set style of each element in this tab. Just fill out as object format.  
>> And also, you can set style per _if condition's result value_ : _true_ or _false_ in here.  

## Property Detail
> There are 


## 4. Fuction

### State  
> The scheme is json.  

### Color
> Support Color variables. The variables should be defined color tab.  
```
Color.XXX
```
```css
{  
    "backgroundColor": "Color.red"  
}
```

### Asset
> Support Asset variables. The variables should be defined asset tab.
```
Asset.XXX
```
### Css

### Style


## Extend

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