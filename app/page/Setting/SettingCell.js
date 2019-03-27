import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import RightArrowImage from '../../res/images/enter.png';

export default class SettingCell extends Component {
    render() {
        return (
            <TouchableOpacity
                disabled={!this.props.onPress}
                onPress={()=>this.props.onPress&&this.props.onPress()}
                style={styles.cell}
                activeOpacity={1}
            >
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    this.props.showArrow === 'false'? (
                        <View style={styles.rightView}>
                            <Text style={styles.content1}>{this.props.content}</Text>
                        </View>
                        ) : (
                        <View style={styles.rightView}>
                            <Text style={styles.content2}>{this.props.content}</Text>
                            <Image
                                style={styles.arrow}
                                source={RightArrowImage}
                            />
                        </View>
                        )
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 54,
    },
    title: {
        fontSize: 16,
        color: '#333333',
        paddingLeft: 16,
    },
    rightView: {
        flexDirection: 'row',
        paddingRight: 16,
    },
    content1: {
        fontSize: 14,
        color: '#999999',
        // paddingRight: 12,
    },
    content2: {
        fontSize: 14,
        color: '#999999',
        paddingRight: 12,
    },
    arrow: {
        width: 14,
        height: 14,
    },
})