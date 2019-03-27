import React, { Component } from 'react';
import {
    ActivityIndicator,
    Clipboard,
    Dimensions,
    Image,
    InteractionManager,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import OText from '../OText/OText';
import I18n from '../../config/i18n'
import * as Constant from "../../utils/Constant"
import Utils from '../../utils/Utils';
import ShareIcon from './ShareIcon';
import QRCode from 'react-native-qrcode-svg';

import AppSetting from '../../store/AppSetting';
import NativeShare from '../../utils/NativeShare';
import BackIcon from '../../res/img/navi_close.png';
import TOP from '../../res/img/collection_share_top.png';
import PICK from '../../res/img/collection_share_pick.png';
import ViewShot from '../../component/ViewShot';
import NetUtils from '../../utils/NetUtils';
import * as Api from '../../utils/Api';
import Toast from '../GoodsDetailModal/Toast';
import ShopStore from "../../store/ShopStore";
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

const { width, height } = Dimensions.get('window');

export default class ShareCollectionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            modalVisible: false,
            qrCodeUrl: '',
            collectionDetail: null,
            sharePlatform: [
                {
                    text: 'SHARE_MASK_FB',
                    platform: 'FACEBOOK',
                    enable: false,
                },
                {
                    text: 'MESSENGER',
                    platform: 'FACEBOOK_MESSAGER',
                    enable: false,
                },
                {
                    text: 'STORE_DETAIL_SHARE_WECHAT',
                    platform: 'WEIXIN',
                    enable: false,
                },
                {
                    text: 'STORE_DETAIL_COMMENTS',
                    platform: 'WEIXIN_CIRCLE',
                    enable: false,
                },
                {
                    text: 'SHARE_MASK_DOWNLOAD',
                    platform: 'SHARE_MASK_DOWNLOAD',
                    enable: true
                },
                {
                    text: 'SHARE_MASK_COPY_LINK',
                    platform: 'SHARE_MASK_COPY_LINK',
                    enable: true
                },
            ]
        }
    }

    componentWillMount() {
        NativeShare.asynSupportPlatform().then((result) => {
            const supWX = result.Support_WechatSession;
            const supFB = result.Support_Facebook;
            const supMS = result.Support_FaceBookMessenger;
            let platform = JSON.parse(JSON.stringify(this.state.sharePlatform));
            platform[0].enable = supFB
            platform[1].enable = supMS
            platform[2].enable = supWX
            platform[3].enable = supWX
            this.setState({
                sharePlatform: platform
            })
        }).catch((error) => {
        });
    }

    openModal(shareData) {
        const { link } = shareData
        const params = { originUrl: link };
        const { imageUrl, headImg, storeName, collectionName, collectionId, skaCount } = shareData;

        this.setState({
            showIndicator: true,
        }, () => {
            NetUtils.post(Api.SHARE_SHORT_LINK, params).then((result) => {
                if (result && result.data && result.data.key) {
                    InteractionManager.runAfterInteractions(() => {
                        this.setState({
                            qrCodeUrl: AppSetting.BaseUrl + "/s/" + result.data.key,
                            showIndicator: false
                        })
                    })
                }
            }).catch((e) => {
                this.setState({
                    showIndicator: false
                })
            });
            InteractionManager.runAfterInteractions(() => {
                try {
                    this.setState({
                        modalVisible: true,
                        shareData
                    })
                } catch (error) {
                    console.log('====openModal===', error);
                }
            });
            if (skaCount > 3) {
                this.getCollectionDetails(collectionId)
            }
        })
    }

    getCollectionDetails(collectionId) {
        const { storeId } = ShopStore.storeInfo;

        let params = {
            storeId: storeId,
            collectionId: collectionId,
        };

        NetUtils.get(Api.STORE_COLLECTION_DETAIL, params).then((result) => {
            this.setState({ collectionDetail: result.data })
        }).catch((e) => {
            console.log('queryCollections失败', e);
        })
    }

    closeModal() {
        try {
            this.setState({
                showIndicator: false,
                modalVisible: false,
                qrCodeUrl: '',
            })
        } catch (error) {
        }
    }

    pressIcon(data) {
        try {
            this.setState({
                showIndicator: true
            }, () => {
                InteractionManager.runAfterInteractions(() => {
                    try {
                        const { platform } = data;
                        const { shareData } = this.state;
                        const { title, desc, link, imageUrl } = shareData;
                        if (platform + '' === 'SHARE_MASK_DOWNLOAD') {
                            this.refs.viewShot.capture().then(uri => {
                                this.showToast(I18n('SHARE_MASK_COPY_IMAGE'))
                                this.setState({
                                    showIndicator: false
                                })
                            });
                            return;
                        } else if (platform + '' === 'SHARE_MASK_COPY_LINK') {
                            Clipboard.setString(link)
                            this.showToast(I18n('SHARE_MASK_COPY_SUCCESS'))
                            this.setState({
                                showIndicator: false
                            })
                            //this.closeModal();
                            return;
                        }
                        let imgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553693469657&di=5d954674694de5c2d8bbab181287f4f9&imgtype=0&src=http%3A%2F%2Fpic2.zhimg.com%2F50%2Fv2-b6a750f487ddbf996fc516f1e82445fb_b.jpg';
                        if (imageUrl && imageUrl + '' != '') {
                            imgUrl = imageUrl
                        }
                        NativeShare.shareNoBoard(
                            title,
                            desc,
                            imgUrl,
                            link,
                            platform
                        ).then((msg) => {
                            this.closeModal()
                        }).catch((msg2) => {
                            this.closeModal()
                        });
                        if (Platform.OS === 'ios') {
                            this.closeModal()
                        }
                    } catch (error) {
                        this.closeModal()
                    }
                    setTimeout(() => {
                        try {
                            this.setState({
                                showIndicator: false
                            })
                        } catch (error) {
                        }
                    }, 5000)
                })
            })
        } catch (error) {
        }
    }

    renderIcon() {
        return (<View style={styles.iconView}>
            {this.state.sharePlatform.map((data, i) => {
                return (<ShareIcon
                    pressFun={() => this.pressIcon(data)}
                    key={i}
                    data={data}
                />)
            })}
        </View>)
    }

    renderIndicator() {
        if (this.state.showIndicator) {
            return (<View style={styles.indicatorView}>
                <ActivityIndicator color={Constant.themeText} />
            </View>)
        }
    }

    showToast(text) {
        this.refs.toast.show(text);
    }

    renderShotView() {
        const { shareData } = this.state;
        const { imageUrl, headImg, storeName, collectionName, skaCount } = shareData;

        return <View style={styles.viewStyle}>
            <View style={styles.shotView}>
                <ViewShot
                    ref="viewShot"
                >
                    <View style={styles.shotView}>
                        <Image
                            source={TOP}
                            style={styles.shareTitle}
                        />
                        {this.renderGoodsImage(imageUrl, skaCount)}
                        <Image
                            source={PICK}
                            style={styles.shareTitle}
                        />
                        <View style={styles.goodsDetail}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    numberOfLines={2}
                                    style={styles.textTitle}
                                >{collectionName}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri: headImg }}
                                        style={styles.storeHead}
                                    />
                                    <Text
                                        numberOfLines={2}
                                        style={styles.storeText}
                                    >{storeName}</Text>
                                </View>
                            </View>
                            {this.renderQrImage()}
                        </View>
                    </View>
                </ViewShot>
            </View>
        </View>
    }

    renderGoodsImage(imageUrl, skaCount) {
        const { collectionDetail } = this.state;
        if (collectionDetail && skaCount > 3) {
            const items = collectionDetail.items;

            return (<View>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.goodsImageSmall}
                        resizeMethod={'scale'}
                    />
                    <Image
                        source={{ uri: items[1].productImg }}
                        style={styles.goodsImageSmall}
                        resizeMethod={'scale'}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: items[2].productImg }}
                        style={styles.goodsImageSmall}
                        resizeMethod={'scale'}
                    />
                    <Image
                        source={{ uri: items[3].productImg }}
                        style={styles.goodsImageSmall}
                        resizeMethod={'scale'}
                    />
                </View>
            </View>
            )
        } else {
            return (<Image
                source={{ uri: imageUrl }}
                style={styles.goodsImage}
                resizeMethod={'scale'}
            />)
        }
    }

    renderQrImage() {
        const { qrCodeUrl } = this.state;
        if (qrCodeUrl && qrCodeUrl + '' !== '') {
            return <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                {Constant.isIOS ? null : <QRCode
                    value={qrCodeUrl}
                    size={58}
                />}
            </View>
        }
        return <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} />
    }

    renderStatBar() {
        if (Platform.OS === 'ios') {
            return <StatusBar barStyle={'default'} />
        }
        return null
    }

    renderHead() {
        return <View style={styles.header}>
            <View style={styles.titleView}>
                <OText
                    numberOfLines={1}
                    style={styles.title}
                    text={'SHARE_MASK_SHARE'}
                />
            </View>
            <TouchableOpacity
                onPress={() => this.closeModal()}>
                <View style={styles.backView}>
                    <Image
                        resizeMode={'contain'}
                        style={{
                            width: Utils.scale(22),
                            height: Utils.scale(22)
                        }}
                        source={BackIcon}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.closeModal()
                }}
            >
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        {this.renderStatBar()}
                        {this.renderHead()}
                    </View>
                    {this.state.shareData && this.renderShotView()}
                    {this.renderIcon()}
                    {this.renderIndicator()}
                </View>
                <Toast ref="toast" />
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    viewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f2f2f2',
        paddingTop: Utils.scale(13),
        paddingBottom: Utils.scale(13),
        flex: 1,
    },
    shotView: {
        width: Utils.scale(225),
        height: Utils.scale(400),
        backgroundColor: 'white',
        alignItems: 'center'
    },
    earnView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Utils.scale(12),
        justifyContent: 'center'
    },
    earnText: {
        color: Constant.themeText,
        fontSize: Constant.largeSize,
    },
    detailText: {
        fontSize: Constant.smallSize,
        marginLeft: Utils.scale(38),
        marginRight: Utils.scale(38),
        textAlign: 'center',
    },
    iconView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: Utils.scale(17),
        paddingRight: Utils.scale(17),
        height: Utils.scale(178),
    },
    skip: {
        backgroundColor: '#f2f2f2',
        width: '100%',
        height: Utils.scale(10),
    },
    cancelBtn: {
        width: '100%',
        height: Utils.scale(53),
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorView: {
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    container: {
        flex: 1,
        backgroundColor: Constant.mainBackgroundColor,
        width: width,
        height: height,
        paddingBottom: Constant.paddingIPXBottom
    },
    headerView: {
        backgroundColor: '#FFFFFF',
        height: Constant.sizeHeader,
    },
    header: {
        justifyContent: 'space-between',
        width: width,
        marginTop: Constant.sizeHeaderMarginTop,
        flexDirection: 'row',
        height: Constant.sizeHeaderContent,
        alignItems: 'center',

    },
    titleView: {
        left: 0,
        top: 0,
        height: Constant.sizeHeaderContent,
        position: 'absolute',
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: Utils.scale(17),
        width: '65%',
        textAlign: 'center'
    },
    backView: {
        justifyContent: 'center',
        paddingLeft: Utils.scale(10),
        width: Utils.scale(50),
        flex: 1,
    },
    rightView: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: Utils.scale(15),
        alignItems: 'flex-end',
        minWidth: Utils.scale(50)
    },
    backTouch: {
        left: Utils.scale(11),
        top: Utils.scale(46),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: Utils.scale(32),
        height: Utils.scale(32),
        borderRadius: Utils.scale(16),
        backgroundColor: '#ffffff',
        opacity: 0.8,
    },
    backImage: {
        width: Utils.scale(22),
        height: Utils.scale(22)
    },
    shareTitle: {
        width: '100%',
        height: Utils.scale(50),
        resizeMode: ImageResizeMode.contain,
    },
    textTitle: {
        width: Utils.scale(138),
        height: Utils.scale(40),
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
        fontWeight: 'bold'
    },
    storeHead: {
        width: Utils.scale(20),
        height: Utils.scale(20),
        borderRadius: Utils.scale(10),
    },
    storeText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        width: Utils.scale(120),
        color: Constant.grayText,
    },
    goodsImage: {
        width: Utils.scale(205),
        height: Utils.scale(205),
        marginTop: Utils.scale(4),
        resizeMode: 'contain'
    },
    goodsImageSmall: {
        width: Utils.scale(100),
        height: Utils.scale(100),
        marginTop: Utils.scale(4),
        resizeMode: 'contain'
    },
    qrImg: {
        width: Utils.scale(48),
        height: Utils.scale(48),
    },
    goodsDetail: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingLeft: Utils.scale(9),
        paddingRight: Utils.scale(9),
        paddingBottom: Utils.scale(9),
    },
})  