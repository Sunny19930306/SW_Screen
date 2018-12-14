/**
 * 
 * 
 * 详细状态面板
 * 
 */
var DetailedStatusPanel = function(){
    
    this.init()
   
}

mono.extend(DetailedStatusPanel,Object,{
    init: function(){
        this.initPanel();
       
    },

    show: function(){
        this.addEvent();
    },

    hide: function(){
        this.removeEvent();
        this.easyDraw.clear();
    },

    getView: function(){
        return this.detailedStatusPanel;
    },

    initPanel: function(){
        var easyDraw = new hud.EasyDraw();
        this.easyDraw = easyDraw;
        easyDraw.ready();
        easyDraw.designWidth = "1920";
        easyDraw.designHeight = "1080";
        easyDraw.getRootView().style.width ='50%';
        easyDraw.getRootView().style.left = '50%';

        hud.util.autoAdjustBounds(easyDraw, document.documentElement, 'clientWidth', 'clientHeight');
        this.addShape(easyDraw);
        this.detailedStatusPanel = easyDraw.getRootView();

    },

    addShape: function(easyDraw){
        var callback = function(){
            easyDraw.dirty();
        }
        hud.util.registerImage('equipment', it.firstStyle.detailedStatusPanel.img1,callback);
        hud.util.registerImage('agv',it.firstStyle.detailedStatusPanel.img2 ,callback);
        hud.util.registerImage('produce',it.firstStyle.detailedStatusPanel.img3 ,callback);
        hud.util.registerImage('quality',it.firstStyle.detailedStatusPanel.img4 ,callback);
        hud.util.registerImage('arrow', './images/arrow.png',callback);
    
    
    
        //两个边框
        easyDraw.add({
            w:2500,
            h:600,
            name:"border_box",
            id:"box4",
            hor:('right','5%'),
            y:30,
            scale:0.66,
            cache:true,
            interact:true,
            data:{
                frameColor: it.firstStyle.border.frameColor,
                lineFrameColor:it.firstStyle.border.lineFrameColor
            },
            children:[{
                x:180,
                y:80,
                id:'equipment',
                name:'equipment',
                cache:true,
                interact:true,
                children:[{
                    x:70,
                    y:100,
                    name:'text',
                    data:{
                        text: '设备A详细状态',
                        color: it.firstStyle.detailedStatusPanel.color,
                        size: "18px",
                        family:"思源黑体",
                        textAlign:"center",
                    }
                },{
                    x:-80,
                    y:15,
                    name:'div',
                    cache:true,
                    data:{
                        showHostSpot:false,
                        _content:'<img src="./images/arrow.png" class="arrow" id="equipment"/>'
                    }
                }]
            },{
                x:40,
                y:-70,
                name:'inside_title',
                data:{
                    text:'设备详细状态',
                    squareColor:it.firstStyle.innerTitle.hostSpotColor,
                    color: it.firstStyle.innerTitle.color,
                    startColor: it.firstStyle.innerTitle.startColor,
                    endColor: it.firstStyle.innerTitle.endColor,
                }
            },{
                x:420,
                y:80,
                id:'quality',
                name:'quality',
                cache:true,
                interact:true,
                children:[{
                    x:70,
                    y:100,
                    name:'text',
                    data:{
                        text: '设备B详细状态',
                        color: it.firstStyle.detailedStatusPanel.color,
                        size: "18px",
                        family:"思源黑体",
                        textAlign:"center",
                    }
                },{
                    x:-220,
                    y:15,
                    name:'div',
                    cache:true,
                    data:{
                        showHostSpot:false,
                        _content:'<img src="./images/arrow.png" class="arrow" id="quality" />'
                    }
                }]
            },
            {
                x:680,
                y:80,
                id:'agv',
                name:'agv',
                cache:true,
                interact:true,
                children:[{
                    x:40,
                    y:100,
                    name:'text',
                    data:{
                        text: 'AMB详细状态',
                        color: it.firstStyle.detailedStatusPanel.color,
                        size: "18px",
                        family:"思源黑体",
                        textAlign:"center",
                    }
                },{
                    x:-375,
                    y:15,
                    name:'div',
                    cache:true,
                    data:{
                        showHostSpot:false,
                        _content:'<img src="./images/arrow.png" class="arrow" id="agv"/>'
                    }
                }]
            },{
                x:920,
                y:80,
                id:'produce',
                name:'produce',
                cache:true,
                interact:true,
                children:[{
                    x:40,
                    y:100,
                    name:'text',
                    data:{
                        text: '当日生产详细状态',
                        color: it.firstStyle.detailedStatusPanel.color,
                        size: "18px",
                        family:"思源黑体",
                        textAlign:"center",
                    }
                },{
                    x:-515,
                    y:15,
                    name:'div',
                    cache:true,
                    data:{
                        showHostSpot:false,
                        _content:'<img src="./images/arrow.png" class="arrow" id="produce"/>'
                    }
                }]
            }]
        });
        
    
        
    
     
        
    },

    addEvent: function(){
        var self = this;
        setTimeout(function(){
            $('.arrow').on('click',self.handleCheckIn.bind(self))
        
         },1000)
    },

    removeEvent: function () {
        $('.arrow').off('click',this.handleCheckIn.bind(this))
    },

    handleCheckIn: function(e){
        it.firstScreen.hide()
        it[e.target.id].show()
    }

})
