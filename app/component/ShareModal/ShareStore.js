import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    InteractionManager,
    ActivityIndicator,
    Dimensions,
    Modal,
    Text,
    TouchableOpacity,
} from 'react-native';

import OText from '../OText/OText';
import I18n, { priceTranslations } from '../../config/i18n'
import * as Constant from "../../utils/Constant"
import Utils from '../../utils/Utils';
const height = Dimensions.get('window').height
import ShareIcon from './ShareIcon';
import NativeShare from '../../utils/NativeShare';
import { inject, observer } from 'mobx-react/native';


export default class ShareStore extends Component {

    // //默认属性
    // static defaultProps = {
    //     shareData: {
    //         title: "仅需$28即可获得THREE RUNNERS 【2件起售】夏威夷果265g",
    //         desc: "ailsa的商品七天包退，包邮到北美，百分百正品，此时不买更待何时！~",
    //         imageUrl: "https://a.vimage1.com/upload/merchandise/pdcvis/10…f84565-8513-4797-bd2a-40db3b4b900a_384x484_70.jpg",
    //         link: "http://10.100.225.212:7080/detail/1/V2",
    //         commissionText: "$undefined"
    //     }
    // };

    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            modalVisible: false,
            sharePlatform: [{
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
        InteractionManager.runAfterInteractions(() => {
            try {
                this.setState({
                    modalVisible: true,
                    shareData
                })
            } catch (error) {
                console.log('====openModal===', error);
            }
        })
    }

    closeModal() {
        try {
            this.setState({
                showIndicator: false,
                modalVisible: false,
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
                        this.setState({
                            showIndicator: false
                        })
                    }, 10000)
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

    renderEarnText() {
        const { shareData } = this.state;
        if (shareData && shareData.commissionText && shareData.commissionText !== '') {
            return (
                <View>
                    <View style={styles.earnView}>
                        <OText
                            text={'STORE_DETAIL_SHARE_GET'}
                            style={styles.earnText}
                            option1={{ commissionText: shareData.commissionText }}
                        />

                    </View>
                    <OText
                        style={styles.detailText}
                        text={'STORE_DETAIL_SHARE_GET_TIP'}
                        option1={{ commissionText: shareData.commissionText }}
                    />
                </View>
            )
        } else {
            return <View />
        }
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { }}
                style={{ zIndex: 10000 }}
            >
                <View
                    style={styles.touchBg}
                >
                    <View style={styles.viewStyle}>
                        {this.renderEarnText()}
                        {this.renderIcon()}
                        <View style={styles.skip} />
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => this.closeModal()}
                        >
                            <OText text={'CART_DELETE_NO'} />
                        </TouchableOpacity>
                    </View>
                    {this.renderIndicator()}

                </View>
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
    touchBg: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(90,90, 54, 0.5)',
        justifyContent: 'flex-end'
    },
    viewStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: Utils.scale(21),
        width: '100%',
        backgroundColor: 'white',
        //flex: 1,
        height: Utils.scale(375),
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
        paddingTop: Utils.scale(3),
        flex: 1
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
    }
})  