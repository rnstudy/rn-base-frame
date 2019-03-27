import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Animated,
    Dimensions,
    Text,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import SUC_ICON from '../../res/img/toast_success.png';
import FAIL_ICON from '../../res/img/toast_fail.png';
import WARN_ICON from '../../res/img/toast_icon.png';
import PropTypes from 'prop-types';
import Utils from '../../utils/Utils';
const ViewPropTypes = RNViewPropTypes || View.propTypes;
export const DURATION = {
    LENGTH_SHORT: 500,
    FOREVER: 0,
};


export const NONE = '0';
export const SUCCESS = '1';
export const FAIL = '2';
export const WARN = '3';



export default class Toast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            text: '',
            opacityValue: new Animated.Value(this.props.opacity),
            icon: NONE
        }
    }

    show(text, duration, callback, icon = NONE) {
        this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT;
        this.callback = callback;
        this.setState({
            isShow: true,
            text: text,
            icon: icon
        });

        Animated.timing(
            this.state.opacityValue,
            {
                toValue: this.props.opacity,
                duration: this.props.fadeInDuration,
            }
        ).start(() => {
            this.isShow = true;
            if (duration !== DURATION.FOREVER) this.close();
        });
    }

    close(duration) {
        let delay = typeof duration === 'undefined' ? this.duration : duration;
        if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250;
        if (!this.isShow && !this.state.isShow) return;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0.0,
                    duration: this.props.fadeOutDuration,
                }
            ).start(() => {
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
                if (typeof this.callback === 'function') {
                    this.callback();
                }
            });
        }, delay);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    renderIcon() {
        switch (this.state.icon) {
            case NONE:
                return <View style={{ marginRight: 5 }} />;
            case SUCCESS:
                return <Image source={SUC_ICON} style={{ marginRight: 5 }} />;
            case FAIL:
                return <Image source={FAIL_ICON} style={{ marginRight: 5 }} />;
            case WARN:
                return <Image source={WARN_ICON} style={{ marginRight: 5 }} />;
            default:
                break;
        }
    }

    render() {
        let pos;
        switch (this.props.position) {
            case 'top':
                pos = this.props.positionValue;
                break;
            case 'center':
                pos = height / 2;
                break;
            case 'bottom':
                pos = height - this.props.positionValue;
                break;
        }

        const view = this.state.isShow ?
            <View
                style={[styles.container, { top: pos }]}
                pointerEvents="none"
            >
                <Animated.View
                    style={[styles.content, { opacity: this.state.opacityValue }, this.props.style]}
                >
                    {React.isValidElement(this.state.text) ?
                        this.state.text :
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {this.renderIcon()}
                            {this.state.icon === NONE || this.state.icon === null ? (
                                <Text style={this.props.textStyle2}>{this.state.text}</Text>
                            ) : (
                                    <Text style={this.props.textStyle}>{this.state.text}</Text>
                                )}

                        </View>
                    }
                </Animated.View>
            </View> : null;
        return view;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        elevation: 999,
        alignItems: 'center',
        zIndex: 10000,
    },
    content: {
        backgroundColor: 'black',
        borderRadius: 5,
        padding: 10,
    },
    text: {
        color: 'white',
        maxWidth: width * 0.3,
        marginRight: 5,
        marginLeft: 5
    },
    text2: {
        color: 'white',
        maxWidth: width - Utils.scale(32),
        marginRight: 5,
        marginLeft: 5
    }
});

Toast.propTypes = {
    style: ViewPropTypes.style,
    position: PropTypes.oneOf([
        'top',
        'center',
        'bottom',
    ]),
    textStyle: Text.propTypes.style,
    // textStyle2: Text.propTypes.style2,
    positionValue: PropTypes.number,
    fadeInDuration: PropTypes.number,
    fadeOutDuration: PropTypes.number,
    opacity: PropTypes.number
}

Toast.defaultProps = {
    position: 'center',
    textStyle: styles.text,
    textStyle2: styles.text2,
    positionValue: 120,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 1,
}