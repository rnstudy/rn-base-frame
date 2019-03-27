import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Utils from "../../utils/Utils";
import * as Constant from "../../utils/Constant";
import iconRow from '../../res/img/icon_row.png';
import iconVer from '../../res/img/icon_ver.png';
import iconUp from '../../res/img/icon_up.png';
import iconDown from '../../res/img/icon_down.png';
import iconDownBlack from '../../res/img/icon_down_black.png';
import iconUpBlack from '../../res/img/icon_up_black.png';


export default class CategoryView extends Component {

    render() {
        const {categoryState, horizontal} = this.props
        console.log("render CategoryView", categoryState, horizontal)
        return (
            <View>
                <View style={styles.rowWrap}>
                    <TouchableOpacity disabled={false} onPress={() => this.props.setCategoryState(0)}>
                        <Text style={categoryState === 0 ? styles.textChecked : styles.text}>Recommended</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemWrap} disabled={false} onPress={() => this.setPriceState()}>
                        <Text style={categoryState === 0 ? styles.text : styles.textChecked}>Price</Text>
                        <View>
                            <Image source={categoryState === 1 ? iconUpBlack : iconUp} style={styles.iconStyle}/>
                            <Image source={categoryState === 2 ? iconDownBlack : iconDown} style={styles.iconStyle}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={false} onPress={() => this.props.switchOrientation()}>
                        <Image source={horizontal ? iconRow : iconVer} style={styles.iconMenu}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}/>
            </View>
        );
    }

    setPriceState(){
        let state = 0;
        if(this.props.categoryState === 2){
            state = 1;
        }else{
            state = 2;
        }
        this.props.setCategoryState(state)
    }
}

const styles = StyleSheet.create({
    rowWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: Utils.scale(16),
        marginLeft: Utils.scale(16),
        paddingTop: Utils.scale(14),
    },
    itemWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    line: {
        height: Utils.scale(1),
        backgroundColor: Constant.boldLine,
        marginTop: Utils.scale(14),
    },
    iconStyle: {
        width: Utils.scale(10),
        height: Utils.scale(5),
        margin: Utils.scale(1),
    },
    iconMenu: {
        width: Utils.scale(16),
        height: Utils.scale(16),
    },
    text: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(14),
    },
    textChecked: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(14),
        fontWeight: 'bold',
    }
});