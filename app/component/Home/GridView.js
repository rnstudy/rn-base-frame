import React, {Component} from 'react';
import {AlertIOS, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Utils from "../../utils/Utils";
import * as Constant from "../../utils/Constant";
import {Actions} from "react-native-router-flux";

const cols = 4;

export default class GridView extends Component {

    render() {
        const {items} = this.props
        return (
            <FlatList
                data={items}
                renderItem={({item}) => this.renderItem(item)}
                numColumns={cols}
                horizontal={false}
                style={{paddingLeft:10,paddingRight: 10, paddingBottom: 10, paddingTop: 10}}
            />
        );
    }

    // 返回cell
    renderItem(rowData) {
        return (
            <TouchableOpacity style={styles.wrap} activeOpacity={0.8} onPress={() => this.toCategoryList(rowData)}>
                <View style={styles.innerViewStyle}>
                    <Image source={{uri: rowData.imgUrl}} style={styles.iconStyle}/>
                    <Text numberOfLines={2} style={styles.text}>{rowData.categoryName}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    toCategoryList(rowData) {
        Actions.push('CategoryList', {
            id: rowData.id,
            title: rowData.categoryName
        })
    }
}

const styles = StyleSheet.create({
    wrap: {
        width: '25%',
        alignItems: 'center',
        paddingTop: Utils.scale(10),
    },
    innerViewStyle: {
        alignItems: 'center',
    },
    iconStyle: {
        width: Utils.scale(55),
        height: Utils.scale(55),
    },
    text:{
        width: Utils.scale(80),
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(4),
        textAlign:'center',
        marginBottom: Utils.scale(10)
    }
});