'use strict';

import { StyleSheet, Dimensions } from 'react-native';
import Utils from "../../utils/Utils";

const {height, width} = Dimensions.get('window');

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 14;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';
const OPTION_CONTAINER_HEIGHT = 400;

export default StyleSheet.create({
    arrowDown: {
        width: Utils.scale(10),
        height: Utils.scale(6),
    },
    picker: {
        width: '100%',
        paddingRight: Utils.scale(16),
        marginBottom: Utils.scale(20),
        marginTop: Utils.scale(10),
    },

    overlayStyle: {
        width: width,
        height: height,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    optionContainer: {
        borderRadius:BORDER_RADIUS,
        width:width*0.8,
        backgroundColor:'rgba(255,255,255,0.8)',
        left:width*0.1,
        top:(height-OPTION_CONTAINER_HEIGHT)/2
    },

    optionContainerMax: {
        borderRadius:BORDER_RADIUS,
        width:width*0.8,
        height:OPTION_CONTAINER_HEIGHT,
        backgroundColor:'rgba(255,255,255,0.8)',
        left:width*0.1,
        top:(height-OPTION_CONTAINER_HEIGHT)/2
    },

    cancelContainer: {
        left:width*0.1,
        top:(height-OPTION_CONTAINER_HEIGHT)/2 + 10
    },

    selectStyle: {
        height: Utils.scale(50),
        marginRight: Utils.scale(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    selectTextStyle: {
        color: '#333',
        fontSize: FONT_SIZE
    },

    cancelStyle: {
        borderRadius: BORDER_RADIUS,
        width: width * 0.8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: PADDING
    },

    cancelTextStyle: {
        textAlign: 'center',
        color: '#333',
        fontSize: FONT_SIZE
    },

    optionStyle: {
        padding: PADDING,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },

    optionTextStyle: {
        textAlign: 'center',
        fontSize: FONT_SIZE,
        color: HIGHLIGHT_COLOR
    },

    sectionStyle: {
        padding: PADDING,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },

    sectionTextStyle: {
        textAlign: 'center',
        fontSize: FONT_SIZE
    }
});