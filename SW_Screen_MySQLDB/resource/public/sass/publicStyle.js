/*
*
*前端样式修改
*所有样式未做默认值处理，若想修改为没有色值，请使用rgba(0,0,0,0),切勿为空。
*建议颜色值均使用rgb格式
*
*/
var it  = {};

it.firstStyle = {
    background:{
        //背景颜色
        color:"rgb(0,0,0)",
        //背景图片,若设置了背景图片，则背景颜色设置无效，可替换此目录下背景图片
        // src:"./images/background.png"
    },
    //标题
    title:{
        //添加logo，格式为路径，参考imgSrc，可放置在images下，建议图片尺寸不宜过大，宽高比接近
        logoImg:'./images/seer_1.png',
        // logoImg:null,
        //该路径为标题外框背景
        imgSrc:'./images/title.png',
        text:'AMB多机调度系统',
        size:'32px',
        color: 'rgb(137,217,255)'
    },
    //时间戳颜色
    dateTime: {
        color: 'rgb(0, 177, 255)'
    },
    //两侧渐变线 --->01010渐变
    splitLine: {
        //渐变线开始 0
        startColor: "rgba(75,130,135,0.4)",
        //渐变色结束 1
        endColor: "rgba(75,130,135,1)"
    },
     //底部标题
    innerTitle: {
        // 方框颜色
        hostSpotColor: "rgb(55,227,166)",
        // 字体颜色
        color:"rgb(137,217,255)",
        //渐变线开始颜色 0
        startColor: 'rgba(75,130,135,0.1)',
        //渐变线结束颜色 1
        endColor:"rgba(75,130,135,1)",
        //数字颜色
        numColor: 'rgb(255,255,0)'
    },
    //底部边框颜色
    border: {
        //边框颜色
        frameColor: "rgba(71,160,166,1)",
        //边框
        lineFrameColor: "rgba(109,248,250,1)"
    },
    // 底部饼图颜色
    chart: {
        // 饼图底部颜色
        color:"rgba(109,248,250,1)",
        //目标
        totalColor: "rgb(137,217,255)",
        //完成
        completeColor:"rgb(99,202,80)" ,
        //废品
        rejectColor:"rgb(246,83,73)",
        //合格
        qualifiedColor: 'rgba(255,255,0,1)',
    },
    // 详细信息颜色及图片
    detailedStatusPanel: {
        color: "rgb(137,217,255)",
        //详细信息栏图片，从左至右
        img1:'./images/equipment.png',
        img2:'./images/agv.png',
        img3:'./images/produce.png',
        img4:'./images/quality.png',

        //第二屏title,与图片对应的文字信息，从左至右
        text1:'工厂设备A详细状态',
        text2:'工厂设备B详细状态',
        text3:'AMB详细状态',
        text4:'当日生产详细状态'
    }
};

it.secondStyle = {
    //第二屏图表配置项
    eChart : {
        //x轴及网格颜色值
        xAxisColor:"#3be2ff",
        //y轴及网格颜色值
        yAxisColor:"#3be2ff",
        //折线颜色值
        lineColor: '#3be2ff',
        //折点颜色值s
        pointColor:'#3be2ff',
        //折点数字颜色值
        numColor: '#ffff48'
    }
}
