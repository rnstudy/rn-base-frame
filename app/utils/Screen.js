import { Dimensions, PixelRatio, Platform } from 'react-native';

const Screen = {
    kWidth: Dimensions.get('window').width,
    kHeight: Dimensions.get('window').height,
    kScale:Dimensions.get('window').scale,
    onePixel: 1 / PixelRatio.get(),
    pageHeader: 50,
}

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;


export default Screen;