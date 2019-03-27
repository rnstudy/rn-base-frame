import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Utils from "../../utils/Utils";
const { screenWidth } = Dimensions.get('window');

export default class SplitLine extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bannerHeight: Utils.scale(160),
        }
    }
    render() {
        return (
            <View style={styles.splitLine}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    splitLine: {
        width: screenWidth,
        height: Utils.scale(10),
        backgroundColor: '#F2F2F2'
    }
});