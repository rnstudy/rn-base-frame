import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Alert,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('window');
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"

export default class SkipView extends Component {


    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    //渲染
    render() {
        return <View style={{ width: '100%', height: Utils.scale(16), backgroundColor: Constant.boldLine }} />
    }
};

