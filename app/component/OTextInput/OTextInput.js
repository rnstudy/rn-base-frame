import React, { Component } from 'react'
import { TextInput, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import * as Constant from "../../utils/Constant"
import Screen from '../../utils/Screen'
import PropTypes from 'prop-types';
import I18n from '../../config/i18n'
import Utils from "../../utils/Utils";

export default class OTextInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: '',
            showPw: false,
            leftSeconds: 0,
        };

        this.secondsCount = 60;
    }

    /**
     * React-Native TextInput不支持输入中文解决办法
     * https://www.jianshu.com/p/49544321295e
     * 当TextInput的键盘为拼音输入时，value 和 defaultValue的值还是显示字母
     */
    shouldComponentUpdate(nextProps) {
        // console.log('shouldComponentUpdate');
        return Constant.isIOS === false ||
            // (this.props.value === nextProps.value && (nextProps.value == undefined || nextProps.value == '')) ||
            (this.props.defaultValue === nextProps.defaultValue && (nextProps.defaultValue == undefined || nextProps.defaultValue == ''));
    }

    render() {
        return (
            <View style={[this.props.layoutStyle]}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        {...this.props}
                        autoCorrect={false}
                        style={{ fontSize: 16, color: this.props.textColor, flex: 1, padding: 0 }}
                        secureTextEntry={this.props.isPassword && !this.state.showPw}
                        underlineColorAndroid='transparent'
                        ref='OTextInput'
                    />
                    {
                        this.props.isPassword ?
                            <TouchableOpacity style={{
                                paddingLeft: 6,
                                paddingTop: 3,
                                paddingBottom: 3
                            }}
                                activeOpacity={1}
                                onPress={() => this.setState({ showPw: !this.state.showPw })}>
                                <Image style={{ tintColor: '#333' }}
                                    source={this.state.showPw ? require('../../res/img/pw_visiable.png') : require('../../res/img/pw_invisiable.png')} />
                            </TouchableOpacity>
                            :
                            null
                    }

                    {
                        this.props.isVerification ?
                            <TouchableOpacity style={[{ borderColor: this.state.leftSeconds > 0 ? Constant.divider : Constant.bottomBtnBg }, styles.verificationLayout]} activeOpacity={1}
                                onPress={() => {
                                    if (this.state.leftSeconds <= 0) {
                                        this.props.pressRegain();
                                    }
                                }}>
                                <Text style={[{ color: this.state.leftSeconds > 0 ? '#666' : Constant.bottomBtnBg, }, styles.verificationTxt]}>{this.state.leftSeconds > 0 ? this.state.leftSeconds + 's' : I18n('LOGIN.CONFIRM_VERIFICATION_REGET')}</Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
                <View style={{ backgroundColor: this.state.errorText ? Constant.errorTxt : this.props.bottomLineColor, height: 1, marginTop: 10 }} />
                <Text style={styles.errorText}>{this.state.errorText}</Text>
            </View>
        )
    }

    componentWillUnmount() {
        this.stop();
        this.interval && clearTimeout(this.interval);
    }

    start() {
        this.startTime = Date.now();
        this.setState({ leftSeconds: this.secondsCount })
        this.interval = setInterval(() => {
            if (this.state.leftSeconds > 0) {
                let timeCount = Math.round((Date.now() - this.startTime) / 1000);

                this.setState({ leftSeconds: this.secondsCount - timeCount });
            } else {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    setErrorText(errorText) {
        this.setState({ errorText: errorText })
    }

    setFocus() {
        this.refs.OTextInput && this.refs.OTextInput.focus && this.refs.OTextInput.focus()
    }

    setClear() {
        if (Constant.isIOS) {
            this.refs.OTextInput && this.refs.OTextInput.setNativeProps({ text: ' ' })
            setTimeout(() => {
                this.refs.OTextInput.setNativeProps({ text: '' })
            }, 5)
        } else {
            this.refs.OTextInput && this.refs.OTextInput.clear && this.refs.OTextInput.clear()
        }
    }

    setBlur() {
        this.refs.OTextInput && this.refs.OTextInput.blur && this.refs.OTextInput.blur()
    }

    setText(text) {
        this.refs.OTextInput && this.refs.OTextInput.setNativeProps({ text: text })
    }
}

OTextInput.propTypes = {
    isPassword: PropTypes.bool,
    isVerification: PropTypes.bool,
    textColor: PropTypes.string,
    bottomLineColor: PropTypes.string,
    pressRegain: PropTypes.func,
}

OTextInput.defaultProps = {
    layoutStyle: {},
    autoCapitalize: "none", //不自动大写
    isPassword: false,
    isVerification: false,
    textColor: '#333',
    bottomLineColor: Constant.divider,
    pressRegain: () => { },
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(3),
        backgroundColor: '#0000',
        color: Constant.errorTxt
    },

    verificationLayout: {
        width: 80,
        height: Utils.scale(32),
        marginLeft: 6,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    verificationTxt: {
        textAlign: 'center',
        fontSize: Utils.scaleFontSizeFunc(14),
        backgroundColor: '#0000'
    },

})