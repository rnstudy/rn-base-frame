import React, { Component } from "react";
import {
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import * as Constant from "../../utils/Constant";
import Utils from "../../utils/Utils";

import I18n from "../../config/i18n";
// import console = require("console");

/* <OText
        style={styles.bonusText}
        text={'EARN'}
        option1={{ unit, commission }}
    /> */

export default class OText extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { props } = this;
        const { text, style, option1, option2 } = props;
        //console.log('|||OText|||',props);
        return (
            <Text {...props} style={[Constant.defaultTextStyle, style]}>
                {I18n(text, option1, option2)}
                {this.props.children}
            </Text>
        );
    }
}
