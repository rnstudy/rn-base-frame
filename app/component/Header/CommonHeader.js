import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('window');
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import BackIcon from '../../res/images/account_back.png';

export const NAVIGATION_SUSPENSION = 'SUSPENSION';// 不显示导航，且带返回按钮
export const NAVIGATION_BACK = 'BACK';// 显示导航，且带返回按钮
export const NAVIGATION_HIDE = 'HIDE';// 隐藏

export default class CommonHeader extends Component {
    //属性声名
    static propTypes = {
        // 返回按钮
        showBackIcon: PropTypes.bool,
        backAction: PropTypes.func,
        backIconSrc: PropTypes.number,

        // title视图
        title: PropTypes.string,
        titleView:PropTypes.any,

        // 右视图
        rightIcon: PropTypes.any,
        rightAction: PropTypes.any,
        rightView: PropTypes.any,

        defaultStatusBar: PropTypes.bool,
        containerStyles: PropTypes.any,
        headerViewStyles: PropTypes.any,
        showDivider: PropTypes.bool,
        
    };
    //默认属性
    static defaultProps = {
        title: 'Littlemall',
        defaultStatusBar: true,
        showBackIcon: true,
        showDivider: false,
        titleType: NAVIGATION_BACK,  //    BACK,HIDE
    };

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    renderStatBar() {
        if (Platform.OS === 'ios') {
            return <StatusBar barStyle={this.props.defaultStatusBar ? 'default' : 'light-content'} />
        }
        return null
    }

    onPressBack() {
        if (this.props.backAction) {
            this.props.backAction();
        } else {
            Actions.pop();
        }
    }

    renderTitle() {
        return (
            <View style={styles.titleView}>
                {this.props.titleView ?
                    this.props.titleView :
                    <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
                }
            </View>
        )
    }

    renderLeftIcon() {
        if (this.props.showBackIcon) {
            return <TouchableOpacity
                onPress={() => this.onPressBack()}>
                <View style={styles.backView}>
                    <Image
                        resizeMode={'contain'}
                        style={{
                            width: this.props.backIconSrc ? Utils.scale(16) : Utils.scale(22),
                            height: this.props.backIconSrc ? Utils.scale(16) : Utils.scale(22)
                        }}
                        source={this.props.backIconSrc ? this.props.backIconSrc : BackIcon}
                    />
                </View>
            </TouchableOpacity>
        } else {
            return <View />
        }
    }

    //渲染
    render() {
        if (this.props.titleType + '' === NAVIGATION_HIDE) {
            //if (false) {
            return <View style={[styles.container, this.props.containerStyles, { paddingTop: Constant.sizeHeaderMarginTop, }]}>
                {this.renderStatBar()}
                {
                    this.props.children
                }
            </View>
        } else if (this.props.titleType + '' === NAVIGATION_SUSPENSION) {
            return (
                <View style={[styles.container, this.props.containerStyles]}>
                    {
                        Constant.isIphoneX ? (
                            <View style={{ height: 44, backgroundColor: '#fff' }} />
                        ) : (null)
                    }
                    {this.props.children}
                    <TouchableOpacity
                        style={styles.backTouch}
                        onPress={() => this.onPressBack()}
                    >
                        <Image
                            resizeMode={'contain'}
                            style={styles.backImage}
                            source={BackIcon}
                        />
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={[styles.container, this.props.containerStyles]}>
                    <View style={[styles.headerView, this.props.headerViewStyles]}>
                        {this.renderStatBar()}

                        <View style={styles.header}>
                            {this.renderTitle()}
                            {this.renderLeftIcon()}
                            {/*{this.props.title === '个人中心'? <TouchableOpacity/>}*/}
                            {this.props.rightTitle ? <TouchableOpacity onPress={() => {
                                this.props.rightAction && this.props.rightAction();
                            }}>
                                <View style={styles.rightView}>
                                    <Text
                                        style={[this.props.rightTextStyle, { fontSize: Utils.scale(16) }]}>{this.props.rightTitle}</Text>
                                </View>
                            </TouchableOpacity> : null}

                            {this.props.rightIcon ? <TouchableOpacity onPress={() => {
                                if (this.props.rightAction) {
                                    this.props.rightAction();
                                }
                            }}>
                                <View style={styles.rightView}>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{ width: Utils.scale(20), height: Utils.scale(20) }}
                                        source={this.props.rightIcon}
                                    />
                                </View>
                            </TouchableOpacity> : null}
                            {
                                this.props.rightView ?
                                    <View>
                                        <View
                                            style={{
                                                flex: 1, flexDirection: 'row',
                                                alignItems: 'center'
                                            }} />{this.props.rightView}
                                    </View>
                                    :
                                    null
                            }
                        </View>
                    </View>
                    {
                        this.props.showDivider == true ? <View style={{
                            width: '100%',
                            height: StyleSheet.hairlineWidth,
                            backgroundColor: '#ddd8d8',
                        }} /> : null
                    }
                    {
                        this.props.children
                    }
                </View>
            );
        }
    }
};

const styles = StyleSheet.create({
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
        fontWeight: 'bold',
        fontSize: Utils.scale(17),
        width: '65%',
        textAlign: 'center',
        color:Constant.blackText,
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
    }
});
