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
import CommonWebView, {
    NAVIGATION_SUSPENSION,
    NAVIGATION_BACK,
    NAVIGATION_HIDE
} from '../../pages/CommonWebView/CommonWebView'
const { width, height } = Dimensions.get('window');
import SHARE_ICON from '../../res/img/share_gray.png';
import DELETE_ICON from '../../res/img/delete.png';
import { Actions } from 'react-native-router-flux';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from '../../component/OText/OText';
import I18n from '../../config/i18n'

export default class ListFootComponent extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }


    //渲染
    render() {
        const {
            noMore
        } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.small} />
                <View style={styles.big} />
                <Text style={styles.text}>{noMore ? 'End' : 'Loading'}</Text>
                <View style={styles.big} />
                <View style={styles.small} />

            </View>
        );
    }
};

const styles = StyleSheet.create({

    container: {
        height: Utils.scale(30),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(13),
        marginLeft: 6,
        marginRight: 6
    },
    big: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 3,
        backgroundColor: "#cccccc"
    },
    small: {
        width: 4,
        height: 4,
        borderRadius: 2,
        margin: 3,
        backgroundColor: "#cccccc"
    }
});
