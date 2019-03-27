import {
    NativeModules,
    Platform
} from 'react-native'

export default class HttpCache {
    static async getCacheSize() {
        try {
            let httpCacheSize = 0;
            let imageCacheSize = 0;
            let allSize = 0;
            let cache = null;
            if (Platform.OS === 'ios') {
                 cache = NativeModules.OCHttpCache;
            } else {
                 cache = NativeModules.HttpCache
            }
            httpCacheSize =  await cache.getHttpCacheSize();
            imageCacheSize = await cache.getImageCacheSize();
            allSize = parseInt(httpCacheSize) + parseInt(imageCacheSize) + 0;
            if (allSize === NaN) {
                // console.log('allSize:'+0);
                return 0;
            }
            return allSize;
        } catch (error) {
            return 0;
        }

    }

    static clearCache() {
        try {
            if (Platform.OS === 'ios') {
                NativeModules.OCHttpCache.clearCache();
                NativeModules.OCHttpCache.clearImageCache();
            } else {
                NativeModules.HttpCache.clearCache();
                NativeModules.HttpCache.clearImageCache();
            }
        } catch (error) {
        }
    }
}