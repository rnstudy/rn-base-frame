import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Utils from '../../utils/Utils';
import Express from '../../res/img/icon_express.png';
import I18n from "../../config/i18n";
import * as Constant from "../../utils/Constant";

export default class ExpressTag extends PureComponent {

    //渲染
    render() {
        if (this.props.logisticsType && this.props.logisticsType === 'express') {
            return (<View style={{ alignItems: 'center', flexDirection: 'row', paddingTop: Utils.scale(Utils.isIOS() ? 4 : 8) }}>
                <Image source={Express}
                    style={{ width: Utils.scale(25), height: Utils.scale(25) }} />
                <Text numberOfLines={1} style={styles.text}>{this.props.text ? this.props.text : I18n('EXPRESS_TEXT')}</Text>
            </View>
            )
        } else {
            return null
        }
    }
};

const styles = StyleSheet.create({
    text: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginLeft: Utils.scale(5)
    },
});