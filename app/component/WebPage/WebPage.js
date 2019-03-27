import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
    TextInput,
    WebView,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import createInvoke from 'react-native-webview-invoke/native'
import ErrorPage from '../ErrorPage/ErrorPage';
import {TestHtml} from "../../utils/Constant";

const patchPostMessageFunction = function () {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';


export default class WebPage extends Component {
    constructor(props) {
        super(props);
        this.webview = WebView;
        //this.invoke = createInvoke(() => this.webview)
        this.state = {
            url: this.props.url,
            title: this.props.title,
            canGoBack: false,
            rnToWeb: this.props.rnToWeb,
            webToRn: this.props.webToRn,
            errorTimes: 0
        };
    }

    rnToWebMsg() {
        if (this.props.rnToWeb) {
            return this.props.rnToWeb()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    webToRnMsg(data) {
        //console.log('data')
        //console.log(data);
        //this.props.webToRn && this.props.webToRn(data);
    }

    componentDidMount() {
        //this.invoke.define('get', () => this.rnToWebMsg());
        //this.invoke.define('set', (data) => this.webToRnMsg(data));
    }

    onErrorFun() {
        console.log('====onErrorFun', this.props.url, this.state.errorTimes);
        const { errorTimes } = this.state;
        if (this.props.onErrorFun) {
            this.props.onErrorFun && this.props.onErrorFun()
        } else {
            // this.setState({ errorTimes: this.state.errorTimes++ }, () => {
            //     if (errorTimes > 5) {
            //         return;
            //     }
            //     this.webview.reload && this.webview.reload()
            // })
        }

    }

    stateChange(event) {
        try {
            //console.log('========event.url===,', event.url);
            if (event.url && event.url.indexOf('login') > 0 && !event.url.indexOf('/checkout/login') > 0) {
                Actions.reset('Login');
            }
        } catch (error) {

        }

        this.props.eventStateChange && this.props.eventStateChange(event)
    }

    goBack() {
        try {
            this.webview.goBack()
        } catch (error) {

        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>
                <WebView
                    injectedJavaScript={patchPostMessageJsCode}
                    userAgent={'Littlemall-app'}
                    onNavigationStateChange={(event) => this.stateChange(event)}
                    ref={webview => this.webview = webview}
                    onMessage={(e) => {
                        this.props.webToRn && this.props.webToRn(e.nativeEvent);
                    }}
                    // source={{html: TestHtml}}
                    source={{ uri: this.props.url }}//新版本中的写法
                    startInLoadingState={true}
                    domStorageEnabled={true}//开启dom存贮
                    javaScriptEnabled={true}//开启js
                    style={styles.webview_style}
                    onError={() => this.onErrorFun()}
                    renderError={() => <ErrorPage />}
                    dataDetectorTypes={['link','address','calendarEvent']}//检测 webview 内容，并将指定类型的数据变成可点击的 URL。默认只对手机号码进行变换。
                    mixedContentMode={'always'}//解决测试环境Android头像不显示，允许安全链接页面中加载非安全链接的内容
                />
            </View>
        )
    }
}


let styles = StyleSheet.create({
    webview_style: {
        backgroundColor: '#fff',
    }
});