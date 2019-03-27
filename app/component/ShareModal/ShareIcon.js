import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";

import WX_ICON from "../../res/img/wechat.png";
import WX_DIS_ICON from "../../res/img/chat_disable.png";

import FACE_ICON from "../../res/img/share_facebook.png";
import FACE_DIS_ICON from "../../res/img/share_facebook_dis.png";

import MESS_ICON from "../../res/img/share_messenger.png";
import MESS_DIS_ICON from "../../res/img/share_messenger_dis.png";

import MO_ICON from "../../res/img/share_monent.png";
import MO_DIS_ICON from "../../res/img/share_monent_dis.png";

import DOWN_PHOTO from "../../res/img/down_photo.png";
import COPY_LINK from "../../res/img/copy_link.png";

import NativeShare from "../../utils/NativeShare";

import OText from "../OText/OText";
import * as Constant from "../../utils/Constant";
import Utils from "../../utils/Utils";

export default class ShareIcon extends Component {
    render() {
        const { data, pressFun } = this.props;
        const { text, enable, platform } = data;
        let icon = WX_ICON;
        switch (platform) {
            case NativeShare.WEIXIN:
                icon = enable ? WX_ICON : WX_DIS_ICON;
                break;
            case NativeShare.WEIXIN_CIRCLE:
                icon = enable ? MO_ICON : MO_DIS_ICON;
                break;
            case NativeShare.FACEBOOK:
                icon = enable ? FACE_ICON : FACE_DIS_ICON;
                break;
            case NativeShare.FACEBOOK_MESSAGER:
                icon = enable ? MESS_ICON : MESS_DIS_ICON;
                break;
            case "SHARE_MASK_COPY_LINK":
                icon = COPY_LINK;
                break;
            case "SHARE_MASK_DOWNLOAD":
                icon = DOWN_PHOTO;
                break;
            default:
                break;
        }
        return (
            <TouchableOpacity
                onPress={() => pressFun && pressFun()}
                style={styles.touchStyle}
                disabled={!enable}
            >
                <Image style={styles.image} source={icon} />
                <OText text={text} style={styles.text} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchStyle: {
        width: Utils.scale(75),
        height: Utils.scale(73),
        justifyContent: "space-around",
        alignItems: "center",
        marginLeft: Utils.scale(5),
        marginRight: Utils.scale(5),
        marginTop: Utils.scale(8),
        marginBottom: Utils.scale(7)
    },
    image: {
        width: Utils.scale(50),
        height: Utils.scale(50)
    },
    text: {
        fontSize: Constant.smallSize
    }
});
