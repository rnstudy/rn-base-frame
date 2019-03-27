import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import * as Constant from '../../utils/Constant'
import OText from '../OText/OText';
import Modal from '../Modal/ModalBox';
import Utils from '../../utils/Utils';

export default class ErrorPage extends Component {

    openModal() {
        try {
            this.refs.modal && this.refs.modal.open()
        } catch (error) {
            console.log('=======', error);
        }
    }

    closeModal() {
        try {
            this.refs.modal && this.refs.modal.close()
        } catch (error) {
            console.log('=======', error);
        }
    }

    pressReload() {
        this.props.reload && this.props.reload()
    }

    render() {
        return (
            <Modal
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%'
                }}
                ref={"modal"}
                swipeToClose={false}
                backdropPressToClose={false}
                animationDuration={1}
            >
                <View style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: Constant.mainBackgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../res/img/oops_network_error.png')} />

                    <OText
                        style={{ color: Constant.grayText }}
                        text={'normalNetworkError'}
                    />

                    <TouchableOpacity
                        style={{
                            width: Utils.scale(110),
                            height: Utils.scale(32),
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: Constant.themeText,
                            borderRadius: Utils.scale(16),
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: Utils.scale(38)
                        }}
                        onPress={() => this.pressReload()}
                        activeOpacity={1}
                    >
                        <OText
                            style={{ color: Constant.grayText }}
                            text={'tryAgain'}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

ErrorPage.propTypes = {
    reload: PropTypes.func,
}

ErrorPage.defaultProps = {
    reload: () => { },
}
