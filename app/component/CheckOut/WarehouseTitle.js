import React, { Component } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OText from '../OText/OText';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import CommonHeader from "../Header/CommonHeader";
import * as Api from "../../utils/Api";
import Utils from '../../utils/Utils';
import I18n from '../../config/i18n';

import HOUSE from '../../res/img/warehouse.png';



export default class WarehouseTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { code } = this.props;
        let text = 'VIP_NH' === code ? 'WAREHOUSE_NH' : 'WAREHOUSE_LOCAL'
        return <View style={{ flexDirection: 'row', alignItems: 'center', padding: Utils.scale(16), }}>
            <Image source={HOUSE} style={{ marginRight: 5 }} />
            <OText
                text={text}
            />
        </View>
    }
}
