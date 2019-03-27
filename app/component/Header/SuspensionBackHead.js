import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import BackIcon from '../../res/img/arrow_back.png';
import { Actions } from 'react-native-router-flux';

import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
export default class SuspensionBackHead extends Component {

    onPressBack() {
        if (this.props.backAction) {
            this.props.backAction();
        } else {
            Actions.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
                <TouchableOpacity
                    style={styles.backTouch}
                    onPress={() => this.onPressBack()}
                >
                    <Image
                        resizeMode={'contain'}
                        style={styles.backImage}
                        source={BackIcon}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.mainBackgroundColor,
        width: '100%',
        height: '100%',
        paddingBottom: Constant.paddingIPXBottom,
    },
    backTouch: {
        left: Utils.scale(11),
        top: Constant.isIphoneX ? Utils.scale(36) : Utils.scale(26),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: Utils.scale(32),
        height: Utils.scale(32),
        borderRadius: Utils.scale(16),
        backgroundColor: '#ffffff',
        opacity: 0.8,
    },
    backImage: {
        width: Utils.scale(22),
        height: Utils.scale(22)
    }
})