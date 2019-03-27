import React, { Component } from 'react';
import {
    FlatList,
    View,
    Dimensions,
    InteractionManager
} from 'react-native';
const { width, } = Dimensions.get("window");

const SCROLL_OFFSET = 5

/**
 <ListGallery
    listData={flashSpecialData}
    ref={'ListGallery'}
    renderItem={(item, index) => this.renderFlashItem(item, index)}
    headFootComponent={<View style={{ width: Utils.scale(12), height: 10 }} />}
    separatorComponent={<View style={{ width: Utils.scale(8), height: 10 }} />}
    scrollPageIndex={this.state.scrollPageIndex}
    scrollPageIndexFun={(tempIndex) => this.setState({
        scrollPageIndex: tempIndex
    })}
    listStyle={{ width: width, height: Utils.scale(165) }}
    viewOffset={4}
/>
 */

export default class ListGallery extends Component {

    //默认属性
    static defaultProps = {
        listData: [],                               //item数据
        renderItem: () => { return <View /> },      //item页面
        scrollPageIndex: null,                      //当前页下标
        scrollPageIndexFun: (lastIndex) => { },     //滚动后回调,参数为最后的下标
        headFootComponent: <View />,                //头部尾部view间隔
        separatorComponent: <View />,               //item之间间隔大小
        listStyle: { width: width, height: 100 },   //列表大小
        showsHorizontalScrollIndicator: false,      //是否展示滚动条
        viewOffset: 0,                              //滚动偏移量，根据头部尾部view和中间间隔，可能需要配置偏移量达到居中效果
        loop: false,                                //循环
        autoPlay: false,                            //自动播放
        delay: 2000,                                //自动播放间隔时间
    };

    constructor(props) {
        super(props);
        this.state = {
            scrollPageIndex: props.scrollPageIndex != null ? props.scrollPageIndex : null
        };
        this.scrollStar = 0;
        this.scrollEnd = 0;
    }

    componentDidMount() {
        this.setAutoPlay();
    }

    componentWillUnmount() {
        this.clearTimer()
    }

    setAutoPlay() {
        try {
            const { autoPlay, listData, delay } = this.props;
            if (autoPlay && listData.length > 1) {
                this.clearTimer();
                this.timer = setTimeout(() => {
                    const { listData, } = this.props;
                    let tempIndex = this.props.scrollPageIndex != null ? this.props.scrollPageIndex : this.state.scrollPageIndex;
                    const dataLength = listData.length - 1;
                    if (tempIndex < dataLength) {
                        tempIndex = tempIndex + 1
                    } else {
                        tempIndex = 0
                    }
                    this.scrollFlatList(tempIndex)
                }, delay)
            }
        } catch (error) {
        }
    }

    clearTimer() {
        clearTimeout(this.timer)
    }

    render() {
        try {
            const {
                listData,
                renderItem,
                showsHorizontalScrollIndicator,
                headFootComponent,
                separatorComponent,
                listStyle
            } = this.props;
            return (
                <FlatList
                    ref={'flatList'}
                    data={listData}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={headFootComponent}
                    ListFooterComponent={headFootComponent}
                    ItemSeparatorComponent={() => separatorComponent}
                    onScroll={(event) => this.listOnScall(event)}
                    onScrollEndDrag={(event) => this.scrollEndFun(event)}
                    style={listStyle}
                    onMomentumScrollEnd={() => this.initScrollData()}
                    decelerationRate="fast"
                    onScrollBeginDrag={() => this.clearTimer()}
                />
            )
        } catch (error) {
            return <View />
        }
    }

    /**
     * 开始滚动赋值
     * @param {*} event 
     */
    listOnScall(event) {
        const currentOffset = event.nativeEvent.contentOffset.x;
        if (this.scrollStar == 0) {
            this.scrollStar = currentOffset
        }
    }

    /**
     * 手指放开后调用方法
     */
    scrollEndFun(event) {
        try {
            this.scrollEnd = event.nativeEvent.contentOffset.x;
            const { listData, loop } = this.props;
            const dataLength = listData.length - 1
            let temp = this.scrollEnd - this.scrollStar;
            let tempIndex = this.props.scrollPageIndex != null ? this.props.scrollPageIndex : this.state.scrollPageIndex;
            if (temp > SCROLL_OFFSET) {
                if (tempIndex < dataLength) {
                    tempIndex = tempIndex + 1
                } else if (loop) {
                    tempIndex = 0
                }
            } else if (temp < -SCROLL_OFFSET) {
                if (tempIndex > 0) {
                    tempIndex = tempIndex - 1
                } else if (loop) {
                    tempIndex = dataLength
                }
            }
            this.scrollFlatList(tempIndex);
        } catch (error) {
            this.scrollFlatList(0);
        }
    }

    /**
     * 滚动列表方法，并且设值
     * @param {*} tempIndex     滚动到的页面下标
     */
    scrollFlatList(tempIndex) {
        try {
            this.clearTimer();
            let scrollView = (tempIndex) => {
                InteractionManager.runAfterInteractions(() => {
                    this.refs.flatList.scrollToIndex({
                        index: tempIndex,
                        viewPosition: 0.5,
                        viewOffset: this.props.viewOffset,
                    })
                })
                this.initScrollData()
            }
            if (this.props.scrollPageIndex != null) {
                this.props.scrollPageIndexFun(tempIndex);
                scrollView(tempIndex)
            } else {
                this.setState({
                    scrollPageIndex: tempIndex
                }, () => {
                    scrollView(tempIndex)
                })
            }
        } catch (error) {
            this.initScrollData()
        }
    }

    /**
     * 重置数据，触发自动播放
     */
    initScrollData() {
        this.scrollStar = 0;
        this.scrollEnd = 0;
        this.setAutoPlay();
    }
}