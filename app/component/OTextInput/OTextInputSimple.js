import React, {PureComponent} from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import * as Constant from "../../utils/Constant"
import PropTypes from 'prop-types';
import Utils from "../../utils/Utils";

export default class OTextInputSimple extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            errorText: '',
            showPw: false,
            leftSeconds: 0,
        };

        this.secondsCount = 60;
    }

    render() {
        let showError = this.state.errorText && this.state.errorText.length > 0;
        return (
            <View style={showError ? styles.inputError : styles.input}>
                <TextInput
                    autoCorrect={false}
                    style={{
                        height: Utils.scale(49),
                        fontSize: Utils.scaleFontSizeFunc(14),
                        color: this.props.textColor,
                        flex: 1,
                        padding: 0
                    }}
                    {...this.props}
                    secureTextEntry={this.props.isPassword && !this.state.showPw}
                    underlineColorAndroid='transparent'
                />
                <View style={{
                    backgroundColor: this.state.errorText ? Constant.errorTxt : this.props.bottomLineColor,
                    height: Utils.scale(1),
                }}/>
                {showError ? <Text style={styles.errorText}>{this.state.errorText}</Text> : null}
            </View>
        )
    }

    componentWillUnmount() {
        this.stop();
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
}

OTextInputSimple.propTypes = {
    isPassword: PropTypes.bool,
    isVerification: PropTypes.bool,
    textColor: PropTypes.string,
    bottomLineColor: PropTypes.string,
    pressRegain: PropTypes.func,
}

OTextInputSimple.defaultProps = {
    layoutStyle: {},
    autoCapitalize: "none", //不自动大写
    isPassword: false,
    isVerification: false,
    textColor: '#333',
    bottomLineColor: Constant.divider,
    pressRegain: () => { },
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingRight: Utils.scale(16),
        height: Utils.scale(50),
    },
    inputError: {
        width: '100%',
        paddingRight: Utils.scale(16),
        height: Utils.scale(60),
    },
    errorText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(3),
        color: Constant.errorTxt
    },
})