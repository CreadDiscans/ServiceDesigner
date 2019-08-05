# ServiceDesigner
React & React-Native Design Editor desktop app built on top of Electron.

## development
```
npm install

npm start 
```
## build

```
npm install

npm run dist
```
## how to use

- File : Open or save 'design.save.json' file to update design of your project at ServiceDesigner.
- State : The scheme is json.
- Style : The Style supports following special shceme.

  Color.XXX : Support Color variables. The variables should be defined color tab.
  Asset.XXX : Support Asset variables. The variables should be defined asset tab.
  ex ) { "backgroundColor": "Color.red" }

- Property : the property supports following special shceme.

  First checkbox is if the attribute is active.
  Second checkbox is if the attribute is binded with state variable.
  Asset.XXX : Asset tab scheme.