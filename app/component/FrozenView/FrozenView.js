import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Utils from "../../utils/Utils";
import * as Constant from '../../utils/Constant';
import FrozenImage from '../../res/img/close_app.png';
import OText from '../OText/OText';
const { width, height } = Dimensions.get('window');

const marginLeft = Utils.scale(16);

export default class FrozenView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{
                position: 'absolute',
                width: width,
                height: height,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 999,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={styles.whiteBg}>
                    <View style={styles.contentView}>
                        <Image style={styles.frozenIcon} source={FrozenImage} />
                        <OText style={styles.frozenTips} text='FROZEN_TIPS' />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    whiteBg: {
        width: Utils.scale(280),
        backgroundColor: '#FFFFFF',
        borderRadius: Utils.scale(8),

    },
    contentView: {
        alignItems: 'center',
        margin: Utils.scale(15),
      
    },
    frozenIcon: {
        width: Utils.scale(86),
        height: Utils.scale(86),
    },
    frozenTitle: {
        fontWeight: 'bold',
        fontSize: Utils.scale(18),
        color: Constant.blackText,
        textAlign: 'center',
        paddingTop: Utils.scale(20),
    },
    frozenTips: {
        fontSize: Utils.scale(12),
        color: Constant.lightText,
        textAlign: 'left',
        paddingTop: Utils.scale(20),
        lineHeight: Utils.scale(18),
    }
});