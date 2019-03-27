import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import SelectImage from '../../res/img/productinfo_ship_check.png';

export default class SelectCell extends Component {
    render() {
        return (
            <TouchableOpacity
                disabled={!this.props.onPress}
                onPress={()=>this.props.onPress&&this.props.onPress()}
                style={styles.cell}
                activeOpacity={1}
            >
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    this.props.isSelect === true? (
                        <Image
                            style={styles.select}
                            source={SelectImage}
                        />
                    ) : (null)
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 54,
    },
    title: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 16,
    },
    select: {
        width: 14,
        height: 14,
        marginRight: 16,
    },
})