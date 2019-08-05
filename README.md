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

- File : Create design directory at src and save file in that path. 
         You can check 'design.save.json' file is created. 
         Whenever you update design from your project, please open this json file.
- State : The scheme is json.
- Style : The Style supports following special shceme.

  Color.XXX : Support Color variables. The variables should be defined color tab.
  Asset.XXX : Support Asset variables. The variables should be defined asset tab.
  ex ) { "backgroundColor": "Color.red" }

- Property : the property supports following special shceme.

  First checkbox is if the attribute is active.
  Second checkbox is if the attribute is binded with state variable.
  Asset.XXX : Asset tab scheme.