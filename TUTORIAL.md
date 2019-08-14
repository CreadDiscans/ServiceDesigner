<!-- TUTORIAL -->
<!-- GIF file is just guid line, it will updated later with demo page -->

> The gif image file is temporary example, so maybe it looks messy.  
> It will be uploaded with demo page later.

# ServiceDesigner Tutorial
## Contents
* [Menu](#menu)
    * [File](#file)  
        * [Save File](#save-file)
        * [Open File](#open-file)
        * [Other Functions of File Menu](#other-functions-of-file-menu)
* [Explorer](#explorer)
    * [Components](#components)  
        * [New](#new)
        * [Rename](#rename)
        * [Delete](#delete)
        * [Other Functions of Components Tab](#other-functions-of-components-tab)
    * [Element](#element)  
        * [HTML](#html)  
        * [Reactstrap](#reactstrap)  
        * [React Icons](#react-icons)  
        * [React Native](#react-native)  
        * [RN Elements](#rn-elements)  
* [Editor](#editor)
    * [Properties](#properties)  
    * [Property Detail](#property-detail)
    * [Other Functions of Editor](#other-functions-of-editor)
* [Other Functions](#other-functions)
    * [State](#state)
    * [Color](#color)
    * [Asset](#asset)
    * [Css](#css)
    * [Style](#style)  
* [Inheritance](#inheritance)
    * [Render](#render)



# Menu
## File  
**File** menu is for to save or open design file at **_ServiceDesigner_**, so user can update or test their UI.  
> You can check there are **three** type files : _design.component.tsx_, _design.save.json_, _design.style_.  
> * _design.component.tsx_ be used when extend it at component of your project. Each of components have render() method which is inclucing return component array. 
> * _design.save.json_ be used when working with UI in **_ServiceDesigner_**. You can update and save design file through this json file.  
> * _design.style_ is for setting style of your elements in **_ServiceDesigner_** freely as way you want.  

### Save File  
> ![SavingFile](./asset/img/savingFile.gif)  
> 1. Click the _file_ menu and _Save file_. (The short cut key is _ctrl_ + _s_)  
> 1. Then create _design_ directory at _src_, just in case separate design code file from other code files.  
> 1. If you already created _design_ directory before, just save it.

### Open File  
> ![OpeningFile](./asset/img/openingFile.gif)  
> 1. Click the _file_ menu and _Open file_.  (The short cut key is _ctrl_ + _o_)
> 1. Select the _design.save.json_ file and open it.

### Other Functions of File Menu 
#### 1. _Save to another folder_  
> You can move newly updated design files to another folder and save them through this function.  
> (The short cut key is _ctrl_ + _shift_ + _s_)  

#### 2. _reload_
> Reload **_ServiceDesigner_**.
  


# Explorer
## Components  
**Components** tab is for managing _group_ or _component_. 

### New  
> ![CreatingComponents](./asset/img/creatingComponents.gif)  
> Right-click at the **Components** tab and click _New Group_ or _New Component_.  
>> If you don't input new _group_ or _component_'s name, they will not be created.  
>> So please remember to _input the group or component's name_.  
>> Also, you can use short cut buttons to create group or component.

### Rename  
> ![RenamingComponents](./asset/img/renamingComponents.gif)  
> Just like _create_, right-click and click _Rename_ at the file that you want change the name.  
>> If you don't input _group_ or _component_'s name newly, it's name will not be changed.  

### Delete  
> ![DeletingComponents](./asset/img/deletingComponents.gif)  
> Right-click and click _Delete_ like other functions.  
>> Just in case, let's imagine the situation that you deleted some group or component.  
>> _However_ it was just an accident, not you really wanted.  
>> Don't be panic already! Please open your file again, before you save it.  
>> Then you can check there will be a group or component which you deleted before reopening it.  

### Other Functions of Components Tab  
#### 1. _ShortCuts_  
> ![ComponentsMenu](./asset/img/componentsMenu.JPG)  
> When you hover on the **Components** tab, there will be some buttons on the right side of the tab.  
> There are **three** main functions in these short cuts : _create group_, _create component_, _collapse groups_.  
> * _create group_ & _create component_ are same functions from [New](#new).  
> * _collapse groups_ literally collapses all groups in the **Components** tab.  

#### 2. _Unselect_  
> If there is a selected group or component, that one will be highlighted because it was activated.  
> So if you don't need to activate it anymore, just click _Unselect_. Then nothing will be selected in **Components** tab.  



## Element  
**Element** tab is for working with UI to render using _React_ or _React Native_ framework and several libraries.  

### HTML  
> ![HTML](./asset/img/html.gif)  
> Right-click and clcik _Add Html_, and put the name of what you want to add in your component.  
>> Just use html tag just like in your coding editor.  
>> Please remember it, if you don't intput the name, it will be not added. Just like at the Components tab.  

### Reactstrap  
> ![ReactStrap](./asset/img/reactStrap.gif)  
> **ReactStrap** is really helpfull when you use React and set UI design simply by using bootstrap library.  
> You can use Bootstrap 4 components in this function.  
> You don't have to import each components whenever you use it anymore!  
> Just input the name of one of ReactStrap's components, and set property if you want.  

- [Reactstrap](https://reactstrap.github.io/) : React Bootstrap 4 components  

### React Icons  
> ![React Icons](./asset/img/reactIcons.gif)  
> **React Icons** provides free open srouce icons for React framework.  
> There are **eight** type of icon libraries that you can use through React Icons.  
> _Font Awesome_, _Ionicons_, _Material Design icons_, _Typicons_, _Github Octicons_, _Feather_, _Game Icons_, _Weather Icons_.  
> Set element's name as the name of library's icon's name what you want to use.  
> Then set size, color and other properties as you want at the Property tab if you want.

- [React Icons](http://react-icons.github.io/react-icons/)  

### React Native  
> ![React Native](./asset/img/reactNative.gif)  
> Before using **React Native** element, set the screen as mobile by clicking one of the buttons from the bottom.  
> You can set the screen _to Portrait_ or _to Landscape_ easily from these buttons.  
> Just click the button what you want to set.  
> Then right-click and add element and input the name of compomnent what you want to use. It's really simple.  
> You must input the name in this function also.

### RN Elements  
> ![RN Elements](./asset/img/reactNativeElements.gif)  
> 1. If you want to implement and check any detail of project's UI, set the screen as mobile.  
> 1. After that, right-click and add element just like adding other element.  
> 1. Set the property if it is necessary.

- [React Native Elements](https://react-native-training.github.io/react-native-elements/) : React Native UI Toolkit  

### Delete  
> You can delete elements in this tab. If you input wrong name, just right-click, delete it and add new one!  
>> If you deleted some element and saved your file already, you can't work with that element anymore.  
>> So please be careful when you delete element. 

# Editor  
**Editor** tab is for managing properties.

## Properties
> ![Properties](./asset/img/properties.gif)  
> When you add an element at your component, **two** derfault properties also created automatically : _name_, _style_.  
> * _name_  
>> You can check the name of element in **Elements** tab as you set.  
>> You will use _name_ to call the element when you extended design component to your project's component.  
> * _style_
>> You can set style of each element in this tab. Just fill out as object format.  
>> And also, you can set style per _if condition's result value_ : _true_ or _false_ in here.  

> ![PropertiesFunction](./asset/img/propertiesFunction.gif)  
> If you want to add or delete property, just right-click and select what you want to do.  
> ### 1. _Add Property_  
>> When you clicked _Add Property_, you have to fill out _Property Detail_, at least the _key_.  
>> After filling out key and the other values, please click the _save button_.  
>> If you don't click it, there won't be new property. So please remember to click this button.  
>> And be careful! If you added properties that element doesn't have, nothing will happen although added property.  
>> Just like, add text property and set the value in View element.  
> ### 2. _Delete Property_  
>> If you want to delete property, just click _Delete Property_.  

## Property Detail
> There are **three** details to set for the property : _Key_, _Type_, _Value_.  
> * _Key_ is for setting the keyName of property. For example, _name_, _stlye_ are all the keys for the properties. 
>> If you don't set _Key_'s value, there will be added blank property, and it won't work properly.  
>> So at least, you have to set _Key_'s value when adding property.  
> * _Type_ has **six** detailed types : _String_, _Number_, _Boolean_, _Function_, _Object_, _Variable_.
>>  ### 1. _String_ or _Number_  
>>> _String_ or _Number_ can only have value which has string or number type.  
>>  ### 2. _Boolean_  
>>> _Boolean_'s input format is checkbox. You can input it's value by checking or unchecking.  
>>> _Unchecked_ means _false_, _Checked_ means _true_.
>>  ### 3. _Object_  
>>> _Object_'s value should be started by _{_, ended by _}_. And you can use _if condition_ in this type.  
>>> If you want to learn about using _if condition_, go to [Other Functions of Editor](#other-functions-of-editor) and check it.
>>  ### 4. _Function_  
>>> _Function_ is for handling event.  
>>> For example, there are _onClick_ in _React_ or _onPress_ in _React Native_ to handle button's event.  
>>> So if you want to handle them, set _Key_ as function's name and set _Type_ as _Function_.  
>>> You can call this function at your project by extending design component.  
>>> About this, go to [Inheritance](#inheritance) and check how to use it.  
>>  ### 5. _Variable_
>>> _Variable_'s value has to be variable's name including of _state_.  
>>> You can use variable or props from your project by extending this design component.  
>>> Maybe there will be a blank in **_ServiceDesigner_**, in this case.  
>>> So please be careful when working with UI by using other variables except state.  
> * _Value_ is different per _Type_ of property.  

## Other Functions of Editor  
### 1. _If Condition_  
![IfCondition](./asset/img/ifCondition.gif)  

#### Add  
> As you can see, there are _zero button_ and _plus button_.  
> 1. At first, click the _plus button_, then there will be added new numbered button.  
> 1. After that, click the _number button_ except **zero**. Zero exists for default, not for _if condition_.  
> 1. Then you can input condition at the below textinput which has 'Condition' placeholder.  
> 1. Input any _if condition_ which you want to use it.  
>> * If you use state value, you have to put _this.state._ infront of state's name.
>> ```
>> this.state.XXX  
>> ```
>> * You can use not only _Boolean type_, but also _Other types_ as _if condition_ which it's type of result is _Boolean_.  

#### Delete  
> If you want to delete some _if condition_, just click _trash icon button_.  

### 2. _For Loop_  
> ![ForLoop](./asset/img/forLoop.gif)  
> If you have an _array_ or _array object_ state, you don't have to add all elements again and again by your self.  
> You can set elements automatically and conveniently by using _for loop_.  
> 1. Add property which has _for_ as Key, and Type is Variable.  
> 1. And set the Value the name of _array_ or _array object_ state.  
> 1. As the result, you can check the element is added as many as _array's length_.  
> 1. If you want to use the _array's value_, set Value as _item0_ or _item0.XXX_, which is mapped from the _state array_.  



# Other Functions  
There are other functions in **_ServiceDesigner_** : _State_, _Color_, _Asset_, _Css_, _Style_.

> Before continuing, there are some overlapped function in these _Other Functions_.  
> _Delete_ or _Cancel_ in _Color_, _Asset_ and _Style_ are those.  
> It's literally all the same way, so if you want to need a help with those functions, go to [Color](#color) again, and follow it.  

## State  
> * In **_ServiceDesigner_**, you can set **State** as _json format_, and use it in your project by extending design component.  
>> The detailed explanation of using _extends_ will be [Inheritance](#inheritance). Please check it.  
>> In the case that you have to change state's value, use setState at your project's component.  
>> Otherwise, just leave it. It will call design component's state value automatically to your project.  
> * And also, you can use this state value as _property's value_ or for _if condition_.  
>> [Other Functions of Editor](#other-functions-of-editor) will help you understand how to use _state_ in properties.  

## Color
**Color** tab support _Color Variables_.   

![Color](./asset/img/color.gif)  

### 1. _Create_
> * Pick any color that you want to use from the _Color Picker_, and input the name.  
> * On the other hand, just input _Color Code_ or _RGB_.   
> * You can check color variables list from the left side of the color picker.  
> * In this case, you can't rename color variable, so please be careful when you create it.  

### 2. _Update_
> * If you want to change variable's value, select the one from the list.  
> * Then set color value and click the _Update button_.  
> * You can check the _Color Code_ and _RGB_ value changed at the list simply.  

### 3. _Delete_
> * When you want to delete some variable, select it from the list and click the _Delete button_.  

### 4. _Cancel_
> * After done with working some color variable, click the _Cancel button_.  
> * Then you can create or update other variables again.  

### 5. _Usage_  
> * You can use color variable by calling it as property's value : _Color.XXX_.  
> ```
> Color.XXX  
> ```



## Asset
**Asset** tab support _Asset Variables_.  

![Asset](./asset/img/asset.gif)  

### 1. _Create_  
> * Set name for the asset variable and click the _Create button_.  
> * If you don't set name, nothing will happen. So please be aware that you have to set it's name first.  
> * Select image file and open it. Now your asset variable is ready to use.  

### 2. _Usage_  
> * You can use asset variable by calling it as property's value : _Asset.XXX_.
> ```
> Asset.XXX  
> ```

## Css  

## Style  
**Style** tab support _Style Variables_.  

![Style](./asset/img/style.gif)  

### 1. _Add_  
> * Set name for style variable first.  
> * Then set style code as usting _CSS .class selector_ in JS, just like below code.  
> ```css
> .className {  
>   keyName: value;
> }
> ```

### 2. _Update_  
> * If you want to update this variable, select the one from the list.  
> * Then update the code and click the _Update button_.  

### 3. _Usage_  
> * You can use style variable by calling name.  
> * Set property's key : _styleName_ and type : _String_.
> * Then call it's name as value.    



# Inheritance  
## Render  
**Render** needs _React_ or _React Native_ Component, which is design component in **_ServiceDesigner_**.

### 1. _Extend design component_  
> * When you done with your UI in **_ServiceDesigner_**, open your coding editor and your project.  
> * First, check saved _design.component.tsx_ which has all components that you created in **_ServiceDesigner_**.
> * Then import one design component what to use from this design file.  
> * And _extends_ it to project's component, just like below code.  
> ```css
> import { DesignComponentNameToUse } from 'design\-file\-path/design.component';
> export class ProjectComponentName extends DesignComponentNameToUse {
>   constructor(props:any) {
>     super(props);
>   }
>   // some function to do
> }
> ```
> * #### Render React at the Web  
> ![RenderReact](./asset/img/renderReact.gif)  
> * #### Render React Native at the App   
> ![RenderReactNative](./asset/img/renderReactNative.gif)    
> They are the result screens after rendering the project components that are extending design component.  
> You can create or call the functions freely, just like call alert function at _componentDidMount()_ in these examples.  
> And also, as you know from this result, you don't have to work with UI workprocess complicatedly at your project any more!  
> It's really simple! Just extend design component at your project and use it.  

### 2. _Handle Function_
> * Add _Button_, _TextInput_, _TouchableOpacity_ or whatever occurs event in your project would be pretty picky.  
> * Because, you have to add property which has _Function_ as type to handle those elements' event.  
> * If you don't handle and just ignore them, nothing will happen.  
> * Click or press the button, fill out the textinput, or do whatever, **NOTHING WILL HAPPEN**.  
> * So if you want to make your project working properly, you have to learn about handling function.  
> #### 1. _Add Function Property_  
>> ![AddFunctionProperty](./asset/img/addFunctionProperty.gif)    
>> * As this example, you have to add Name and Function Property at the first step.  
>> * The reason to set the name of element is to call event by it's name.  
>> * It's useful when one component has many elements that occur event.   
> #### 2. _Call and Use Function by Using onEvent_  
>> * Before call function at your project, open _design.component.tsx_ file.  
>> * You can check _DesignedComponent_ has _onEvenet(e:any)_ method.  
>> * And other components that you created extend this _DesignedComponent_.  
>> * This structure makes you could call and use _onEvent(e)_ method at your project by extending design component.  
>> ```css
>> functionName = { 
>>   (e) => this.onEvent ({ 
>>     event:"functionName",
>>     value:e, 
>>     name:"elementName"
>>   })
>> }
>> ```
>> * Also, you can check this property at your element that you set name and function property.  
>> * _event_ means key value of property which has function type and _name_ means value of name property.  
>> * So you can seperate all functions by using _if condtion_ to compare name value in _onEvent(e)_ method called in your project.  
>> * Just like below code.   
>> ```css
>> onEvent(e) {  
>>   if (e.name === "elementNameOne") {
>>     // some function to do
>>   } else if (e.name === "elementNameTwo") {
>>     // some function to do
>>   } else {
>>     // some function to do
>>   }
>> }
>> ```

<!-- - File : Open saved 'design.save.json' file to update your project at ServiceDesigner.
- State : The scheme is json.
- Style : The Style supports following special shceme.

  Color.XXX : Support Color variables. The variables should be defined color tab.
  Asset.XXX : Support Asset variables. The variables should be defined asset tab.
  ex ) { "backgroundColor": "Color.red" }
```css
{  
    "backgroundColor": "Color.red"  
}
```

- Property : the property supports following special shceme.

  First checkbox is if the attribute is active.
  Second checkbox is if the attribute is binded with state variable.
  Asset.XXX : Asset tab scheme. -->