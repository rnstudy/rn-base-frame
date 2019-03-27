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
import PortraitPlaceholder from '../../res/img/default_group_people.png';
import SettingIcon from '../../res/img/account_settings.png';
import * as Constant from '../../utils/Constant';

export default class Button extends Component {

    handlePress() {
        this.props.onPress && this.props.onPress()
    }

    render() {
        return (
            <TouchableOpacity
                {...this.props}
                style={{}}
                onPress={() => this.handlePress()}>
                <View style={this.props.style}>
                    {this.props.children}
                </View>

            </TouchableOpacity>
        );
    }
}
