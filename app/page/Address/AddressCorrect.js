import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import I18n from '../../config/i18n'
import Utils from '../../utils/Utils'
import CommonHeader, {NAVIGATION_BACK} from '../../component/Header/CommonHeader';
import CloseIcon from '../../res/img/navi_close.png'
import IconPoint from '../../res/images/order-point.png'
import ADDRESSBOOK_EDIT from '../../res/images/addressbook_edit.png'

import OText from "../../component/OText/OText";
import * as Constant from "../../utils/Constant";
import AddressItem from "../../component/AddressBook/AddressItem";
import { Actions } from "react-native-router-flux";

export default class AddressCorrect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            verifyCode: '',
            itemData: null,
            codeImg: null,
        };
    }

    render() {
        const {item, addressList} = this.props;
        console.log("addressList = ",addressList)
        return (
            <CommonHeader
                showDivider={false}
                titleType={NAVIGATION_BACK}
                backIconSrc={CloseIcon}
                title={I18n('ADDRESS.ADRESS_COMFIRM_ADRESS')}
            >
                <View style={styles.viewStyle}>
                    {this.renderTips()}
                    <OText
                        style={styles.textTitle}
                        text={'ADDRESS.ADRESS_INITIAL'}
                    />
                    {this.renderAddressItem(item)}
                    <OText
                        style={styles.textTitle}
                        text={'ADDRESS.ADRESS_ADVICE'}
                    />
                    {this.renderAddressList(item, addressList)}
                </View>
            </CommonHeader>
        );
    }

    renderTips() {
        return (
            <View style={styles.ViewTop}>
                <Image style={{width: 14, height: 14}} source={IconPoint}/>
                <OText
                    style={styles.infoText}
                    text={'ADDRESS.ADRESS_ASVICE_TIP'}
                />
            </View>
        )
    }

    renderAddressList(addressDef, addressList){
        return <FlatList
            style={{ width: '100%', flex: 1, backgroundColor: Constant.boldLine }}
            data={addressList}
            renderItem={({ item }) => this.renderListItem(addressDef,item)}
        />
    }

    renderListItem(addressDef,item){
        let address = {
            address1: item.line1,
            address2: item.line2 + item.line3,
            city: item.city,
            countryCode: item.country,
            postcode: item.postalCode,
            state: item.region,
            stateCode: item.region,
            addressId: addressDef.addressId,
            countryName: addressDef.countryName,
            firstname: addressDef.firstname,
            lastname: addressDef.lastname,
            linkman: addressDef.linkman,
            phone: addressDef.phone,
        };
        return this.renderAddressItem(address);
    }

    renderAddressItem(item) {
        return <View>
            <TouchableOpacity
                onPress={() => this.onAddressCorrect(false, item)}>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Constant.white}}>
                    <View style={{flex: 1,}}>
                        <AddressItem item={item} showArrow={false}/>
                    </View>
                    <View style={{width: Utils.scale(18), height: Utils.scale(18), marginRight: Utils.scale(16)}}>
                        <TouchableOpacity
                            onPress={() => this.onAddressCorrect(true, item)}
                        >
                            <Image style={styles.editImage} source={ADDRESSBOOK_EDIT}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    onAddressCorrect(isEdit, item){
        this.props.onAddressCorrect(isEdit, item);
        Actions.pop();
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        height: '100%',
        backgroundColor: Constant.boldLine,
    },
    ViewTop: {
        width: '100%',
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        flexDirection: 'row',
        paddingTop: Utils.scale(16),
        paddingBottom: Utils.scale(20),
        justifyContent: 'flex-start',
        backgroundColor: Constant.white,
    },
    infoText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginLeft: 5,
        marginRight: 10,
        marginTop: 1
    },
    textTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(14),
        marginLeft: Utils.scale(15),
        marginRight: Utils.scale(10),
        marginTop: Utils.scale(18),
        paddingBottom: Utils.scale(10),
    },
});
