import { AppRegistry } from 'react-native';
import App from './app/Main';

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.', 'source.uri should not be an empty string', 'Invalid props.style key'];

console.disableYellowBox = true // 关闭全部黄色警告

AppRegistry.registerComponent('littlemall', () => App);

//f全部替换成e
String.prototype.replaceAll=function(f,e){
    let reg = new RegExp(f,"g");
    return this.replace(reg,e);
}
