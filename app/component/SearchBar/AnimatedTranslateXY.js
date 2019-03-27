import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Animated,
    Button,
} from 'react-native';
import Utils from '../../utils/Utils';

export default class AnimatedTranslateXY extends Component {
    constructor(props) {
        super(props)
        this.state = {
            /*
             初始化动画值
             * */
            animValue: new Animated.Value(1),
            currentValue: 1, //标志位
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Animated.View style={{
                    marginTop: Utils.scale(44),
                    width: '50%',
                    height: '50%',
                    backgroundColor: 'skyblue',
                    /*
                     将动画值绑定到style的属性
                    * */
                    // opacity: this.state.animValue, //透明度动画
                    transform: [ //位置动画（可以思考一下：下面的元素顺序不同会有不同效果）
                        {
                            translateY: this.state.animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [300, 0] //线性插值，0对应-100，1对应0
                            })
                        },
                        // {
                        //     scale: this.state.animValue, //大小动画
                        // },
                    ]
                }} />
                <Button
                    title="touch me"
                    onPress={() => {
                        /*
                         处理动画值，并启动动画
                         * */
                        this.state.currentValue = this.state.currentValue == 1 ? 0 : 1
                        Animated.timing(this.state.animValue, {
                            toValue: this.state.currentValue,
                            duration: 300,
                        }).start()
                    }}
                    style={styles.bottomButton}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        padding: 35
    },
    t1: {
        transform: [{ translateX: 10 }]
    },
    t2: {
        transform: [{ translateY: 50 }]
    },
    bottomButton: {
        position: 'absolute',
        bottom: 0,
    }
});