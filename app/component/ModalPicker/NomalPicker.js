import React, { Component } from 'react';
import { Button, Dimensions, Image, InteractionManager, Modal, StyleSheet, TouchableOpacity, View, } from 'react-native';

import OText from '../OText/OText';
import * as Constant from "../../utils/Constant"
import Utils from '../../utils/Utils';
import { white } from "../../utils/Constant";
import ICON from '../../res/img/icon_tips.png';

const height = Dimensions.get('window').height


export default class NomalPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: props.data
        }
    }

    open(data) {
        InteractionManager.runAfterInteractions(() => {
            try {
                this.setState({
                    modalVisible: true,
                    data: data || this.state.data
                })
            } catch (error) {
            }
        })
    }

    close() {
        try {
            this.setState({
                modalVisible: false,
            })
        } catch (error) {
        }
    }


    render() {
        const { initValue } = this.props;
        const { data } = this.state;
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.closeModal()}
            >
                <View
                    style={styles.touchBg}
                >
                    <View style={styles.viewStyle}>
                        {data.map((obj, index) => {
                            const color = initValue && initValue === obj ? [styles.text, { color: Constant.themeText }] : styles.text;
                            return <TouchableOpacity
                                key={index}
                                style={styles.btn}
                                onPress={() => this.props.press && this.props.press(obj, index)}
                            >
                                <OText
                                    style={color}
                                    text={obj}
                                />
                            </TouchableOpacity>
                        })}
                    </View>
                    <View style={{ width: '100%', height: Utils.scale(16), backgroundColor: Constant.boldLine }} />
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => this.close()}
                    >
                        <OText
                            style={styles.text}
                            text={'SHARE_MASK_CANCEL'}
                        />
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
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(90,90, 54, 0.5)',
        justifyContent: 'flex-end'
    },
    wrap_row: {
        width: '100%',
        height: Utils.scale(60),
        paddingTop: Utils.scale(16),
        paddingBottom: Utils.scale(16),
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        flexDirection: 'row',
        backgroundColor: white
    },
    icon: {
        width: Utils.scale(16),
        height: Utils.scale(16),
        marginRight: Utils.scale(12)
    },
    tips: {
        fontSize: Utils.scale(12),
        color: Constant.lightText
    },
    viewStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f2f2f2',
    },
    btn: {
        width: '100%',
        height: Utils.scale(53),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: white,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e5e5e5'
    },
    cancelBtn: {
        width: '100%',
        height: Utils.scale(51),
        fontSize: Utils.scale(16),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Utils.scale(10),
        backgroundColor: white,
    },
    text: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.blackText
    }
})