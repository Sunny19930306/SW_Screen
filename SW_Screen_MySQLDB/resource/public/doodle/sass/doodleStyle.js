/*
*
*编辑器样式修改
*所有样式未做默认值处理，若想修改为没有色值，请使用rgba(0,0,0,0),切勿为空。
*建议颜色值均使用rgb格式
*
*/

it.doodleStyle = {
    background:{
        //背景颜色
        color:'rgb(0,0,0)',
        //背景图片，若设置背景图片，则背景颜色不生效
        // src:'url(./images/background.png)'
    },
    //标题
    title:{
        //添加logo，格式为路径，参考imgSrc，可放置在doodle/images下，建议图片尺寸不宜过大，宽高比接近
        logoImg:'./images/seer_1.png',
        // logoImg:null,
        //文字内可识别空格，调整文字之间间距，可使用单个空格
        text:'场景编辑器',
        size:'35px',
        imgSrc:'./images/title.png',
        color: 'rgb(137,217,255)'
    },
    //属性面板
    propertySheet:{
        //标题颜色
        titleColor: 'rgb(59, 221, 255)',
        //边框颜色
        borderColor: 'rgb(59,211,255)',
        // 背景颜色
        background: 'rgba(31,75,118,0.4)',
        //字体颜色
        color: 'rgb(163,170,173)',
    }
    
}