import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import Utils from "../../utils/Utils";
import ICON from '../../res/images/account_back.png';
import { Actions } from 'react-native-router-flux';


export default class BackIcon extends Component {
    render() {
        return (
            <TouchableOpacity
                style={styles.touchStyle}
                onPress={() => {
                    if (this.props.pressBack) {
                        this.props.pressBack()
                    } else {
                        Actions.pop();
                    }
                }}
            >
                <Image
                    style={styles.imgStyle}
                    source={ICON}
                />
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    touchStyle: {
        width: Utils.scale(44),
        height: Utils.scale(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgStyle: {
        width: Utils.scale(22),
        height: Utils.scale(22),
    }
});