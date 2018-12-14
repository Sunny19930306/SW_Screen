/**
 * 
 * 共用的背景面板（标题、时间）
 * 
 */


var RootPanel = function(){
    this.init()
}

mono.extend(RootPanel,Object,{
    init: function(){
        this.initPanel();
    },

    show: function(){

    },

    hide: function(){

    },

    initPanel: function(){
        var easyDraw = new hud.EasyDraw();
        easyDraw.ready();
        easyDraw.designWidth = "1920";
        easyDraw.designHeight = "1080";
        easyDraw.getRootView().style.zIndex = -999;

        hud.util.autoAdjustBounds(easyDraw, document.documentElement, 'clientWidth', 'clientHeight');
   
        this.addShape(easyDraw);
        
        this.rootPanel = easyDraw.getRootView();

        
        document.body.appendChild(this.rootPanel);
    },

    addShape: function(easyDraw){
       
        //时间
        easyDraw.add({
            id: 'DateTime1',
            hor: "left:7%",
            ver:"top:3%",
            name: 'DateTime',
            data: {
                size: '18px',
                color: it.firstStyle.dateTime.color,
                lineColor: it.firstStyle.dateTime.color,
            },
            cache: true,
            clip: true,
        });
        easyDraw.add({
            id: 'frameTime',
            hor: "left:22%",
            ver:"top:3%",
            name: 'frameTime',
            data: {
                size: '18px',
                color: it.firstStyle.dateTime.color
            },
            cache: true,
            clip: true,
        });
        
    }
      


})




