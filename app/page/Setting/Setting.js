import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import SettingCell from '../Setting/SettingCell'
import I18n from '../../config/i18n'
import DeviceInformation from "../../utils/DeviceInformation";
import { Actions } from 'react-native-router-flux';
import Storage from '../../utils/StorageUtils';
import * as Constant from "../../utils/Constant";
import CommonHeader from '../../component/Header/CommonHeader';
import { inject, observer } from 'mobx-react/native';
import HttpCache from '../../utils/HttpCache';
import SelectLanguage from './SelectLanguage';
import Utils from '../../utils/Utils';

@inject(stores => ({
    user: stores.user,
    appSetting: stores.appSetting,
    homeStore: stores.homeStore,
    shopCartStore: stores.shopCartStore,
    shopStore: stores.shopStore,
    salesListStore: stores.salesListStore,
    teamStore: stores.teamStore,
}))
@observer
export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChangePwd: false,
        };
    }

    componentWillMount() {
        this.props.shopStore.getStoreInfo();
    }

    componentDidMount() {
        this.getData().then((sizeObj) => {
            this.setState({
                allCache: sizeObj.allSize,
            })
        });

        Storage.load({
            key: Constant.LOGIN_TYPE,
        }).then(ret => {
            if (ret + '' === '200') {
                this.setState({
                    showChangePwd: true,
                })
            } else {
                this.setState({
                    showChangePwd: false,
                })
            }
        }).catch(err => {
            this.setState({
                showChangePwd: false,
            })
        });
    }

    render() {
        let addressBookTitle = I18n('STORE_PERSONAL_SETTING_ADDRESS_BOOK');
        let changePasswordTitle = I18n('STORE_PERSONAL_SETTING_CHANGE_PASSWORD');
        let isFrozen = this.props.shopStore.isFrozen;
        return (
            <CommonHeader title={I18n('STORE_PERSONAL_SETTING_SETTING')}>
                <View style={{ backgroundColor: '#F2F2F2', flex: 1 }}>
                    <View style={styles.boldLine} />

                    {/* 地址本 */}
                    <SettingCell
                        title={addressBookTitle}
                        showArrow={'true'}
                        onPress={() =>  this.toAddressBook()}
                    />
                    <View style={styles.line} />

                    {/* 修改密码 */}
                    <SettingCell
                        title={changePasswordTitle}
                        showArrow={'true'}
                        onPress={() => this.toChangePassword()} />
                    <View style={styles.boldLine} />
                 
                    {/* <View style={styles.boldLine} /> */}

                    {/*清除缓存*/}
                    <SettingCell
                        title={I18n('STORE_PERSONAL_SETTING_CLEAR_CACHE')}
                        content={this.state.allCache + 'M'}
                        showArrow='true'
                        onPress={() => this.clearCache()}
                    />
                    <View style={styles.line} />

                    {/*当前版本*/}
                    <SettingCell
                        title={I18n('STORE_PERSONAL_SETTING_VERSION')}
                        content={DeviceInformation.getAppVersion()}
                        showArrow='false' />
                    <View style={styles.boldLine} />

                    {/*退出登录 */}
                    <SettingCell
                        title={I18n('STORE_PERSONAL_SETTING_SIGN_OUT')}
                        showArrow='false'
                        onPress={() => this.onLogoutPress()}
                    />
                </View>
            </CommonHeader>
        );
    }

    // 初始化参数
    async getData() {
        try {
            // let httpSize = await CacheManager.getHttpCacheSize();
            // let imgSize = await CacheManager.getImageCacheSize();
            let allSize = await HttpCache.getCacheSize();
            console.log('+++allSize+', allSize)
            allSize = allSize / 1000 / 1000;

            return {
                //     httpSize,
                //     imgSize,
                allSize: allSize.toFixed(1)
            }
        } catch (err) {
            console.log('初始化参数错误', err.message);
        }
    }

    // 地址本
    toAddressBook() {
        Actions.push('AddressBook');
    }

    // 修改密码
    toChangePassword() {
        Actions.push('ForgotPassword');
    }

    // 清除缓存
    async clearCache() {
        try {
            await HttpCache.clearCache();
            this.setState({
                allCache: 0,
            })

        } catch (err) {
            console.log('清除缓存错误', err.message);
        }
    }

    // 退出登录
    onLogoutPress() {
        Storage.remove({
            key: Constant.USER_INFO
        });
        Storage.remove({
            key: Constant.LOGIN_TYPE
        });
        Storage.remove({
            key: Constant.HOME_CAT_DATA
        });
        Storage.remove({
            key: Constant.HOME_LIST_DATA
        });
        Storage.remove({
            key: Constant.SHOP_STORE_INFO
        });
        this.props.homeStore.resetHome();
        this.props.shopStore.resetShop();
        this.props.shopCartStore.resetCart();
        this.props.salesListStore.resetData();
        this.props.user.resetData();
        this.props.teamStore.resetData();
        Actions.reset('Login');
    }
}

const styles = StyleSheet.create({
    boldLine: {
        height: 10,
        backgroundColor: '#F2F2F2',
    },
    line: {
        height: Utils.scale(0.5),
        backgroundColor: '#E5E5E5',
    }
})