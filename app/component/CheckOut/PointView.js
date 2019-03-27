import React, { Component } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import OText from '../OText/OText';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import CommonHeader from "../Header/CommonHeader";
import * as Api from "../../utils/Api";
import Utils from '../../utils/Utils';
import I18n from '../../config/i18n';
import POINT from '../../res/img/point_detail.png';

import SWITHC_CLOSE_DIS from '../../res/img/switch_close_dis.png';
import SWITHC_CLOSE from '../../res/img/switch_close.png';
import SWITHC_OPEN from '../../res/img/switch_open.png';
import SWITHC_OPEN_DIS from '../../res/img/switch_open_dis.png';

import {
    POINT_STATE_NULL,
    POINT_STATE_USED,
    POINT_STATE_USED_DIS,
    POINT_STATE_NOT_USED,
    POINT_STATE_NOT_USED_DIS,
} from '../../pages/CheckOut/CheckOut';

export default class PointView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { usableState, point, unit, percent } = this.props;
        let imgSource = null;
        let imageVIew = <View />;
        let disabled = false;
        let textView = <OText
            style={styles.detailText}
            text={'TEXT_NO_POINTS'}
        />
        let isOpen = true;
        switch (usableState) {
            case POINT_STATE_USED:
                imgSource = SWITHC_OPEN;
                isOpen = true;
                break;
            case POINT_STATE_USED_DIS:
                imgSource = SWITHC_OPEN_DIS;
                disabled = true;
                isOpen = true;
                break;
            case POINT_STATE_NOT_USED:
                imgSource = SWITHC_CLOSE;
                isOpen = false;
                break;
            case POINT_STATE_NOT_USED_DIS:
                imgSource = SWITHC_CLOSE_DIS;
                disabled = true;
                isOpen = false;
                break;
            case POINT_STATE_NULL:
                return <View />
        }
        if (imgSource) {
            imageVIew = <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    this.props.press && this.props.press(!isOpen)
                }}>
                <Image source={imgSource} />
            </TouchableOpacity>
            textView = <Text style={styles.detailText}>
                <OText text={'TEXT_POINTS_CAN_USED_TO_APP_1'} />
                <Text style={styles.detailPrice}>{point}</Text>
                <OText text={'TEXT_POINTS_CAN_USED_TO_APP_2'} />
                <Text style={styles.detailPrice}>{unit}{point / 100}
                </Text></Text>
        }

        return <View style={styles.viewStyle}>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert('', I18n('TEXT_DEDUCT_INTRO_PONIT', { value: percent * 100 }),
                            [{
                                text: I18n('CART_OK')
                            }])
                    }}
                    style={{ flexDirection: 'row' }}
                >
                    <OText
                        style={styles.titleText}
                        text={'TEXT_POINT_DEDUCTION'}
                    />
                    <Image source={POINT} />
                </TouchableOpacity>
                {textView}
            </View>
            {imageVIew}
        </View>
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Utils.scale(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e5e5",
        justifyContent: 'space-between'
    },
    titleText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText,
        marginBottom: Utils.scale(4),
        marginRight: Utils.scale(2),
    },
    detailText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.blackText,
    },
    detailPrice: {
        fontWeight: 'bold',
    }
})