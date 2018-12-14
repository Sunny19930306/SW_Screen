/**
 *
 * 用于配置一些客户的属性
 *
 */
var customer = {
    pathAnimate: {
        //动画速度，单位为秒，建议动画时间略短于推送时间
        speed:30,
    },
    realData: {
        //当前位置的字段，value中的值改为当前推送的字段名
        currentStation : "current_station",
        // currentStation : "currentSite",
    },
    carousel: {
        //是否开始轮播功能
        enable: true
    },
    eChart: {
        //用于控制第二屏的echart图表
        //由于eChart宽度有限，8~13个效果较好
        num: 30,
    }
}

/**
 *
 * 配置轮播
 *
 */

var theme = {
    firstScreen: {
        //屏幕停留时间，基础单位秒，设置为0直接跳过，只有第一屏有默认值
        duration: 10,
    },
    equipment: {
        duration: 0,
    },
    quality: {
        duration: 0,
    },
    agv: {
        duration: 20,
    },
    produce: {
        duration: 0,
    }
}

/**
 *
 * 用于拓扑图元素样式的配置，修改后，编辑器和前端显示样式均改变
 *
 */

var topoStyle = {
        //节点名称
        label:{
            //控制名称是否显示
            showLabel:true,
            color:'rgba(255, 255, 255, 1)',
            //名称位置： 可选值top、bottom、left、right
            position:"bottom",
            //字体大小及字体(必须和字体一起使用，格式如示例)
            font: "12px arial",
            //偏移量，用于微调label位置
            xOffset:0,
            yOffset:8,

        },
        //外墙
        outerWall: {
            outLineColor: 'rgba(101,184,255,1)',
            //宽度
            lineWidth: 10,
        },
        //内墙
        innerWall: {
            color: "rgba(138,243,255,1)"
        },
        //节点(圆点的样式)  --->point
        point: {
            //内圆颜色
            color: 'rgba(102, 204, 255, 1)',
            //内圆大小
            r:16,
            //外圈颜色
            outColor:'#238475',
            //外环边线粗细
            width:4,
        },
        //设备框(设备放置的框) --->location
        equipment: {
            //方框背景
            backgroundColor: 'rgba(255, 255, 255, 1)',
            //边框颜色
            borderColor: '#238475',
            // 框内字体颜色
            textColor: 'blue',
        },
        //连线及箭头  --->path
        linkAndArrow: {
            //连线颜色
            linkColor: 'rgb(44,233,255)',
            //箭头颜色
            arrowColor: 'rgb(109,216,89)',
            //箭头宽度
            arrowWidth: 32,
            //箭头长度
            arrowHeight: 32
        },
        //设备与节点之前虚线  --->location与point之间的连线
        dashed: {
            color: 'rgb(125, 206, 255)'
        },
        //通道
        channel:{
            color: 'rgba(84, 209, 252, 0.5)',
        },
        // 窗户
        window: {
            color: "#fff"
        },
        //门
        door: {
            color:'rgba(109,248,250,1)'
        },
        //柱子
        pillar: {
            color:'rgba(74,126,159,1)'
        },
           //背景网格
    grid:{
        //zoom值从小到大
        zoom1Color:'rgba(46,63,71,0.7)',
        zoom2Color:'rgba(46,63,71,0.7)',
        zoom3Color:'rgba(46,63,71,0.7)',
        zoom4Color:'rgba(46,63,71,0.7)',
    },
}
