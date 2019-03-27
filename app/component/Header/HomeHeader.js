import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    OText,
    Platform,
    SafeAreaView,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('window');
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions, ActionConst } from 'react-native-router-flux';
import PropTypes from 'prop-types';

import ShopCartIcon from '../ShopCartIcon/ShopCartIcon';
import LOGO from '../../res/images/logon-index.png'
import PERSION from '../../res/images/person.png'



export default class HomeHeader extends Component {
    //属性声名
    static propTypes = {
    };
    //默认属性
    static defaultProps = {
    };

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    //点击个人中心
    toPersonAction() {
        Actions.push('Account')
    }

    //渲染
    render() {
        return (
            <View style={styles.headerRow}>
                <Image
                    style={styles.logoImg}
                    source={LOGO}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={styles.homeTouchLay}
                        onPress={() => this.toPersonAction()}
                    >
                        <Image style={styles.iconPerson} source={PERSION} />
                    </TouchableOpacity>
                    <ShopCartIcon />
                </View>

            </View>
        )

    }
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Utils.scale(40),
        paddingLeft: Utils.scale(12),
        paddingRight: Utils.scale(12),
        justifyContent: 'space-between',
        backgroundColor:'white',
        margin:Utils.scale(4),
    },
    logoImg: {
        width: Utils.scale(92),
        height: Utils.scale(30)
    },
    homeTouchLay: {
        height: Utils.scale(40),
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: Utils.scale(24),

    },

    iconPerson: {
        width: Utils.scale(22),
        height: Utils.scale(22),
    },

});
