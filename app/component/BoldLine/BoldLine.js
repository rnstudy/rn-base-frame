import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import Utils from "../../utils/Utils";
import PortraitPlaceholder from '../../res/img/default_group_people.png';
import SettingIcon from '../../res/img/account_settings.png';
import * as Constant from '../../utils/Constant';

export default class BoldLine extends Component {
    render() {
        return (
            <View style={styles.boldLine}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    boldLine: {
        backgroundColor: Constant.boldLine,
        height: 10,
    }
});