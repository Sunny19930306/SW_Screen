/**
 * 
 * 底部总面板（分割线、图表面板、详细状态面板）
 * 
 */


var BottomPanel = function(){
    this.init()
    
}

mono.extend(BottomPanel,Object,{
    init: function(){
        this.initPanel();
        it.chartPanel = new ChartPanel();
        it.detailedStatusPanel = new DetailedStatusPanel();
        
        chartPanel = it.chartPanel.getView();
        detailedStatusPanel = it.detailedStatusPanel.getView();
        this.bottomPanel.appendChild(chartPanel);
        this.bottomPanel.appendChild(detailedStatusPanel);
   
    },

    initPanel: function(){
        var easyDraw = new hud.EasyDraw();
        easyDraw.ready();
        easyDraw.designWidth = "1920";
        easyDraw.designHeight = "1080";
        easyDraw.getRootView().style.zIndex = 999;
        easyDraw.getRootView().style.top = "80%";
        easyDraw.getRootView().style.height = "20%";
        easyDraw.getRootView().style.width = "100%";
        easyDraw.getRootView().setAttribute('id','bottomPanel')

        this.addShape(easyDraw);

        hud.util.autoAdjustBounds(easyDraw, document.documentElement, 'clientWidth', 'clientHeight');
        this.bottomPanel = easyDraw.getRootView();
        
       
        
    },

    addShape: function(easyDraw){
        // 渐变分割线
        easyDraw.add({
            origin:{
                x:0,
                y:0
            },
            id:'dbline3',
            name:'tapered_horizon_line',
            hor:"left:50%",
            ver:"top:0%",
            cache:true,
            interact:true,
            data:{
                width:1920*0.9,
                height:3
            }
        })
    },

    show:function(){
        it.detailedStatusPanel.show();
       $(this.bottomPanel).appendTo($('#main'));
    },

    hide: function(){
        $(this.bottomPanel).remove()
    },

})


