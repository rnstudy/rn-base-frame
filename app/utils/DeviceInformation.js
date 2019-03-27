import { NativeModules, Platform } from "react-native";


export default class DeviceInformation {

    static getDeviceLocale() {
        if (Platform.OS === 'ios') {
            return NativeModules.OCDeviceInfo.deviceLocale
        } else {

            return NativeModules.DeviceInformation.deviceLocale
        }
    }


    static getDeviceCountry() {
        if (Platform.OS === 'ios') {
            return NativeModules.OCDeviceInfo.deviceCountry
        } else {
            //return NativeModules.DeviceInformation.deviceCountry
            return NativeModules.DeviceInformation.timeZone//安卓只能获取地区
        }
    }

    static getAppVersion() {
        if (Platform.OS === 'ios') {
            return NativeModules.OCDeviceInfo.appVersion
        } else {
            return NativeModules.DeviceInformation.appVersion
        }
    }
}