import React, {Component} from 'react'
import {Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import I18n from "../../config/i18n";
import CommonHeader from '../../component/Header/CommonHeader';
import Utils from "../../utils/Utils";
import * as Constant from "../../utils/Constant";
import OText from "../../component/OText/OText";
import {ADDRESS_UPSERT} from "../../utils/Api";
import {Actions} from "react-native-router-flux";
import NetUtils from "../../utils/NetUtils";
import CheckBoxNormal from '../../res/img/common_check_box_normal.png';
import CheckBox from '../../res/img/common_check_box.png';
import ModalPicker from '../../component/ModalPicker/ModalPicker';
import OTextInputSimple from "../../component/OTextInput/OTextInputSimple";

export default class AddressEditSG extends Component {
    constructor(props) {
        super(props);
        const {address, setDefault} = this.props;
        let def = address ? address.setDefault : setDefault;
        let isSG = true;

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
            phone: address === undefined ? "" : address.phone,
            postcode: address === undefined ? "" : address.postcode,
            setDefault: def,
            state: isSG ? "Singapore" : (address === undefined ? "" : address.state),
            stateCode: isSG ? "SG" : (address === undefined ? "" : address.stateCode),
            checkbox: def ? CheckBox : CheckBoxNormal,
        };

        console.log("constructor address", this.state.setDefault, this.state.checkbox);
    }

    render() {
        let behavior = Platform.OS === 'android' ? null : 'position';
        let keyboardDismissMode = Platform.OS === 'android' ? "none" : 'on-drag';

        return (
            <CommonHeader
                showDivider={true}
                title={I18n('ADDRESS.ADDRESS_EDIT')}
            >
                <View style={styles.line}/>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={behavior}
                    enabled={true}
                >
                    <ScrollView style={styles.scrollBg} keyboardDismissMode={keyboardDismissMode}>
                        {this.renderContent()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </CommonHeader>
        );
    }

    renderContent() {
        let address = this.props.address;
        let countrys = [{state: this.state.countryName, stateCode: this.state.countryCode}];

        return (
            <View style={styles.bottomView}>
                <ModalPicker
                    data={countrys}
                    initValue={this.state.countryName}
                    onChange={(option) => {
                        console.log(option);
                    }} />
                <View style={styles.lineDivider} />
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
                        this.checkTextInput(text, this.refs.lastnameTextInput, I18n("ADDRESS_EN_NAME_TIP"));
                        this.setState({ lastname: Utils.trim(text) })
                    }}
                />
                <OTextInputSimple
                    ref='address1TextInput'
                    keyboardType="email-address"
                    placeholder={I18n('ADDRESS_ONE')}
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
                    placeholder={I18n('ADDRESS_SECOND')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={50}
                    defaultValue={this.state.address2}
                    onChangeText={(text) => {
                        this.checkTextInput(text, this.refs.address2TextInput, I18n("COMPLETE_IN_EN"));
                        this.setState({ address2: Utils.trim(text) })
                    }}
                />
                <View  style={styles.textView}>
                    <Text style={styles.textState}>{"Singapore"}</Text>
                </View>
                <View style={styles.lineDivider} />
                <OTextInputSimple
                    ref='zipCodeTextInput'
                    keyboardType="numeric"
                    placeholder={I18n('ADDRESS_ZIP_CODE')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={20}
                    defaultValue={this.state.postcode}
                    onChangeText={(text) => {
                        this.refs.zipCodeTextInput.setErrorText("");
                        this.setState({ postcode: Utils.trim(text) })
                    }}
                />
                <OTextInputSimple
                    ref='phoneTextInput'
                    keyboardType="numeric"
                    placeholder={I18n('ADDRESS_PHONE_NUMBER')}
                    placeholderTextColor='#999999'
                    bottomLineColor='#E5E5E5'
                    maxLength={20}
                    defaultValue={this.state.phone}
                    onChangeText={(text) => {
                        this.refs.phoneTextInput.setErrorText("");
                        this.setState({ phone: Utils.trim(text) })
                    }}
                />
                <TouchableOpacity
                    style={styles.setDefaultLay}
                    onPress={() => this.onPressSetDefault(this.state.setDefault)}
                >
                    <Image style={styles.checkbox} source={this.state.checkbox} />
                    <OText
                        style={styles.setDefault}
                        text={'ADDRESSBOOK_SET_DEFAUL'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomBtn}
                    onPress={() => this.onPressConfirm(address)}
                >
                    <OText
                        style={styles.bottomBtnText}
                        text={'CONFIRM'}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    checkTextInput(text, textInput, tips) {
        if(Utils.isContainChinese(text)){
            textInput.setErrorText(tips);
            return true
        }else{
            textInput.setErrorText("");
            return false
        }
    }

    onPressSetDefault(setDefault) {
        if (setDefault) {
            this.setState({ setDefault: false, checkbox: CheckBoxNormal });
        } else {
            this.setState({ setDefault: true, checkbox: CheckBox });
        }
    }

    onPressConfirm(address) {
        this.setState({ showLoading: true });

        console.log("onPressConfirm", this.state.state, this.state.stateCode)

        if (this.state.firstname.length === 0) {
            this.refs.firstnameTextInput.setErrorText(I18n('INPUT_LAST_NAME_TIP'));
            return;
        }
        if(this.checkTextInput(this.state.firstname, this.refs.firstnameTextInput, I18n("ADDRESS_EN_NAME_TIP")))return;

        if (this.state.lastname.length === 0) {
            this.refs.lastnameTextInput.setErrorText(I18n('INPUT_FIRST_NAME_TIP'));
            return;
        }
        if(this.checkTextInput(this.state.lastname, this.refs.lastnameTextInput, I18n("ADDRESS_EN_NAME_TIP")))return;

        if (this.state.address1.length === 0) {
            this.refs.address1TextInput.setErrorText(I18n('INPUT_ADDRESS_TIP'));
            return;
        }
        if(this.checkTextInput(this.state.address1, this.refs.address1TextInput, I18n("COMPLETE_IN_EN")))return;
        if(this.checkTextInput(this.state.address2, this.refs.address2TextInput, I18n("COMPLETE_IN_EN")))return;

        if (this.state.postcode.length === 0) {
            this.refs.zipCodeTextInput.setErrorText(I18n('INPUT_ZIP_CODE_TIP'));
            return;
        }
        if (this.state.phone.length === 0) {
            this.refs.phoneTextInput.setErrorText(I18n('INPUT_PHONE_TIP'));
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
            phone: this.state.phone,
            postcode: this.state.postcode,
            setDefault: this.state.setDefault,
            state: this.state.state,
            stateCode: this.state.stateCode,
        };

        NetUtils.post(ADDRESS_UPSERT, param).then((result) => {
            console.log("ADDRESS_UPSERT", result.code);
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
            }
        });
    }

    endRefresh() {
        this.setState({ refreshing: false })
    }
}

const styles = StyleSheet.create({
    scrollBg: {
        backgroundColor: Constant.white
    },
    lineDivider: {
        height: Utils.scale(1),
        backgroundColor: Constant.divider,
    },
    bottomView: {
        width: '100%',
        marginLeft: Utils.scale(16),
    },
    textView:{
        height: Utils.scale(50),
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    textState: {
        width: '100%',
        paddingRight: Utils.scale(16),
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.blackText,
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