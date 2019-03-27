import React, { Component } from 'react';
import { Button, Dimensions, Image, InteractionManager, Modal, StyleSheet, TouchableOpacity, View, } from 'react-native';

import OText from '../OText/OText';
import * as Constant from "../../utils/Constant"
import Utils from '../../utils/Utils';
import { white } from "../../utils/Constant";
import ICON from '../../res/img/icon_tips.png';
import { themeText } from "../../utils/Constant";

const height = Dimensions.get('window').height


export default class CollectionPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: null,
        }
    }

    openModal(data) {
        InteractionManager.runAfterInteractions(() => {
            try {
                this.setState({
                    modalVisible: true,
                    data: data,
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
            console.log('====closeModal===', error);
        }
    }

    render() {
        const { data } = this.state
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
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                this.closeModal()
                                this.props.onEdit(data)
                            }}
                        >
                            <OText style={styles.text} text={'ADDRESS_BOOK_EDIT'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                this.closeModal()
                                this.props.onShare(data)
                            }}
                        >
                            <OText style={styles.text} text={'SHARE_MASK_SHARE'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                this.closeModal()
                                this.props.onDelete(data)
                            }}
                        >
                            <OText style={[styles.text, { color: themeText }]} text={'ADDRESS_BOOK_DELETE'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => this.closeModal()}
                        >
                            <OText style={styles.text} text={'CART_DELETE_NO'} />
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
    viewStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f2f2f2',
        height: Utils.scale(224),
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
    text: {
        fontSize: Utils.scale(16),
    }
})