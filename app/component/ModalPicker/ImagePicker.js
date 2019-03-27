import React, { Component } from 'react';
import { Dimensions, Image, Text, InteractionManager, Modal, StyleSheet, TouchableOpacity, View, } from 'react-native';

import OText from '../OText/OText';
import * as Constant from "../../utils/Constant"
import { white } from "../../utils/Constant"
import Utils from '../../utils/Utils';
import ICON from '../../res/img/icon_tips.png';
import I18n from '../../config/i18n'

const width = Dimensions.get('window').width


export default class ImagePicker extends Component {

    static defaultProps = {
        userHead: true
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        }
    }

    openModal() {
        InteractionManager.runAfterInteractions(() => {
            try {
                this.setState({
                    modalVisible: true,
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

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.closeModal()}
            >
                <TouchableOpacity
                    style={styles.touchBg}
                    onPress={() => this.closeModal()}
                >
                    <View style={styles.viewStyle}>
                        {this.props.userHead ? <View style={styles.wrap_row}>
                            <Image style={styles.icon} source={ICON} />
                            {/* <OText style={styles.tips} text={'USER_AVATER_AUDIT_TIPS'} /> */}
                            {/* // */}
                            <Text style={styles.tips} numberOfLines={0}>{I18n('USER_AVATER_AUDIT_TIPS')}</Text>
                        </View> : null}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.props.onChoosePhoto()}
                        >
                            <OText text={'PHOTO_ALBUM'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.props.onTakePhoto()}
                        >
                            <OText text={'TAKE_PHOTO'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => this.closeModal()}
                        >
                            <OText text={'CART.CART_DELETE_NO'} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
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
    wrap_row: {
        width: width,
        height: Utils.scale(60),
        paddingTop: Utils.scale(16),
        paddingBottom: Utils.scale(16),
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(32),
        flexDirection: 'row',
        backgroundColor: white,
        alignItems: 'center',
    },
    icon: {
        width: Utils.scale(16),
        height: Utils.scale(16),
        marginRight: Utils.scale(12)
    },
    tips: {
        width: width - Utils.scale(60),
        height: Utils.scale(30),
        fontSize: Utils.scale(12),
        color: Constant.lightText,
        // backgroundColor: 'red',
    },
    viewStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f2f2f2',
        maxHeight: Utils.scale(224),
    },
    btn: {
        width: '100%',
        height: Utils.scale(53),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: white,
        marginTop: Utils.scale(1)
    },
    cancelBtn: {
        width: '100%',
        height: Utils.scale(51),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Utils.scale(10),
        backgroundColor: white,
    },
})