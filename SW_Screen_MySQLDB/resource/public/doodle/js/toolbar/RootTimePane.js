/**
 * 
 * 共用的背景面板（标题、时间）
 * 
 */


var RootPane = function(){
    this.init()
}

twaver.Util.ext(RootPane,Object,{
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
       
        var callback = function(){
            easyDraw.dirty();
        }
        hud.util.registerImage('title_image', './images/title.png',callback);
       
        easyDraw.add({
            id: 'title',
            name: 'title_image',
            hor: "left:30%",
            ver:"top:2%",
            cache: true,
            interact: true,
        })


      
        
    }
      


})




