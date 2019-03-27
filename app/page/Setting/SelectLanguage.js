import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native'
import SelectCell from '../Setting/SelectCell'
import I18n from "../../config/i18n";
import CommonHeader from '../../component/Header/CommonHeader';
import OText from "../../component/OText/OText";
import Utils from "../../utils/Utils";
import { Actions } from 'react-native-router-flux';
import { toJS } from 'mobx';
import { inject, observer } from "mobx-react/native";
import NetUtils from '../../utils/NetUtils';
import Toast from '../../component/Toast';
import Api, { CHANGE_LANG } from '../../utils/Api';
import Storage from "../../utils/StorageUtils";
import * as Constant from "../../utils/Constant"

@inject(stores => ({
    user: stores.user,
    appSetting: stores.appSetting,
    homeStore: stores.homeStore,
    shopCartStore: stores.shopCartStore,
    shopStore: stores.shopStore,
    salesListStore:stores.salesListStore,
}))
@observer
export default class SelectLanguage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            languageList: toJS(props.appSetting.languageList)
        };
    }

    render() {
        const { languageList } = this.state;
        return (
            <CommonHeader
                title={I18n('STORE_PERSONAL_SETTING_LANGUAGE')}
                rightView={this.titleRightView()}
            >
                {
                    languageList && languageList.length > 0 && languageList.map((obj, index) => {
                        const { title, isSelect } = obj;
                        return (
                            <View key={index}>
                                <SelectCell
                                    title={title}
                                    isSelect={isSelect}
                                    onPress={() => this.onPressSelect(index)}
                                />
                                <View style={styles.line} />
                            </View>
                        )
                    })
                }
            </CommonHeader>
        );
    }

    titleRightView() {
        return (
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    paddingRight: Utils.scale(10),
                    width: Utils.scale(50),
                    alignItems: 'center',
                    height: '100%'
                }}
                onPress={() => this.onPressRight()}
            >
                <OText text={'SETTING_SAVE'} />
            </TouchableOpacity>
        )
    }

    onPressRight() {
        let tempList = new Array().concat(this.state.languageList);
        let language = tempList[0];
        for (let index in tempList) {
            if (tempList[index].isSelect) {
                language = tempList[index];
                break;
            }
        }

        // let language = tempList[selectIndex];
        let param = { 'lang': 'EN' };
        if (language.code === 'zh_cn') {
            param = { 'lang': 'ZH' };
        }
        NetUtils.post(CHANGE_LANG, param).then((result) => {
            if (result.code === 0) {
                this.props.appSetting.setLanguageList(this.state.languageList, () => this.resetFun());
            }
        }).catch((error) => {
            Toast.show(error.msg);
        });
    }

    resetFun() {
        Storage.remove({
            key: Constant.HOME_CAT_DATA
        });
        Storage.remove({
            key: Constant.HOME_LIST_DATA
        });
        this.props.homeStore.resetHome();
        this.props.shopStore.resetShop();
        this.props.shopCartStore.resetCart();
        this.props.salesListStore.resetData();
        Actions.reset('Splash')
    }

    onPressSelect(selectIndex) {
        let tempList = new Array().concat(this.state.languageList);

        for (let index in tempList) {
            if (selectIndex + '' === '' + index) {
                tempList[index].isSelect = true;
            } else {
                tempList[index].isSelect = false;
            }
        }
        this.setState({
            languageList: tempList,
        });
    }
}

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: '#E5E5E5',
    },
})