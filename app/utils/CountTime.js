
export default class CountTime {

    countDownAction(that) {
        try {
            const codeTime = that.state.timerCount
            const now = Date.now();
            const overTimeStamp = now + codeTime * 1000 + 100/*过期时间戳（毫秒） +100 毫秒容错*/
            that.interval = setInterval(() => {
                /* 切换到后台不受影响*/
                const nowStamp = Date.now();
                if (nowStamp >= overTimeStamp) {
                    /* 倒计时结束*/
                    that.interval && clearInterval(that.interval);
                    that.setState({
                        timerCount: codeTime,
                    });
                    that.props.onEndFun && that.props.onEndFun();
                    that.viewEndFun && that.viewEndFun();
                } else {
                    let remainSecond = parseInt((overTimeStamp - nowStamp) / 1000);
                    // 总秒数
                    const leftTime = remainSecond;
                    // 天数
                    const day = parseInt(leftTime / (24 * 3600));
                    const dayStr = this.autoCompleNumber(day);
                    // 小时
                    remainSecond = parseInt(remainSecond % (24 * 3600));
                    const hour = parseInt(remainSecond / 3600);
                    const hourStr = this.autoCompleNumber(hour);
                    // 分钟
                    remainSecond = parseInt(remainSecond % 3600);
                    const minute = parseInt(remainSecond / 60);
                    const minuteStr = this.autoCompleNumber(minute);//minute < 10 ? '0' + minute : '' + minute;
                    // 秒
                    remainSecond = parseInt(remainSecond % 60);
                    const secondStr = this.autoCompleNumber(remainSecond);
                    that.setState({
                        timerCount: leftTime,
                        countdownObj: {
                            DD: dayStr,
                            HH: hourStr,
                            MM: minuteStr,
                            SS: secondStr,
                        }
                    });
                }
            }, 1000);
        } catch (error) {
            that.interval && clearInterval(that.interval);
        }
    }

    autoCompleNumber(num) {
        if (isNaN(num) || num === '' || num === ' ') {
            return '00';
        } else {
            if (parseInt(num) < 10 && parseInt(num) > -1) {
                return '0' + num;
            } else {
                return '' + num;
            }
        }
    }
}
