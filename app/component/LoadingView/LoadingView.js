import React, {Component} from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import I18n from '../../config/i18n'
import PropTypes from 'prop-types';

export default class LoadingView extends Component {
    render() {
        let loadingText = this.props.loadingText === null ? I18n('loading') : this.props.loadingText;
        return (
            <Modal
                transparent={true}
                onRequestClose={() => this.props.cancel()}>
                <View style={styles.loading}>
                    <ActivityIndicator size='large' color='#FFFFFF'/>
                    <Text style={styles.loadingText}>{loadingText}</Text>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#FFFFFF'
    }
});


LoadingView.propTypes = {
}

LoadingView.defaultProps = {
}
