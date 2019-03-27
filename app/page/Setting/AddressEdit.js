import React, { PureComponent } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Text, Switch, } from 'react-native'
import I18n from "../../config/i18n";
import CommonHeader from '../../component/Header/CommonHeader';
import Utils from "../../utils/Utils";
import { inject, observer } from "mobx-react/native";
import * as Constant from "../../utils/Constant";
import OText from "../../component/OText/OText";
import { ADDRESS_UPSERT } from "../../utils/Api";
import { Actions } from "react-native-router-flux";
import NetUtils from "../../utils/NetUtils";
import CheckBoxNormal from '../../res/img/common_check_box_normal.png';
import CheckBox from '../../res/img/common_check_box.png';
import ModalPicker from '../../component/ModalPicker/ModalPicker';
import DeviceInformation from "../../utils/DeviceInformation";
import OTextInputSimple from "../../component/OTextInput/OTextInputSimple";
import { KeyboardAwareScrollView } from '../../component/KeyboardAwareScrollView';

import US from '../../res/images/US.png'
import AddressCorrect from "../../page/Address/AddressCorrect";
import {toJS} from "mobx/lib/mobx";

@inject(stores => ({
    listStore: stores.stateListStore,
}))
@observer
export default class AddressEdit extends PureComponent {
    constructor(props) {
        super(props);
        const { address, setDefault } = this.props;
        let def = address ? address.setDefault : setDefault;
        let isSG = false;
        let country = DeviceInformation.getDeviceCountry();
        if (country.indexOf('SG') >= 0 ||
            country.indexOf('新加坡') >= 0 ||
            country.indexOf('Singapore') >= 0) {
            isSG = true
        }

        this.state = {
            isSG: isSG,
            refreshing: false,
            showLoading: true,
            address1: address === undefined ? "" : address.address1,
            address2: address === undefined ? "" : address.address2,
            city: isSG ? "Singapore" : (address === undefined ? "" : address.city),
            countryCode: isSG ? "SG" : "US",
            countryName: isSG ? "Singapore" : "United States",
            firstname: address === undefined ? "" : address.firstname,
            lastname: address === undefined ? "" : address.lastname,
            phone: address === undefined ? "" : Utils.formatPhone(address.phone),
            postcode: address === undefined ? "" : address.postcode,
            setDefault: def,
            state: isSG ? "Singapore" : (address === undefined ? "" : address.state),
            stateCode: isSG ? "SG" : (address === undefined ? "" : address.stateCode),
            checkbox: def ? CheckBox : CheckBoxNormal,
        };
    }

    componentWillMount() {
        this.getStateData(false)
    }

    render() {
        return (
            <CommonHeader
                showDivider={true}
                title={I18n('ADDRESS.ADDRESS_EDIT')}
            >

                <KeyboardAwareScrollView
                    style={styles.scrollBg}
                >
                    {this.renderContent()}
                </KeyboardAwareScrollView>
            </CommonHeader>
        );
    }

    renderContent() {
        let address = this.props.address;
        let countrys = [{ state: this.state.countryName, stateCode: this.state.countryCode }];
        // console.log('address',address)
        const { listStore } = this.props;
        const { listData, cityListData } = listStore;

        // state input
        let statePicker = listData === undefined || listData.length === 0 ? null : <ModalPicker
            data={listData}
            initValue={this.state.stateCode}
            onChange={(option) => {
                console.log("onChange = ", option);
                if (option.stateCode !== this.state.stateCode) {
                    this.setState({ state: option.state, stateCode: option.stateCode }, () => {
                        //this.getCityData(true);
                    });
                }
            }} />;

        // let noCity = cityListData === undefined || cityListData.length === 0
        // let citys = []
        // if (!noCity) {
        //     cityListData.map((item, index) => {
        //         citys[index] = { stateCode: item.cityCode, state: item.cityName }
        //     })
        // }

        // let cityPicker = noCity ? null : <ModalPicker
        //     data={citys}
        //     initValue={this.state.city}
        //     onChange={(option) => {
        //         console.log("onChange option", option);
        //         this.setState({ city: option.state });
        //     }} />;

        return (
            <View style={styles.bottomView}>
                
                <OTextInputSimple
                    ref='firstnameTextInput'
                    keyboardType="email-address"
                    placeholder={I18n('ADDRESS_LAST_NAME_APP')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={20}
                    defaultValue={this.state.firstname}
                    onChangeText={(text) => {
                        this.checkTextInput(text, this.refs.firstnameTextInput, I18n("ADDRESS_EN_NAME_TIP"));
                        this.setState({ firstname: Utils.trim(text) })
                    }}
                />
                <OTextInputSimple
                    ref='lastnameTextInput'
                    keyboardType="email-address"
                    placeholder={I18n('ADDRESS_FIRST_NAME_APP')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={20}
                    defaultValue={this.state.lastname}
                    onChangeText={(text) => {
                        this.checkTextInput(text, this.refs.lastnameTextInput, I18n("INPUT_FIRST_NAME_TIP"));
                        this.setState({ lastname: Utils.trim(text) })
                    }}
                />
                <OTextInputSimple
                    ref='address1TextInput'
                    keyboardType="email-address"
                    placeholder={I18n('ADDRESS.ADDRESS_ONE')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={50}
                    defaultValue={this.state.address1}
                    onChangeText={(text) => {
                        this.checkTextInput(text, this.refs.address1TextInput, I18n("COMPLETE_IN_EN"));
                        this.setState({ address1: Utils.trim(text) })
                    }}
                />
                <OTextInputSimple
                    ref='address2TextInput'
                    keyboardType="email-address"
                    placeholder={I18n('ADDRESS.ADDRESS_SECOND')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={50}
                    defaultValue={this.state.address2}
                    onChangeText={(text) => {
                        this.checkTextInput(text, this.refs.address2TextInput, I18n("COMPLETE_IN_EN"));
                        this.setState({ address2: Utils.trim(text) })
                    }}
                />
                <OTextInputSimple
                    ref='cityTextInput'
                    keyboardType="email-address"
                    placeholder={I18n('ADDRESS.ADDRESS_CITY')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={20}
                    defaultValue={this.state.city}
                    onChangeText={(text) => {
                        this.checkTextInput(text, this.refs.cityTextInput, I18n("INPUT_CITY_TIP"));
                        this.setState({ city: Utils.trim(text) })
                    }}
                />

                {/* {cityPicker}
                <View style={styles.lineDivider} /> */}
                {statePicker}
                <View style={styles.lineDivider} />
                
                {/* <ModalPicker
                    data={countrys}
                    initValue={this.state.countryName}
                    onChange={(option) => {
                        console.log(option);
                        this.getStateData(true);
                    }} 
                    /> */}
                    <View style={{height: Utils.scale(49),justifyContent:'center'}}>
                        <Text style={{color:Constant.blackText,}}>{this.state.countryName}</Text>
                    </View>
                
                <View style={styles.lineDivider} />

                <OTextInputSimple
                    ref='zipCodeTextInput'
                    keyboardType="numeric"
                    placeholder={I18n('ADDRESS.ADDRESS_ZIP_CODE')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={20}
                    defaultValue={this.state.postcode}
                    onChangeText={(text) => {
                        this.refs.zipCodeTextInput.setErrorText("");
                        this.setState({ postcode: Utils.trim(text) })
                    }}
                />
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{width:Utils.scale(50),height:Utils.scale(15),flexDirection:'row',alignItems:'center'}}>
                        <Image style={{width:Utils.scale(21), height:Utils.scale(15), marginRight:Utils.scale(6)}} source={US}/>
                        <Text>{'+1'}</Text>
                    </View>
                    <OTextInputSimple
                        ref='phoneTextInput'
                        keyboardType="numeric"
                        placeholder={I18n('ADDRESS.ADDRESS_PHONE_NUMBER')}
                        placeholderTextColor='#999999'
                        bottomLineColor='#FFF'
                        maxLength={12}
                        defaultValue={this.state.phone}
                        onChangeText={(text) => {
                            if(text){
                                let phone = Utils.formatPhoneChange(text)
                                this.refs.phoneTextInput.setErrorText("");
                                this.setState({ phone: phone })
                            }
                        }}
                    />
                </View>
                <View style={styles.lineDivider} />

                {/* <TouchableOpacity
                    style={styles.setDefaultLay}
                    onPress={() => this.onPressSetDefault(this.state.setDefault)}
                >
                    <Image style={styles.checkbox} source={this.state.checkbox} />
                    <OText
                        style={styles.setDefault}
                        text={'ADDRESS.ADDRESSBOOK_SET_DEFAUL'}
                    />
                </TouchableOpacity> */}

                <View style={{height: Utils.scale(49), marginRight:Utils.scale(32), flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <OText
                        // style={styles.setDefault}
                        text={'ADDRESS.ADDRESSBOOK_SET_DEFAUL'}
                    />
                    <Switch
                    onValueChange={(value) => this.setState({setDefault:value})}
                    value={this.state.setDefault}
                    trackColor={{true:Constant.themeText}}
                    thumbTintColor='#FFF'
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], }}
                    //style={{height:Utils.scale(26),width:Utils.scale(44)}}
                    >

                    </Switch>
                </View>

                <View style={{ backgroundColor: "#fff" }}>
                    <TouchableOpacity
                        style={styles.bottomBtn}
                        onPress={() => this.onPressConfirm(address)}
                    >
                        <OText
                            style={styles.bottomBtnText}
                            text={'COMMON.CONFIRM'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    checkTextInput(text, textInput, tips) {
        if (Utils.isContainChinese(text)) {
            textInput.setErrorText(tips);
            return true
        } else {
            textInput.setErrorText("");
            return false
        }
    }

    checkAddress(text, textInput, tips) {
        if (!Utils.isAddress(text)) {
            textInput.setErrorText(tips);
            return true
        } else {
            textInput.setErrorText("");
            return false
        }
    }

    // onPressSetDefault(setDefault) {
    //     console.log('123',setDefault)
    //     if (setDefault) {
    //         this.setState({ setDefault: false, });
    //     } else {
    //         this.setState({ setDefault: true,});
    //     }
    // }

    onPressConfirm(address) {
        this.setState({ showLoading: true });
        if (!this.state.firstname || this.state.firstname.length === 0) {
            this.refs.firstnameTextInput.setErrorText(I18n('ADDRESS.INPUT_LAST_NAME_TIP'));
            return;
        }
        if (this.checkTextInput(this.state.firstname, this.refs.firstnameTextInput, I18n("ADDRESS.ADDRESS_EN_NAME_TIP"))) return;

        if (!this.state.lastname || this.state.lastname.length === 0) {
            this.refs.lastnameTextInput.setErrorText(I18n('ADDRESS.INPUT_FIRST_NAME_TIP'));
            return;
        }
        if (this.checkTextInput(this.state.lastname, this.refs.lastnameTextInput, I18n("ADDRESS.ADDRESS_EN_NAME_TIP"))) return;

        if (this.state.address1.length === 0) {
            this.refs.address1TextInput.setErrorText(I18n('ADDRESS.INPUT_ADDRESS_TIP'));
            return;
        }
        if (this.checkTextInput(this.state.address1, this.refs.address1TextInput, I18n("COMPLETE_IN_EN"))) return;
        if (this.checkTextInput(this.state.address2, this.refs.address2TextInput, I18n("COMPLETE_IN_EN"))) return;

        if (!this.state.city || this.state.city.length === 0) {
            this.refs.cityTextInput.setErrorText(I18n('ADDRESS.INPUT_CITY_TIP'));
            return;
        }
       // if (this.checkTextInput(this.state.city, this.refs.cityTextInput, I18n("ADDRESS.ADDRESS_EN_NAME_TIP"))) return;


        if (this.state.postcode.length === 0) {
            this.refs.zipCodeTextInput.setErrorText(I18n('ADDRESS.INPUT_ZIP_CODE_TIP'));
            return;
        }

        this.postAddress(0, address);
    }

    postAddress(identify, address){
        console.log("postAddress = ",identify);
        let phone = Utils.getPhoneNum(this.state.phone);

        let length = phone.length;
        if (length === 0) {
            this.refs.phoneTextInput.setErrorText(I18n('ADDRESS.INPUT_PHONE_TIP'));
            return;
        }

        if (length !== 10) {
            this.refs.phoneTextInput.setErrorText(I18n('ADDRESS.INPUT_PHONE_LENGTH_TIP'));
            return;
        }

        let param = {
            addressId: address === undefined ? "" : address.addressId,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.city,
            countryCode: this.state.countryCode,
            countryName: this.state.countryName,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            phone: phone,
            postcode: this.state.postcode,
            setDefault: this.state.setDefault,
            state: this.state.state,
            stateCode: this.state.stateCode,
            identify: identify,//0 是要校验地址 1 是不需要校验地址
        };

        console.log("ADDRESS_UPSERT11111", param);
        NetUtils.post(ADDRESS_UPSERT, param, false).then((result) => {
            // result = {"code":4008,"msg":[{"addressType":"HighRiseOrBusinessComplex","line1":"$300 PLEASANT GROVE RD STE 405$","line2":"","line3":"","city":"$MOUNT JULIET$","region":"TN","country":"US","postalCode":"37122-3921","latitude":36.178087,"longitude":-86.514231}]};
            this.setState({ showLoading: false });
            if (result.code === 0) {
                this.props.callBack && this.props.callBack(result.data.addressId);
                Actions.pop();
            }
        }).catch((error) => {
            console.log("error ADDRESS_UPSERT ", error);
            if (error.code + '' === '2017') {
                this.refs.zipCodeTextInput.setErrorText(error.msg);
                // } else {
                //     this.refs.codeTextInput.setErrorText(error.msg);
            } else if (error.code === 4008 && identify === 0) {
                Actions.push('AddressCorrect', {
                    item: param,
                    addressList: error.msg,
                    onAddressCorrect: (isEdit, item) => this.onAddressCorrect(isEdit, item)
                })
            }

        });
    }

    onAddressCorrect(isEdit, item){
        if(isEdit){
            this.setAddress(this.state.isSG,item);
        }else{
            this.postAddress(1, item)
        }
    }

    setAddress(isSG, address){
        const { listStore } = this.props;
        const {listData} = listStore;
        const stateList = JSON.parse(JSON.stringify(listData));
        for(let stateItem of stateList){
            let state = stateItem.state;
            let stateCode = stateItem.stateCode;
            if(state === address.state || stateCode === address.stateCode){
                address.state = state;
                address.stateCode = stateCode;
                break;
            }
        }

        this.setState ({
            address1: address === undefined ? "" : this.formatStr(address.address1),
            address2: address === undefined ? "" : this.formatStr(address.address2),
            city: isSG ? "Singapore" : (address === undefined ? "" : this.formatStr(address.city)),
            countryCode: isSG ? "SG" : "US",
            countryName: isSG ? "Singapore" : "United States",
            firstname: address === undefined ? "" : address.firstname,
            lastname: address === undefined ? "" : address.lastname,
            phone: address === undefined ? "" : this.formatStr(Utils.formatPhone(address.phone)),
            postcode: address === undefined ? "" : this.formatStr(address.postcode),
            state: isSG ? "Singapore" : (address === undefined ? "" : this.formatStr(address.state)),
            stateCode: isSG ? "SG" : (address === undefined ? "" : this.formatStr(address.stateCode)),
        });
    }

    formatStr(str){
        if(str && str.includes("$")){
            return str.replaceAll("\\$" ,'');
        }
        return str;
    }

    getStateData(refreshCity) {
        if (this.state.refreshing) {
            return
        }
        this.setState({
            refreshing: true
        }, () => {
            const { listStore } = this.props;
            listStore.getStateListData(this.state.countryCode, () => {
                const { listData } = listStore;
                if ((this.state.stateCode === undefined || this.state.stateCode.length === 0) && listData.length > 0) {
                    this.setState({ state: listData.get(0).state, stateCode: listData.get(0).stateCode });
                }
                //this.getCityData(refreshCity);
            });
        })
    }

    getCityData(refreshCity) {
        const { listStore } = this.props;
        listStore.getCityListData(this.state.stateCode, () => {
            this.endRefresh();
            const { cityListData } = listStore;
            console.log("getCityData ", refreshCity);
            if ((refreshCity || this.state.city.length === 0) && cityListData.length > 0) {
                this.setState({ city: cityListData.get(0).cityName });
            }
        });
    }

    endRefresh() {
        this.setState({ refreshing: false })
    }
}

const styles = StyleSheet.create({
    scrollBg: {
        backgroundColor: Constant.white,
        width: '100%',
        height: '100%'
    },
    lineDivider: {
        width: '100%',
        height: Utils.scale(1),
        backgroundColor: Constant.divider,
    },
    bottomView: {
        width: '100%',
        marginLeft: Utils.scale(16),
    },
    bottomBtn: {
        width: Utils.scale(343),
        height: Utils.scale(49),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Utils.scale(36),
        backgroundColor: Constant.bottomBtnBg,
        marginTop: Utils.scale(29),
        marginBottom: Utils.scale(100),
    },
    bottomBtnText: {
        fontWeight: 'bold',
        color: Constant.white,
        fontSize: Utils.scaleFontSizeFunc(16)
    },
    setDefaultLay: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: Utils.scale(16),
        alignItems: 'center',
    },
    checkbox: {
        width: Utils.scale(20),
        height: Utils.scale(20),
    },
    setDefault: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.lightText,
        alignItems: 'center',
        marginLeft: Utils.scale(8),
        justifyContent: 'center',
    },
});