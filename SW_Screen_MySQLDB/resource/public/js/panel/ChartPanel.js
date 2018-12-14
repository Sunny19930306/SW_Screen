/**
 * 
 * 图表面板
 * 
 */

var ChartPanel =function(){
    //默认数据
    this.waitingAccreditationNum = 440;
    this.complete = 560;
    this.total = 1000;
    this.rejected = 12;
    this.taktTime = 110;
    this.data ={
        completedNum:{},
        waitingAccreditationNum:{},
        rejected:{},
        accreditationSpeed:{}
    }
    this.init()
}

mono.extend(ChartPanel,Object,{
    init: function(){
        this.initPanel();
        this.loadRealTimeData();
    },

    loadRealTimeData: function(){

        //TODO:  处理数据，得到总和
        var self = this;
        var datas = this.data;
        it.event.on('DeviceStatus',function(type,data){
            //得到每一项的数据
            var dataInfo = JSON.parse(data.data);

            //存储      
            datas["completedNum"][data.id] = dataInfo["completedNum"];
            datas["waitingAccreditationNum"][data.id] = dataInfo["waitingAccreditationNum"];
            datas["rejected"][data.id] = dataInfo["rejected"];
            datas["accreditationSpeed"][data.id] = dataInfo["accreditationSpeed"];

            //更新数据
            self.upData();
            //刷新面板
            self.refresh();
          
        })
    },

    upData: function(){
        //完成数目(√)+待完成数目（√）=总数目（或者收本数）   合格数目+废品数目（√）=完成数目（√）    生产节拍数目=制证速度（√）
 
        var datas = this.data;

        var totalList = [];
        var taktTimeList = [];
        var completeList = [];
        var waitingAccreditationNumList = [];
        var rejectedList = []


        var itemCompleted = datas["completedNum"];
        for(var key in itemCompleted){
            var numString = parseFloat(itemCompleted[key]);
            completeList.push(numString);
            totalList.push(numString)
        }

        var itemRejected = datas["rejected"];
        for(var key in itemRejected){
            var numString = parseFloat(itemRejected[key]);
            rejectedList.push(numString);
        }

        var itemAccreditationSpeed = datas["accreditationSpeed"];
        for(var key in itemAccreditationSpeed){
            var numString = parseFloat(itemAccreditationSpeed[key]);
            taktTimeList.push(numString);
        }

        var itemWaitingAccreditationNum = datas["waitingAccreditationNum"];
        for(var key in itemWaitingAccreditationNum){
            var numString = parseFloat(itemWaitingAccreditationNum[key]);
            waitingAccreditationNumList.push(numString);
            totalList.push(numString);
        }


        this.rejected = sumAll(rejectedList);
        this.complete = sumAll(completeList);
        this.taktTime = sumAll(taktTimeList);
        this.total = sumAll(totalList);



        //加法
        function sumAll(arr){
            var sum =0;
            arr.forEach(function(data){
                sum =  sum + data;
            })
            return sum;
        }
    
    },

    refresh: function(){

        var total = this.total;
        var qualified = this.complete - this.rejected;
     
        this.easyDraw.allShapeMap["taktTime"].data.text = this.taktTime;
        this.easyDraw.allShapeMap["total"].data.text = total;
        this.easyDraw.allShapeMap["complete"].data.text = this.complete;
        this.easyDraw.allShapeMap["rejected"].data.text = this.rejected;
        this.easyDraw.allShapeMap["qualified"].data.text = qualified;
        
        // chart2角度计算
        // endRingAngel:360-((this.complete-this.rejected)/this.total)*360,
        // endSectorAngel:this.rejected/(this.complete-this.rejected)*360,

        // chart1角度计算
        // endRingAngel:360-(this.complete/this.total)*360

        var chart1EndRingAngel = 360-(this.complete/total)*360;
        var chart2EndRingAngel = 360-(qualified/total)*360;
        var chart2EndSectorAngel = this.rejected/qualified*360;

        

        this.easyDraw.allShapeMap["chart1"].data.endRingAngel = chart1EndRingAngel;
        this.easyDraw.allShapeMap["chart2"].data.endRingAngel = chart2EndRingAngel;
        this.easyDraw.allShapeMap["chart2"].data.endSectorAngel = chart2EndSectorAngel;

    },

    show: function(){
        // bottomPanel.appendChild(this.chartPanel);
    },

    hide: function(){
        this.easyDraw.clear();
    },

    getView: function(){
        return this.chartPanel;
    },

    initPanel: function(){
        var easyDraw = this.easyDraw = new hud.EasyDraw();
        easyDraw.ready();
        easyDraw.designWidth = "1920";
        easyDraw.designHeight = "1080";
        
        easyDraw.getRootView().style.width ='50%';
 
        hud.util.autoAdjustBounds(easyDraw, document.documentElement, 'clientWidth', 'clientHeight');
        this.addShape(easyDraw);

        this.chartPanel = easyDraw.getRootView()
      
    },

    addShape: function(easyDraw){

    

        //两个边框
        easyDraw.add({
            w:2500,
            h:600,
            name:"border_box",
            id:"box4",
            cache:true,
            interact:true,
            hor:('left','7%'),
            y:30,
            scale:0.66,
            data:{
                frameColor: it.firstStyle.border.frameColor,
                lineFrameColor:it.firstStyle.border.lineFrameColor
            },
            children:[
                {
                    x:40,
                    y:-70,
                    name:'inside_title',
                    data:{
                        text: "当日生产信息",
                        family: "思源黑体",
                        size:"25px",
                        color: it.firstStyle.innerTitle.color,
                        squareColor:it.firstStyle.innerTitle.hostSpotColor,
                        startColor: it.firstStyle.innerTitle.startColor,
                        endColor: it.firstStyle.innerTitle.endColor,
                    },
                    children:[{
                        name: "tapered_line",
                        data: {
                            beginPoint: {
                                x: 150,
                                y: 110
                            },
                            endPoint: {
                                x: 356,
                                y: 110
                            },
                            lineWidth: 0.5
                        }
                    }]
                },{
                    x:600,
                    y:-70,
                    name:'inside_title',
                    data:{
                        text: "生产节拍:         /h",
                        family: "思源黑体",
                        size:"25px",
                        color: it.firstStyle.innerTitle.color,
                        squareColor:it.firstStyle.innerTitle.hostSpotColor,
                        startColor: it.firstStyle.innerTitle.startColor,
                        endColor: it.firstStyle.innerTitle.endColor,
                    },
                    children:[{
                            name:'text',
                            id:'taktTime',
                            x:325,
                            y:90,
                            origin: {
                                x: 0.5,
                                y: 0.5
                            },
                            data: {
                                text: this.taktTime,
                                family: "思源黑体",
                                size:"25px",
                                color: it.firstStyle.innerTitle.numColor,
                        
                            }
                    },{
                        name: "tapered_line",
                        data: {
                            beginPoint: {
                                x: 150,
                                y: 110
                            },
                            endPoint: {
                                x: 356,
                                y: 110
                            },
                            lineWidth: 2
                        }
                    }]
                },{
                    name:'chart1',
                    id:'chart1',
                    x:280,
                    y:150,
                    data:{
                        //  360-(560/1000)*360    计算结果 完成：560，总量1000
                        endRingAngel:360-(this.complete/this.total)*360,
                        ringColor:it.firstStyle.chart.completeColor,
                        gradientColor: it.firstStyle.chart.color,
                    },
                    children:[
                        {
                            name:'execution',
                            x:170,
                            y:-40,
                            data: {
                                text: "目标:"
                            },
                            children:[{
                                name:"square",
                                x:-60,
                                y:-8,
                                data:{
                                    w:26,
                                    h:16,
                                    squareColor:it.firstStyle.chart.totalColor,
                                }
                            },{
                                name:"text",
                                id:"total",
                                x:65,
                                y:0,
                                data:{
                                    text:this.total,
                                    color: it.firstStyle.chart.totalColor,
                                    family: "思源黑体",
                                    size:"30px",
                                }
                            }]
                        },
                        {
                            name:'execution',
                            x:170,
                            y:40,
                            data: {
                                text: "完成:",
                            },
                            children:[{
                                    name:'square',
                                    x:-60,
                                    y:-8,
                                    data:{
                                        w:26,
                                        h:16,
                                        squareColor:it.firstStyle.chart.completeColor,
                                    }
                                },{
                                    name:"text",
                                    cache:true,
                                    id:"complete",
                                    x:65,
                                    y:0,
                                    data:{
                                        text:this.complete,
                                        color: it.firstStyle.chart.completeColor,
                                        family: "思源黑体",
                                        size:"30px",
                                    }
                            }]
                        }
                    ]
                },
                {
                    name:'chart2',
                    id:'chart2',
                    x:840,
                    y:150,
                    data:{
                        // 2/558
                        radius:78,
                        endSectorAngel:this.rejected/(this.complete-this.rejected)*360,
                        endRingAngel:360-((this.complete-this.rejected)/this.total)*360,
                        ringColor:it.firstStyle.chart.qualifiedColor,
                        sectorColor: it.firstStyle.chart.rejectColor,
                        gradientColor: it.firstStyle.chart.color,
                    },
                    children:[
                        {
                            name:'execution',
                            x:170,
                            y:-40,
                            data: {
                                text: "合格:",
                            },
                            children:[{
                                    name:'square',
                                    x:-60,
                                    y:-8,
                                    data:{
                                        w:26,
                                        h:16,
                                        squareColor:it.firstStyle.chart.qualifiedColor,
                                    }
                                },{
                                    name:"text",
                                    x:65,
                                    y:0,
                                    id:'qualified',
                                    data:{
                                        text:(this.complete-this.rejected),
                                        color: it.firstStyle.chart.qualifiedColor,
                                        family: "思源黑体",
                                        size:"30px",
                                    }
                            }]
                        },
                        {
                            name:'execution',
                            x:170,
                            y:40,
                            data: {
                                text: "废品:",
                            },
                            children:[{
                                    name:'square',
                                    x:-60,
                                    y:-8,
                                    data:{
                                        w:26,
                                        h:16,
                                        squareColor:it.firstStyle.chart.rejectColor,
                                    }
                                },{
                                    name:"text",
                                    x:65,
                                    y:0,
                                    id:"rejected",
                                    data:{
                                        text:this.rejected,
                                        color: it.firstStyle.chart.rejectColor,
                                        family: "思源黑体",
                                        size:"30px",
                                    }
                            }]
                        }
                    ]
                }
            ]
        });
    },


})
