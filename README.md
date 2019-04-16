# development

npm install

npm start

# build

npm install

npm run dist

# todo

folder manager validation

element manager validation

css manager validation

asset manager validation

color manager validation

data manager validation

layout manager validation

react design 테스트

react-native design 테스트

# how to use

- Folder : To create folder or file, should select folder to be parent.
- State : The scheme is json.
- Style : The Style supports following special shceme.

  Color.XXX : Support Color variables. The variables should be defined color tab.
  Asset.XXX : Support Asset variables. The variables should be defined asset tab.
  ex ) { "backgroundColor": "Color.red" }

- Property : the property supports following special shceme.

  {this.state.XXX} : XXX is state variable.
  {item} or {item.XXX} : This is for "for loop" scheme.
  Asset.XXX : Asset tab scheme.
   