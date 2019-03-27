import React, { Component } from "react";
import { View, Image } from "react-native";
import { GET_USER_INFO } from "../../utils/Api"
import storage from '../../utils/StorageUtils';
import * as Constant from "../../utils/Constant"
import NetUtils from '../../utils/NetUtils'
import { Actions } from 'react-native-router-flux';

import LOGO from '../../res/images/splash.png';

import { inject, observer } from "mobx-react/native";
import Utils from "../../utils/Utils";

@inject(stores => ({
    appSetting: stores.appSetting,
    user: stores.user,
}))
@observer
export default class SplashPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getUserInfoEnd: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.getUserInfo();
        }, 2000)
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    /**
     * 从本地服务器获取用户信息
     *
     */
    getUserInfo() {
        storage.load({
            key: Constant.USER_INFO,
        }).then(ret => {
            const { store } = ret;
            if (store && store.storeId) {
                this.gotoNextPage(false);
            } else {
                Actions.reset("ApplyPartner");
            }
        }).catch(err => {
            this.gotoNextPage(true);
        });
    };

    /**
     * 跳转下一页面
     */
    gotoNextPage(toLogin) {
        if (toLogin) {
            //如果用户未登录，则跳转登录页
            Actions.reset('Login')
        } else {
            Actions.reset('HomePage')
        }
    };

    render() {
        return <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={LOGO}
                style={{ width: Utils.scale(104), height: Utils.scale(34) }}
            />
        </View>
    }
}