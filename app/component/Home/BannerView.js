import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Utils from "../../utils/Utils";
import Carousel from "../Carousel/Carousel";
import ActionToPage from '../../utils/ActionToPage';


const { screenWidth, screeHeight } = Dimensions.get('window');
const width  = Utils.scale(343)

export default class BannerView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bannerHeight: Utils.scale(160),
        }
    }

    componentDidMount() {
        const { items } = this.props;
        console.log("Image width", width)
        if (items && items.length > 0) {
            Image.getSize(items[0].adImageCn, (w, h) => {
                h = width * h / w; //按照屏幕宽度进行等比缩放
                // console.log("Image.getSize", h, this.state.bannerHeight)
                if (h > 0) {
                    this.setState({ bannerHeight: h });
                }
            });
        }
    }

    render() {
        const { items } = this.props;
        if (items && items.length > 0) {
            return (
                <View style={styles.bannerIndex}>
                    <Carousel
                        delay={5000}
                        style={{ width: Utils.scale(343), height:Utils.scale(160)}}
                        pageInfo={false}
                        bullets={items.length > 1}
                        isLooped={false}
                        chosenBulletStyle={styles.chosenBullet}
                        autoplay={true}
                        bulletStyle={styles.bullet}
                    >
                        {items.map((obj, index) => {
                            if (obj.adImageCn) {
                                return <TouchableOpacity
                                    key={index}
                                    style={{ width: width, height: Utils.scale(180) }}
                                    onPress={() => this.goPage(obj)}
                                >
                                    <Image
                                        roundAsCircle={true}
                                        resizeMode={'contain'}
                                        source={{ uri: obj.adImageCn }}
                                        style={{ width: width, height: this.state.bannerHeight,borderRadius:5,borderBottomLeftRadius:5,borderBottomRightRadius:5 }}
                                    />
                                </TouchableOpacity>
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
        ActionToPage.jumpFun(obj)
    }
}

const styles = StyleSheet.create({
    chosenBullet: {
        margin: 3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#000000',
    },
    bullet: {
        margin: 3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderWidth: 0
    },
    bannerIndex:{
        width:screenWidth,
        height: Utils.scale(180),
        marginTop: 17,
        alignItems: 'center',
        overflow: 'hidden'
    }
});