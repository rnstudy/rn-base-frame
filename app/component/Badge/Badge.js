import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';
import Utils from "../../utils/Utils";

export default class Badge extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let badge = this.props.badge;
        let text = badge && badge.length > 0 && badge !== '0' ? badge : '';

        return (
            <View style={{
                width: Utils.scale(18),
                height: Utils.scale(18),
                backgroundColor: text === '' ? '#FFF' : '#EB1845',
                borderRadius: Utils.scale(9),
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{fontWeight: 'bold', fontSize: 10, color: '#FFF'}}>{text}</Text>
            </View>
        );
    }
}