import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('window');

import { Table, TableWrapper, Row, Rows, Col } from '../../component/TableView';
import {
    NAVIGATION_SUSPENSION,
} from '../../pages/CommonWebView/CommonWebView'
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from '../../component/OText/OText'
export default class SizeChart extends Component {

    //默认属性
    static defaultProps = {

    };

    //构造函数
    constructor(props) {
        super(props);
        const {
            sizeChart,
            sizeChartImage,
            sizeChartInfo,

            standardChart,
            standardChartImage,
            standardChartInfo
        } = props.data;
        let dataArray = [];
        if (sizeChart && sizeChart.length > 0) {
            dataArray.push({
                items: sizeChart,
                iamge: sizeChartImage,
                title: 'DETAIL_SIZE_TABLE',
                info: sizeChartInfo,
            })
        }
        if (standardChart && standardChart.length > 0) {
            dataArray.push({
                items: standardChart,
                iamge: standardChartImage,
                title: 'DETAIL_STANDARD_SIZE',
                info: standardChartInfo
            })
        }
        this.state = { //状态机变量声明
            dataArray: dataArray,
            selIndex: 0,
        }
    }

    renderTitle() {
        const { dataArray } = this.state;
        return (
            <View style={styles.titleView}>
                {dataArray.map((obj, index) => {
                    let touchStyle = {};
                    const { selIndex } = this.state;
                    let textStyle = styles.unselTitleText
                    if (index + '' === '0' && dataArray.length + '' === '1') {
                        touchStyle = [styles.titleLeftTouch, styles.titleRightTouch]
                    } else if (index + '' === '0') {
                        touchStyle = [styles.titleLeftTouch]
                    } else if ((dataArray.length - 1) + '' === (index) + '') {
                        touchStyle = [styles.titleRightTouch]
                    }
                    if (selIndex === index) {
                        touchStyle = [touchStyle, { backgroundColor: '#333333' }]
                        textStyle = styles.selTitleText
                    }
                    return <TouchableOpacity
                        style={touchStyle}
                        key={index}
                        onPress={() => this.pressTitle(index)}
                    >
                        <OText
                            text={obj.title}
                            style={textStyle}
                        />
                    </TouchableOpacity>
                })}

            </View>
        )
    }

    pressTitle(selIndex) {
        this.setState({ selIndex })
    }

    renderChartInfo() {
        try {
            const selData = this.state.dataArray[this.state.selIndex];
            const { info } = selData;
            if (info && info + '' != '') {
                return <Text style={styles.infoText}>
                    {info}
                </Text>
            }
        } catch (error) {
        }
    }

    renderDetail() {
        const selData = this.state.dataArray[this.state.selIndex];
        const { items, } = selData;
        let titleArr = [];
        let tableArr = [];
        for (const iterator of items) {
            titleArr.push(iterator[0])
            //iterator.shift();
            tableArr.push(iterator)
        }

        return <ScrollView
            horizontal={true}
            style={styles.tableContainer}
        >
            <Table>
                <TableWrapper style={styles.wrapper}>
                    <Rows
                        data={tableArr}
                        style={styles.row}
                        textStyle={styles.text}
                    />
                </TableWrapper>
            </Table>
        </ScrollView>
    }

    renderImage() {
        try {
            const selData = this.state.dataArray[this.state.selIndex];
            const { iamge, title } = selData;
            if (iamge && iamge + '' != '') {
                let height = title + '' === 'DETAIL_STANDARD_SIZE' ? width / 750 * 878 : width / 750 * 1970;
                let imageOne = {
                    width: width,
                    height: height,
                };
                return <Image
                    resizeMode={'contain'}
                    style={imageOne}
                    source={{ uri: iamge }}
                />
            }
        } catch (error) {
        }
    }

    //渲染
    render() {
        try {
            const { dataArray } = this.state;
            if (dataArray && dataArray.length > 0) {
                return (
                    <View style={styles.container}>
                        {this.renderTitle()}
                        {this.renderChartInfo()}
                        {this.renderDetail()}
                        {this.renderImage()}
                    </View>
                );
            }
        } catch (error) { }
        return <View />
    }
};

const styles = StyleSheet.create({
    container: {
        marginTop: Utils.scale(16),
        width: width - 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15
    },
    titleView: {
        flexDirection: 'row',
    },
    titleLeftTouch: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#333333',
        borderWidth: 1,
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    titleRightTouch: {
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderColor: '#333333',
        borderWidth: 1,
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    selTitleText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: 'white',
    },
    unselTitleText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.blackText,
    },

    tableContainer: {
        width: '100%',
        paddingTop: 30,
        backgroundColor: '#fff',
    },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: { height: 28 },
    text: {
        textAlign: 'center',
        width: 100,
    },
    infoText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText,
        marginTop: 15
    },

});
