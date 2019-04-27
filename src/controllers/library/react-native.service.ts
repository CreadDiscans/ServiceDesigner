import { ActivityIndicator, 
    Button,
    CheckBox,
    FlatList,
    Image,
    ImageBackground,
    ListView,
    Picker,
    SafeAreaView,
    ScrollView,
    SectionList,
    StatusBar,
    SwipeableFlatList,
    SwipeableListView,
    Switch,
    Text,
    TextInput,
    Touchable,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    VirtualizedList,
    YellowBox
 } from 'react-native-web';

export class ReactNativeService {

    static lib:any = {
        ActivityIndicator, 
        Button,
        CheckBox,
        FlatList,
        Image,
        ImageBackground,
        ListView,
        Picker,
        SafeAreaView,
        ScrollView,
        SectionList,
        StatusBar,
        SwipeableFlatList,
        SwipeableListView,
        Switch,
        Text,
        TextInput,
        Touchable,
        TouchableHighlight,
        TouchableOpacity,
        TouchableWithoutFeedback,
        View,
        VirtualizedList,
        YellowBox
    }

    static get(key:any) {
        return ReactNativeService.lib[key]
    }
}