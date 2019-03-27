import React, { Component } from 'react'
import { Alert, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Actions } from 'react-native-router-flux';
import I18n from "../../config/i18n";
import CommonHeader from '../../component/Header/CommonHeader';
import OText from "../../component/OText/OText";
import Utils from "../../utils/Utils";
import { inject, observer } from "mobx-react/native";

import * as Constant from "../../utils/Constant";
import AddressBookItem from '../../component/AddressBook/AddressBookItem';
import { ADDRESS_DEL, ADDRESS_SET_DEFAULT } from "../../utils/Api";
import NetUtils from "../../utils/NetUtils";
import DeviceInformation from "../../utils/DeviceInformation";
import { toJS } from "mobx";

import LineColor from '../../res/img/line_color.png';
import Address_Add from '../../res/images/address_add.png'

@inject(stores => ({
    listStore: stores.addressListStore,
}))
@observer
export default class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            defaultId: "",
        };
    }

    componentWillMount() {
        console.log('0')
        this.getData(true);
    }

    componentWillUnmount(){
        //this.props.listStore.clearData()
    }
    render() {
        return (
            <CommonHeader
                title={I18n('STORE_PERSONAL_SETTING_ADDRESS_BOOK')}
            >
                <Image style={styles.lineColor} source={LineColor} />
                {this.renderList()}
            </CommonHeader>
        );
    }

    renderList() {
        const { listStore, checkOutData, callBack } = this.props;
        const { defaultId } = listStore;
        this.state.defaultId = defaultId;
        const {listData} =this.props.listStore
        console.log('this.state.defaultId',this.state.defaultId)
        console.log('||||listData',toJS(listData))

        return <FlatList
            keyExtractor={(item, index) => (item.addressId + '')}
            onRefresh={() => this.getData(true)}
            style={{ width: '100%', flex: 1, backgroundColor: Constant.boldLine }}
            data={listData}
            renderItem={({ item }) => <AddressBookItem
                item={item}
                def={defaultId}
                checkOutData={checkOutData}
                callBack={callBack}
                // 编辑
                toEditPage={() => this.toEditPage(item)}
                // 设为默认
                setDefault={() => this.setDefault(item)}
                //删除
                delAddress={() => this.delAddress(item)}
            />}
            horizontal={false}
            refreshing={this.state.refreshing}
            // onEndReached={() => this.getData()}
            ListFooterComponent={this.renderFoot(listData.length)}
        />
    }

    renderFoot(length) {
        return length >= 6 ? null : (
            <View style={styles.bottomView}>
                <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={() => this.toEditPage()}
                >
                    <Image style={{width:Utils.scale(12),height:Utils.scale(12),marginRight:Utils.scale(5)}} source={Address_Add} />
                    <OText
                        style={styles.bottomBtnText}
                        text={'ADDRESS.ADDRESSBOOK_ADD_NEW_ADDRESS'}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    //编辑
    toEditPage(address) {
        const { listStore } = this.props;
        let setDefault = listStore.listData.length <= 0;

        if (address) {
            address.setDefault = address.addressId === this.state.defaultId;
            //console.log("toEditPage setDefault", address.setDefault);
        }
        let isSG = false;
        let country = DeviceInformation.getDeviceCountry();
        if (country.indexOf('SG') >= 0 ||
            country.indexOf('新加坡') >= 0 ||
            country.indexOf('Singapore') >= 0) {
            isSG = true
        }
        let page = isSG ? "AddressEditSG" : "AddressEdit";
        Actions.push(page, {
            address: address,
            setDefault: setDefault,
            callBack: (addressId) => this.getData(true)
        })
    }
    //设为默认
    setDefault(address) {
        let param = {
            "addressId": address === undefined ? "" : address.addressId,
        };

        NetUtils.post(ADDRESS_SET_DEFAULT, param).then((result) => {
            this.setState({ showLoading: false });
            if (result.code === 0) {
                this.setState({ defaultId: address.addressId });
                console.log("setDefault ", address.addressId, this.state.defaultId);
                this.getData(true)
            }
        }).catch((error) => {
            console.log("setDefault ", error);
            // if (error.code + '' === '2007') {
            //     this.refs.accountTextInput.setErrorText(error.msg);
            // } else {
            //     this.refs.codeTextInput.setErrorText(error.msg);
            // }
        });
    }
    //删除
    delAddress(address) {
        Alert.alert('', I18n('ADDRESS_BOOK_DELETE_ADDRESS'),
            [{ text: I18n('ADDRESS.ADDRESS_BOOK_CANCEL'), },
            { text: I18n('ADDRESS.ADDRESS_BOOK_DELETE'), onPress: () => this.doDelAddress(address) }
            ])
    }
    //确认删除
    doDelAddress(address) {
        let param = {
            "addressId": address === undefined ? "" : address.addressId,
        };

        NetUtils.post(ADDRESS_DEL, param).then((result) => {
            this.setState({ showLoading: false });
            if (result.code === 0) {
                console.log("ADDRESS_DEL ", address.addressId, this.state.defaultId);
                this.getData(true)
            }
        }).catch((error) => {
            console.log("delAddress ", error);
            // if (error.code + '' === '2007') {
            //     this.refs.accountTextInput.setErrorText(error.msg);
            // } else {
            //     this.refs.codeTextInput.setErrorText(error.msg);
            // }
        });
    }

    getData(refresh = false) {
        if (this.state.refreshing) {
            return
        }
        this.setState({
            refreshing: true
        }, () => {
            const { listStore } = this.props;
            listStore.getListData(refresh, () => this.endRefresh());
        })
    }

    endRefresh() {
        this.setState({ refreshing: false })
    }
}

const styles = StyleSheet.create({
    lineColor: {
        width: '100%',
        height: Utils.scale(6),
    },
    bottomView: {
        width: '100%',
        height: Utils.scale(126),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Constant.boldLine,
    },
    bottomBtn: {
        width: Utils.scale(300),
        height: Utils.scale(36),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Utils.scale(16),
        backgroundColor: Constant.boldLine,
        borderColor: Constant.grayCC,
        borderWidth: 1,
        marginTop: Utils.scale(25),
    },
    bottomBtnText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(14)
    },
});