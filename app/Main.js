/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Alert} from 'react-native';
import { Actions, Router, Scene, Tabs } from "react-native-router-flux";
import I18n from "./config/i18n";
import ProviderStore from "./store/ProviderStore";
import { Provider } from "mobx-react/native";

import * as Constant from './utils/Constant'
import Login from './page/Login/Login'
import Splash from './page/Splash/Splash'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component{
  render() {
    return (
        <Provider {...ProviderStore}>
        <Router
            titleStyle={styles.navigationbarTitle}
            navigationBarStyle={styles.navigationbar}
            sceneStyle={{ backgroundColor: Constant.mainGray }}
            renderBackButton={() => (
                <TouchableOpacity
                    onPress={() => Actions.pop()}
                    activeOpacity={1}
                >
                    <Image
                        style={{ marginLeft: 16 }}
                        source={require("./res/img/arrow_back.png")}
                    />
                </TouchableOpacity>
            )}
            renderRightButton={() => (
                <TouchableOpacity
                    overflow="hidden"
                    style={styles.rightImageLayout}
                    activeOpacity={1}
                >
                    <Image
                        source={require("./res/img/transparent.png")}
                    />
                </TouchableOpacity>
            )}
        >
            <Scene key="root">
                <Scene key="Splash" component={Splash} hideNavBar={true} />
                {/* 新页面 */}
                <Scene key="Login" component={Login} hideNavBar={true} />
            </Scene>
        </Router>
    </Provider>
    );
  }
}

const styles = StyleSheet.create({
    leftImageLayout: {
        paddingLeft: 16,
        paddingRight: 4
    },

    rightImageLayout: {
        paddingRight: 16,
        paddingLeft: 4
    },

    navigationbar: {
        elevation: 0,
        height: Constant.navHeight,
        backgroundColor: "#fff"
    },
    navigationbarTitle: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#030303",
        alignSelf: "center"
    }
});
