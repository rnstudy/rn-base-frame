import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Utils from "../../utils/Utils";
import * as Constant from '../../utils/Constant';
import RightArrowImage from '../../res/images/enter.png';

const marginLeft = Utils.scale(16);

export default class  MoreTitleList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.ordersDiv}
                onPress={() => this.props.onPress()}
                activeOpacity={1}
            >
                <View style={{ flexDirection: 'row' }}>
                    {/* <Image style={styles.leftImage} source={this.props.leftImage} /> */}
                    <Text style={styles.ordersTitle}>
                        {this.props.title}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.rightTitle}>{this.props.subTitle}</Text>
                    {
                        this.props.showArrow === true ? (
                            <Image style={styles.rightArrow} source={RightArrowImage} />
                        ) : null
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ordersDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: Utils.scale(60),
        paddingLeft: marginLeft,
        paddingRight: marginLeft,
        marginBottom: Utils.scale(1),
    },
    ordersTitle: {
        // fontWeight: 'bold',
        fontSize: Utils.scale(16),
        color: Constant.blackText,
        marginTop: Utils.scale(18),
        marginBottom: Utils.scale(18),
    },
    rightTitle: {
        fontSize: Utils.scale(12),
        color: Constant.grayText,
        paddingRight: Utils.scale(12),
    },
    rightArrow: {
        width: Utils.scale(14),
        height: Utils.scale(14),
    },
});