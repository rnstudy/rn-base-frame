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

export default class StringPicker extends Component {

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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initValue !== this.props.initValue) {
            this.setState({ selected: nextProps.initValue });
        }
    }

    onChange(item) {
        this.props.onChange(item);
        this.setState({ selected: item });
        this.close();
    }

    close() {
        this.setState({
            modalVisible: false
        });
    }

    open() {
        this.setState({
            modalVisible: true
        });
    }

    renderSection(section) {
        return (
            <View key={section} style={[styles.sectionStyle, this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section}</Text>
            </View>
        );
    }

    renderOption(option) {
        return (
            <TouchableOpacity key={option} onPress={() => this.onChange(option)}>
                <View style={[styles.optionStyle, this.props.optionStyle]}>
                    <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>{option}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderOptionList() {
        let style = this.props.data.length > 10 ? styles.optionContainerMax : styles.optionContainer;
        return (
            <TouchableOpacity onPress={() => this.close()} activeOpacity={1}>
                <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker' + (componentIndex++)}>
                    <View style={style}>
                        <FlatList
                            keyExtractor={(item, index) => (item + '' + index)}
                            style={{ borderRadius: 5 }}
                            data={this.props.data}
                            renderItem={({ item }) => item === this.state.selected ? this.renderSection(item) : this.renderOption(item)}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <Modal transparent={true} ref="modal" visible={this.state.modalVisible}
                   onRequestClose={() => this.close()}
                   animationType={this.state.animationType}>
                {this.renderOptionList()}
            </Modal>
        );
    }
}

