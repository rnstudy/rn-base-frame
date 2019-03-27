import React, { Component } from 'react';
import {
    Alert,
    DeviceEventEmitter,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    InteractionManager,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import ArrowRight from '../../res/img/arrow_right.png';
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import IconEdit from '../../res/img/icon_edit.png';
import HEAD_ICON from '../../res/images/default_head.png';
const { width, height } = Dimensions.get('window');
import SHARE_STORE_RED from '../../res/img/share_store_red.png';
import MagPro from '../../res/img/icon_manage_product.png';
import MagCollection from '../../res/img/icon_manage_collection.png';
import SkipView from '../../component/StoreProductItem/SkipView';

import { inject, observer } from 'mobx-react/native';
import { white } from "../../utils/Constant";

@inject(stores => ({
    shopStore: stores.shopStore,
}))
@observer
export default class StoreInfoHead extends Component {

    pressHead() {
        if (this.props.shopStore.isFrozen) {
            return;
        }
        Actions.push('AccountInfo')
    }

    pressHeadInfo() {
        Actions.push('StoreInfo')
    }

    //渲染
    render() {
        let imgUri = HEAD_ICON;
        let headUri = HEAD_ICON;
        const { headImgUrl, coverImgUrl } = this.props.shopStore.storeInfo
        if (coverImgUrl && coverImgUrl + '' !== '') {
            imgUri = { uri: coverImgUrl }
        } else if (headImgUrl && headImgUrl + '' !== '') {
            imgUri = { uri: headImgUrl }
        }

        if (headImgUrl && headImgUrl + '' !== '') {
            headUri = { uri: headImgUrl }
        }
        const { storeName, note, storeId } = this.props.shopStore.storeInfo
        return <View>
            <View style={{ height: Utils.scale(408), width: '100%' }}>
                <TouchableOpacity onPress={() => {
                    this.props.openModal()
                }}>
                    <ImageBackground
                        style={styles.headBackground}
                        source={imgUri}
                    >{this.props.showBgText ? <OText
                        style={{ fontSize: Utils.scaleFontSizeFunc(14), color: 'white' }}
                        text={'STORE_MANAIGE_AUDITING'
                        } /> : null}</ImageBackground>
                </TouchableOpacity>

                <View style={styles.storeDetailBackground} />
                <View style={styles.storeDetailView}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => this.pressHead()}
                            style={styles.headTouch}
                        >
                            <Image
                                style={styles.headImage}
                                source={headUri}
                            />
                        </TouchableOpacity>
                        <View style={{ marginTop: Utils.scale(28), marginLeft: Utils.scale(10) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    numberOfLines={1}
                                    style={styles.storeNameStyle}
                                >{storeName}</Text>
                                <TouchableOpacity
                                    onPress={() => this.pressHeadInfo()}
                                >
                                    <Image
                                        style={{ height: Utils.scale(18), width: Utils.scale(18), marginLeft: Utils.scale(6) }}
                                        source={IconEdit}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={styles.storeIdText}
                            >ID {storeId}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            this.props.pressShareStore()
                        }}
                        hitSlop={{ top: 10, left: 20, bottom: 20, right: 20 }}
                    >
                        <Image
                            source={SHARE_STORE_RED}
                            style={{ width: Utils.scale(22), height: Utils.scale(22), }}
                        />
                    </TouchableOpacity>
                </View>
                <Text
                    style={styles.storeNoteText}
                    numberOfLines={3}
                >
                    {note}
                </Text>
                <View style={styles.manageView}>
                    <TouchableOpacity
                        onPress={() => {
                            Actions.push('MyStoreGoods')
                        }}
                        style={styles.manageTouch}
                    >
                        <Image source={MagPro} style={styles.imgManage} />
                        <OText text={'STORE_MANAGE_MANAGE'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.manageTouch}
                        onPress={() => {
                            Actions.push('CollectionList', { isEdit: true })
                        }}
                    >
                        <Image source={MagCollection} style={styles.imgManage} />
                        <OText text={'STORE_MANAGE_COLLECTION'} />
                    </TouchableOpacity>
                </View>
            </View>
            <SkipView />
        </View>
    }
};

const styles = StyleSheet.create({
    headBackground: {
        width: "100%",
        height: Utils.scale(180),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headTouch: {
        width: Utils.scale(80),
        height: Utils.scale(80),
        borderRadius: Utils.scale(16),
        backgroundColor: white,
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowRadius: 8,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        //让安卓拥有灰色阴影
        elevation: 2,
        zIndex: Utils.isIOS() ? 1 : 0
    },
    headImage: {
        width: Utils.scale(80),
        height: Utils.scale(80),
        borderRadius: Utils.scale(16),
    },
    storeDetailView: {
        flexDirection: 'row',
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: Utils.scale(148),
        width: '100%'
    },
    storeDetailBackground: {
        backgroundColor: 'white',
        width: '100%',
        height: Utils.scale(244),
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderTopLeftRadius: Utils.scale(10),
        borderTopRightRadius: Utils.scale(10),
    },
    imgManage: {
        width: Utils.scale(26),
        height: Utils.scale(26),
        marginBottom: Utils.scale(9)
    },
    storeNameStyle: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.blackText,
        maxWidth: 0.47 * width
    },
    storeIdText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText,
        marginTop: 2,
    },
    storeNoteText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.lightText,
        marginTop: Utils.scale(60),
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        height: Utils.scale(60),
    },

    storeNote: {
        fontSize: Constant.smallSize,
        color: 'white',
        marginTop: Utils.scale(5),
        marginLeft: Utils.scale(12),
        marginRight: Utils.scale(12)
    },
    shareBtn: {
        position: 'absolute',
        top: 10,
        right: 0
    },
    shareView: {
        width: Utils.scale(80),
        height: Utils.scale(27),
        borderTopLeftRadius: Utils.scale(14),
        borderBottomLeftRadius: Utils.scale(14),
        borderTopRightRadius: 1,
        borderBottomRightRadius: 1,
        backgroundColor: Constant.themeText,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    shareText: {
        color: 'white',
        fontSize: Constant.miniSize,
        marginRight: Utils.scale(6),
        marginLeft: Utils.scale(5),
    },
    shareIcon: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(4),
    },
    manageTouch: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Utils.scale(164),
        height: Utils.scale(80),
        borderRadius: Utils.scale(8),
        backgroundColor: white,
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowRadius: 8,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        //让安卓拥有灰色阴影
        elevation: 2,
        zIndex: Utils.isIOS() ? 1 : 0
    },
    manageView: {
        flexDirection: 'row',
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        justifyContent: 'space-around',
    }
});