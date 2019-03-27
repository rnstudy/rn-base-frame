/**
 * Created by lu.jiarong on 2017/5/2.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    Image
} from 'react-native';
const { width, height } = Dimensions.get('window');
import PropTypes from 'prop-types';
import DEFAULT from '../../res/img/loading.gif';

//模块声名并导出
export default class ImageView extends Component {
    static propTypes = {
        defaultImageSrc: PropTypes.any,
        defaultResizeMode: PropTypes.oneOfType(['cover', 'contain', 'stretch', 'center']),
        defaultBackgroundColor: PropTypes.any,
    };
    //默认属性
    static defaultProps = {

    };
    //构造函数
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    renderDefaultImage(isNullStr = false) {
        const { style, } = this.props;
        let defaultImage = DEFAULT || this.props.defaultImageSrc;
        let defaultResizeMode = this.props.defaultResizeMode || 'contain';
        let defaultBackgroundColor = this.props.defaultBackgroundColor || 'transparent';
        let absStyle = isNullStr ? null : { position: 'absolute', top: 0, left: 0 }
        return (
            <Image
                {...this.props}
                source={defaultImage}
                resizeMode={defaultResizeMode}
                style={[style, { backgroundColor: defaultBackgroundColor, }, absStyle]}
            />
        )
    }

    //渲染
    render() {
        const { style, source, } = this.props;
        if (source && source.uri != null) {
            let imageSource = source;
            if (source.uri == '') {
                return this.renderDefaultImage(true)
            }
            return (
                <Image
                    {...this.props}
                    style={[style]}
                    source={imageSource}
                />
            );
        } else if (!source || source.uri === null) {
            return this.renderDefaultImage(true)
        } else {
            return (
                <Image
                    {...this.props}
                />
            )
        }
    }
};

