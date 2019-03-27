import React, { Component } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import OText from '../OText/OText';
import left from '../../res/images/foot_left.png';
import right from '../../res/images/foot_right.png';

export default class LoadingView extends Component {
    render() {
        return (
            <View style={styles.view}>
                <Image
                    style={styles.imageStyle}
                    sourct={left}
                />
                <OText style={styles.footText}
                    text={'COMMON.TEXT_END_TIP'}
                />

                <Image
                    style={styles.imageStyle}
                    sourct={right}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: '100%',
        height: 42,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footText: {
        marginTop: 10,
        fontSize: 12,
        color: 'white',
        marginLeft: 9,
        marginRight: 9
    },
    imageStyle: {
        width: 8,
        height: 14,
    }
});


LoadingView.propTypes = {
}

LoadingView.defaultProps = {
}
