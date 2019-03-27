'use strict';

import React, {
    Component
} from 'react';

import {
    View,
    Modal,
    Text,
    ScrollView,
    TouchableOpacity, Image, FlatList,
} from 'react-native';

import styles from './style';
import ArrowDown from '../../res/img/arrow_down.png';
import Utils from "../../utils/Utils";

let componentIndex = 0;

export default class ModalPicker extends Component {

    constructor() {

        super();

        this.state = {
            animationType: 'slide',
            modalVisible: false,
            transparent: false,
            selected: 'please select'
        };
    }

    componentDidMount() {
        this.setState({ selected: this.props.initValue });
        this.setState({ cancelText: this.props.cancelText });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initValue != this.props.initValue) {
            this.setState({ selected: nextProps.initValue });
        }
    }

    onChange(item) {
        this.props.onChange(item);
        this.setState({ selected: item.state });
        this.close();
    }

    close() {
        this.setState({
            modalVisible: false
        });
        console.log("close done")
    }

    open() {
        this.setState({
            modalVisible: true
        });
    }

    renderSection(section) {
        return (
            <View key={section.state} style={[styles.sectionStyle, this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section.state}</Text>
            </View>
        );
    }

    renderOption(option) {
        return (
            <TouchableOpacity key={option.state} onPress={() => this.onChange(option)}>
                <View style={[styles.optionStyle, this.props.optionStyle]}>
                    <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>{option.state}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderOptionList() {
        let style = this.props.data.length > 5 ? styles.optionContainerMax : styles.optionContainer;
        return (
            <TouchableOpacity onPress={() => this.close()} activeOpacity={1}>
                <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker' + (componentIndex++)}>
                    <View style={style}>
                        <FlatList
                            keyExtractor={(item, index) => (item.stateCode + '' + index)}
                            style={{ borderRadius: 5 }}
                            data={this.props.data}
                            renderItem={({ item }) => item.state === this.state.selected ? this.renderSection(item) : this.renderOption(item)}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderChildren() {
        if (this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
                <Image style={styles.arrowDown} source={ArrowDown} />
            </View>
        );
    }

    render() {

        const dp = (
            <Modal transparent={true} ref="modal" visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                animationType={this.state.animationType}>
                {this.renderOptionList()}
            </Modal>
        );

        return (
            <View style={{
                width: '100%',
                height: Utils.scale(50),
                paddingRight: Utils.scale(16),
            }}>
                {dp}
                <TouchableOpacity onPress={() => this.open()}>
                    {this.renderChildren()}
                </TouchableOpacity>
            </View>
        );
    }
}

