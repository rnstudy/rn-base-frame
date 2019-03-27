import { Platform, Dimensions } from "react-native";
import Screen from "./Screen";
import Utils from "../utils/Utils";
export const isIphoneX =
    Dimensions.get("window").width == 375 &&
    Dimensions.get("window").height == 812;
export const isIOS = Platform.OS === "ios" ? true : false;
/****************颜色****************/
export const mainBackgroundColor = "#ffffff";
export const mainGray = "#EAEAEA";
export const divider = "#e5e5e5";
export const bottomBtnBg = "#FD5F10";
export const navicateBottomLine = "#b2b2b2";
export const loadmoreColor = "#555";
export const errorTxt = "#FD5F10";
export const boldLine = "#F2F2F2";

/****************字体颜色************/
export const blackText = "#333333";
export const grayText = "#666666";
export const lightText = "#999999";
export const themeText = "#FD5F10";
export const greenText = "#44AC17";
export const grayCC = "#CCCCCC";

/****************字体大小************/
export const miniSize = Utils.scaleFontSizeFunc(10);
export const smallSize = Utils.scaleFontSizeFunc(12);
export const normalSize = Utils.scaleFontSizeFunc(14);
export const largeSize = Utils.scaleFontSizeFunc(16);
export const avatarSize = Utils.scaleFontSizeFunc(36);
export const maxSize = Utils.scaleFontSizeFunc(38);

export const defaultTextStyle = {
    color: blackText,
    fontSize: normalSize
};
export const miWhite = "#ececec";
export const white = "#FFF";

export const titleTextColor = miWhite;

/****************大小****************/
export const paddingIPXBottom = isIphoneX ? 34 : 0;
export const sizeHeader =
    Platform.OS === "ios" && isIphoneX ? 84 : Platform.OS === "ios" ? 64 : 50;
export const sizeHeaderMarginTop =
    Platform.OS === "ios" && isIphoneX ? 35 : Platform.OS === "ios" ? 20 : 0;
export const sizeHeaderContent = Platform.OS === "ios" ? 44 : 50;

export const bottomBtnHeight = 49;
export const mainRadius = 8;
export const indexItemRadius = 5;
export const navHeight = 48;
export const androidStatusbarHeight = 20;
export const iphoneStatusbarHeight = isIphoneX ? 44 : 20;
export const iphoneBottomSpace = isIphoneX ? 34 : 0;

export const statusbarHeight =
    Platform.OS === "ios" ? iphoneStatusbarHeight : androidStatusbarHeight;

// navbar 高度
export const iosnavHeaderHeight = navHeight + iphoneStatusbarHeight;
export const androidNavHeaderHeight = navHeight;
export const navHeaderHeight =
    Platform.OS === "ios" ? iosnavHeaderHeight : androidNavHeaderHeight;

export const marginLeft = Utils.scale(16);

/****************常量****************/
export const USER_INFO = "user-info";

export const LOGIN_TYPE = "loginType"; // 200:账号密码登录；201:微信登录；202:Facebook登录


export const LOGIN_FAIL = "LOGIN_FAIL";


export const INPUT_LISTENER = "INPUT_LISTENER";
export const CART_TIME_LISTENER = "CART_TIME_LISTENER";

export const HOME_LIST_DATA = "homeListData";
export const HOME_HIGH_BONUS = "highBonus";
export const HOME_DAILY_NEW = "dailyNew";
export const HOME_NEW_CUSTOMER = "newCustomer";

export const HOME_CAT_DATA = "homeCategoriesData";

export const SCROLL_CAROUSEL = "scrollCarousel";

export const SHOP_STORE_INFO = "storeInfo";

//export const PAY_ID = 'pk_live_6rCIpfZxdhMPlCzAXT3cxNL5'
export const PAY_ID = 'pk_test_R9X84n7ueoFAReFgoXgapdhl'


export const TestHtml =
    '<html lang="en">\n' +
    "<head>\n" +
    '    <meta charset="UTF-8">\n' +
    "    <title>WebView Test</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "<a href='javascript:postMsg()'>postMsg</a>\n" +
    "</body>\n" +
    "<script>function postMsg() {\n" +
    '    window.postMessage("showShare");\n' +
    "}</script>\n" +
    "</html>";
