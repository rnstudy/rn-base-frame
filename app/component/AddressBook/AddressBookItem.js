import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import AddressItem from '../../component/AddressBook/AddressItem';
import * as Constant from "../../utils/Constant";
import OText from "../../component/OText/OText";
import Utils from "../../utils/Utils";
import IconChecked from '../../res/img/icon_checked.png';
import IconPoint from '../../res/images/icon_point.png';
import {SHOP_CART_SET_ADDRESS} from "../../utils/Api";
import NetUtils from "../../utils/NetUtils";
import {Actions} from "react-native-router-flux";
import ADDRESSBOOK_EDIT from '../../res/images/addressbook_edit.png'

export default class AddressBookItem extends Component {

    //渲染
    render() {
        const {item, def, checkOutData} = this.props;
        const {addressId, } = item;

        let isDef = def === addressId;
        //console.log('item',item);

        //被选中的图标
        let checkView = checkOutData && item.addressId === checkOutData.addressId ?
            <Image style={styles.iconChecked} source={IconChecked}/>
            : null;

        let isCheck = checkOutData ? <TouchableOpacity
            onPress={() => this.setAddress(item, checkOutData)}
        >
            <AddressItem item={item} showArrow={false}/>  
            </TouchableOpacity> : <AddressItem item={item} isDef={isDef} showArrow={false}/>

        return <View style={styles.wrap}
        >   
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:1,}}>
                    {checkView}

                    {isCheck}
                    {/* <AddressItem
                        item={item}
                        showArrow={false}
                    /> */}
                    {this.renderFoot()}
                </View>
                <View style={{width:Utils.scale(18),height:Utils.scale(18),marginRight:Utils.scale(16)}}>
                    <TouchableOpacity
                        // style={styles.bottomBtn}
                        onPress={() => this.props.toEditPage(item)}
                    >
                        <Image style={styles.editImage} source={ADDRESSBOOK_EDIT}/>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
            <View style={styles.lineDivider}/>
        </View>

    }

    renderFoot() {
        const {item, def, checkOutData} = this.props;
        const {addressId, countryName, firstname, lastname, phone} = item;

        let isDef = def === addressId;
        let isAddressBook = checkOutData === undefined;
        
        let defBtn = isDef || !isAddressBook ? null : <TouchableOpacity
            style={styles.bottomBtn}
            onPress={() => this.props.setDefault(item)}
        >
            <OText
                style={styles.bottomBtnText}
                text={'ADDRESS.ADDRESSBOOK_SET_DEFAUL'}
            />
        </TouchableOpacity>;

        let delBtn = isAddressBook ? <TouchableOpacity
            style={styles.bottomBtn}
            onPress={() => this.props.delAddress(item)}
        >
            <OText
                style={styles.bottomBtnText}
                text={'ADDRESS.ADDRESS_BOOK_DELETE'}
            />
        </TouchableOpacity> : null;


        return (
            <View style={styles.bottomViewEnd}>
                <View style={styles.bottomViewBtn}>
                    {defBtn}
                    {delBtn}
                </View>
            </View>
        )
    }

    setAddress(address, checkOutData) {
        let isAddressBook = checkOutData === undefined;
        if(!isAddressBook){
            let param = {
                "addressId": address.addressId,
                "orderType": checkOutData.orderType,
                "storeId": checkOutData.storeId,
            };
            this.props.callBack && this.props.callBack(address);
        }
    }
};

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: '#fff',
        width: '100%',
        flexDirection:'column',
        alignItems: 'center',
        //paddingLeft:Utils.scale(16),
        // paddingRight:Utils.scale(16),
    },

    bottomViewEnd: {
        width: '100%',
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    defaultText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(14),
        marginTop: Utils.scale(5),
        fontWeight: 'bold',
    },
    bottomViewBtn: {
        // width: '80%',
        paddingBottom: Utils.scale(16),
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    bottomBtn: {
        height: Utils.scale(23),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Utils.scale(16),
        borderColor: Constant.lightText,
        marginRight: Utils.scale(8),
        borderWidth: Utils.scale(1),
        paddingRight: Utils.scale(10),
        paddingLeft: Utils.scale(10),
        marginTop: Utils.scale(8),
    },
    bottomBtnText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
    },
    lineDivider: {
        width: '100%',
        height: Utils.scale(1),
        backgroundColor: Constant.divider,
    },
    iconChecked: {
        width: Utils.scale(30),
        height: Utils.scale(30),
        position: 'absolute',
        right: -34,
    },
    editImage:{
        width:Utils.scale(18),
        height:Utils.scale(18),
        //paddingRight:Utils.scale(16),
    }
});
