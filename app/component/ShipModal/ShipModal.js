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
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import OText from '../OText/OText';
import I18n, { priceTranslations } from '../../config/i18n';
import CLOSE_ICON from '../../res/img/navi_close.png';
import * as Constant from "../../utils/Constant"
import Utils from '../../utils/Utils';
const { width, height } = Dimensions.get('window');
import { inject, observer } from 'mobx-react/native';
import DEC_ICON from '../../res/img/cart_dec.png';
import ADD_ICON from '../../res/img/cart_add.png';
import Toast from '../../component/Toast';

export default class GoodsDetailModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            postageSettingList: null,
            localHouse: false
        }
    }

    openModal(postageSettingList, localHouse) {
        InteractionManager.runAfterInteractions(() => {
            try {
                this.setState({
                    modalVisible: true,
                    postageSettingList,
                    localHouse
                })
            } catch (error) {
                console.log('====openModal===', error);
            }
        })
    }

    closeModal() {
        try {
            this.setState({
                modalVisible: false,
            })
        } catch (error) {
        }
    }

    renderDetail() {
        const { postageSettingList, localHouse } = this.state;
        const title = localHouse ? 'CART_FREE_SHIPPING_TITLE' : 'CART_UPGRADE_SHIPPING_TITLE'
        if (postageSettingList && postageSettingList.length > 0) {
            return <View style={styles.detailView}>
                <View style={{ alignItems: 'center', width: '100%', marginBottom: Utils.scale(10) }}>
                    <OText
                        text={title}
                        style={styles.titleText}
                    />
                </View>

                {postageSettingList.map((obj, index) => {
                    const { title, text } = obj;
                    return <View
                        style={{ width: '100%', }}
                        key={index + title}
                    >
                        <Text style={styles.detailTitle}>{title}</Text>
                        <Text style={styles.detailText}>{text}</Text>
                    </View>
                })}
            </View>
        }
        return <View >
        </View>
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { }}
            >
                <View
                    style={styles.touchBg}
                >
                    <TouchableOpacity
                        style={styles.touchCancel}
                        onPress={() => this.closeModal()}
                    >
                        <TouchableWithoutFeedback >
                            <View style={styles.viewStyle}>
                                {this.renderDetail()}
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => this.closeModal()}
                                >
                                    <OText
                                        text={'CART_I_SEE'}
                                        style={styles.cancelText}
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
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
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flex: 1,
    },
    touchCancel: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Utils.scale(20),
        width: Utils.scale(320),
        backgroundColor: 'white',
        borderRadius: 10,
        minHeight: Utils.scale(170),
    },
    cancelBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Utils.scale(54),
        borderColor: "#e5e5e5",
        borderTopWidth: StyleSheet.hairlineWidth,
        width: '100%'
    },
    cancelText: {
        color: "#cd0e00",
        fontSize: Utils.scaleFontSizeFunc(16)
    },
    titleText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
    },
    detailView: {
        justifyContent: 'flex-start',
        paddingLeft: Utils.scale(20),
        paddingRight: Utils.scale(20),
        alignItems: 'flex-start',
        width: '100%'
    },
    detailTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
        fontWeight: 'bold',
        marginBottom: Utils.scale(5),
        width: '100%'
    },
    detailText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginBottom: Utils.scale(10),
        width: '100%',
    },
})  