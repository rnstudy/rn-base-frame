import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity,TouchableWithoutFeedback, View } from 'react-native';
import Utils from "../../utils/Utils";
import Carousel from "../Carousel/Carousel";
import { Actions } from "react-native-router-flux";

import * as Constant from "../../utils/Constant";

const { screenWidth, screeHeight } = Dimensions.get('window');
const width = Utils.scale(343)

import { inject, observer } from "mobx-react/native";
@inject(stores => ({
    homeStore: stores.homeStore,
}))
@observer
export default class BannerView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bannerHeight: Utils.scale(160),
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { bannerData } = this.props.homeStore;
        if (bannerData && bannerData.length > 0) {
            Image.getSize(bannerData[0].adImageCn, (w, h) => {
                let tempH = width * h / w; //按照屏幕宽度进行等比缩放
                if (tempH > 0) {
                    this.setState({ bannerHeight: tempH });
                }
            });
        }
    }



    render() {
        const { bannerData } = this.props.homeStore;
        if (bannerData && bannerData.length > 0) {
            return (
                <View style={styles.bannerIndex}>
                    <Carousel
                        delay={5000}
                        style={{ width: Utils.scale(343), height: this.state.bannerHeight }}
                        pageInfo={false}
                        bullets={bannerData.length > 1}
                        isLooped={true}
                        chosenBulletStyle={styles.chosenBullet}
                        autoplay={true}
                        bulletStyle={styles.bullet}
                        bulletsContainerStyle={{
                            bottom: Utils.scale(8),
                            height: Utils.scale(8),
                        }}
                    >
                        {bannerData.map((obj, index) => {
                            if (obj.adImageCn) {
                                return <TouchableWithoutFeedback
                                    key={index}
                                    style={{ width: width, height: Utils.scale(180) }}
                                    onPress={() => this.goPage(obj)}
                                >
                                    <Image
                                        roundAsCircle={true}
                                        resizeMode={'contain'}
                                        source={{ uri: obj.adImageCn }}
                                        style={{
                                            width: width,
                                            height: this.state.bannerHeight,
                                            borderRadius: 5,
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                            } else {
                                return <View />
                            }
                        })}
                    </Carousel>
                </View>
            );
        }
        return <View />

    }

    goPage(obj) {
        try {
            const { adCollectionHref } = obj;
            let temp = adCollectionHref.split('collection/')
            Actions.push('FlashSpecial', { spId: temp[1] })

        } catch (error) {

        }

    }
}

const styles = StyleSheet.create({
    chosenBullet: {
        margin: 3,
        width: Utils.scale(12),
        height: Utils.scale(5),
        borderRadius: Utils.scale(3),
        backgroundColor: 'white',
    },
    bullet: {
        margin: 3,
        width: Utils.scale(5),
        height: Utils.scale(5),
        borderRadius: Utils.scale(3),
        backgroundColor: 'white',
    },
    bannerIndex: {
        width: screenWidth,
        height: Utils.scale(180),
        marginBottom: Utils.scale(20),
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: Utils.scale(18),
    },


});