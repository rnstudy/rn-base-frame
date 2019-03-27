// created by PPPSHIWEN 2019.03.25.6:00
'use strict';
import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    WebView,
    Alert,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';

import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { toJS } from 'mobx';
import OText from '../../component/OText/OText';
import OrderItemProduct from '../../component/OrderListItem/OrderItemProduct'

import ArrowRight from '../../res/images/enter.png';
const { height, width } = Dimensions.get('window');

export default class OrderScrollProduct extends Component {

    render() {
        console.log('-----item',toJS(item) )
        const { item } = this.props;
        const { products, unit, productCount } = item;
        if(products && products.length>0){
           try{
                if(products.length+'' === '1'){
                    return <OrderItemProduct
                        unit={unit}
                        prodcutItem={products[0]}
                    />
                } else {
                    return <View style={[styles.productHor]}>
                        <ScrollView
                        style={styles.productScroll}
                        horizontal={true}>
                            {products.map((obj, index) => {
                                // console.log('----obj',obj)
                                return <View key={obj + '' + index}>
                                     <Image
                                resizeMode='stretch'
                                source={{ uri: obj.imgUrl ? obj.imgUrl : '' }}
                                style={styles.productImage}
                            />
                            {obj.productCount && obj.productCount >1 && <View style={styles.buttonShadow}>
                                <Text style={{color:'#FFF'}}>{'X'}{obj.productCount}</Text>
                            </View>}
                            
                                </View> 
                            })}
                        </ScrollView>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: Utils.scale(16), }}>
                            <Text>{productCount}</Text>
                            <OText
                                text={'STORE_MANAGE_ITEMS'}
                                style={[styles.itemsText, { marginRight: Utils.scale(5), marginLeft: Utils.scale(2)}]}
                            />
                            <Image style={{
                                width: Utils.scale(14),
                                height: Utils.scale(14),
                            }} source={ArrowRight} />
                        </View>
                    </View>
                }
           }catch(err){
            console.log('renderProduct(item)',err)
            return <View />
           }
        }
        return <View />
    }
}

const styles = StyleSheet.create({
    productHor: {
        backgroundColor:'#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        height: Utils.scale(103),
    },
    productScroll: {
        width: Utils.scale(254),
        height: Utils.scale(83),
        paddingLeft: Utils.scale(16),
    },
    productImage: {
        width: Utils.scale(66),
        height: Utils.scale(83),
        borderRadius: Utils.scale(4),
        marginRight: Utils.scale(12),
    },
    itemsText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.blackText,
        margin: Utils.scale(16),
    },
    buttonShadow:{
        width: Utils.scale(66),
        height:Utils.scale(20),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)', 
        borderBottomRightRadius: Utils.scale(4),
        borderBottomLeftRadius: Utils.scale(4),
        marginRight: Utils.scale(12),
        position: 'absolute',
        top:Utils.scale(63),
        zIndex:2
    }
})