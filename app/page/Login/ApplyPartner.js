import React, { Component } from "react";
import I18n from "../../config/i18n";
import NetUtils from "../../utils/NetUtils";
import * as Constant from "../../utils/Constant";
import {
    SIGNIN,
    SIGNUP,
    VERIFICATION_CODE,
} from '../../utils/Api';
import OText from "../../component/OText/OText";
import {
    Dimensions,
    InteractionManager,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ImageBackground
} from "react-native";
import { Actions } from "react-native-router-flux";
import Utils from "../../utils/Utils";
import { inject, observer } from "mobx-react/native";
import BG from '../../res/images/partner.png';
import MoreService from '../../pages/More/MoreService';
import CommonHeader from "../../component/Header/CommonHeader";

const { width, height } = Dimensions.get("window");

@inject(stores => ({
}))
@observer
export default class ApplyPartner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showService: false
        };
    }

    componentWillMount() {
    }

    componentDidMount() { }

    componentWillUnmount() {
    }

    pressBtn() {
        this.setState({
            showService: !this.state.showService
        })
    }

    acceptFun() {
        Actions.push('BecomeSaler')
    }

    render() {
        if (this.state.showService) {
            return <MoreService
                closeFun={() => this.pressBtn()}
                acceptFun={() => this.acceptFun()}
            />
        }
        return (
            <CommonHeader
                title={I18n('HIRE_STORER')}
                backAction={() => {
                    Actions.reset('Login')
                }}
            >
                <ScrollView style={{ width: width, height: height }}>
                    <ImageBackground
                        source={BG}
                        style={{
                            width: Utils.scale(375),
                            height: Utils.scale(2003)
                        }}
                    />
                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={() => {
                            this.pressBtn()
                        }}
                    >
                        <OText
                            style={styles.btnText}
                            text={'GIFTPAGE.APPLY_PARTNER_BOTTOM_TEXT_02'}
                        />
                    </TouchableOpacity>
                </ScrollView>
            </CommonHeader>

        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        width: Utils.scale(343),
        height: Utils.scale(50),
        position: "absolute",
        bottom: Utils.scale(16),
        left: Utils.scale(16),
        backgroundColor: '#ffa400',
        borderRadius: Utils.scale(25),
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: "#fff",
        fontWeight: "bold"
    },

    loginTitle: {
        marginTop: 16,
        fontSize: 25,
        fontWeight: "300",
        color: "#333",
        backgroundColor: "#0000"
    },

    maskLayout: {
        backgroundColor: "#000C",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    signinTitle: {
        marginTop: 32,
        marginBottom: 32,
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        backgroundColor: "#0000"
    },

    signinBtnLayout: {
        height: Utils.scale(54),
        backgroundColor: Constant.bottomBtnBg,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Utils.scale(27),
        marginTop: Utils.scale(20)
    },

    signinBtnTxt: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: "#fff",
        fontWeight: "bold"
    },

    forgetpwTxt: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 14,
        height: 22,
        color: "#333",
        backgroundColor: "#0000",
        textDecorationLine: "underline"
    }
});
