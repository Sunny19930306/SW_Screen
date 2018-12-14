var SecondPanel = function(theme , rootDiv){
    this.rootDiv = rootDiv;
    this.init(theme);
}

/**
 * 
 * 第二页面板（标题、右上角按钮）
 * 
 */

mono.extend(SecondPanel,Object,{
    init: function(theme){

        if(theme === 'equipment'){
            this.theme = it.firstStyle.detailedStatusPanel.text1;
        }else if(theme === 'quality'){
            this.theme = it.firstStyle.detailedStatusPanel.text2;
        }else if(theme === 'agv'){
            this.theme = it.firstStyle.detailedStatusPanel.text3;
        }else if(theme === 'produce'){
            this.theme = it.firstStyle.detailedStatusPanel.text4;
        }

        this.initPanel();
        this.close = new CloseButton(theme , this.rootDiv);
       
    },

    show: function(){
      
    },

    hide: function(){
    
    },

    initPanel: function(){
        var easyDraw = new hud.EasyDraw();
        this.easyDraw = easyDraw;
        easyDraw.ready();
        easyDraw.designWidth = "1920";
        easyDraw.designHeight = "1080";
        easyDraw.getRootView().style.zIndex = -999;

        hud.util.autoAdjustBounds(easyDraw, document.documentElement, 'clientWidth', 'clientHeight');
   
        this.addShape(easyDraw);
        
        this.rootPanel = easyDraw.getRootView();
   
        $(this.rootPanel).appendTo(this.rootDiv);
        
    
    },

    addShape: function(easyDraw){
        //注册图片
        hud.util.registerImage('title_frame', './images/title.png',callback);
     

        var callback = function(){
            easyDraw.dirty();
        }
        hud.util.registerImage('title_image', it.firstStyle.title.imgSrc ,callback);
        if(it.firstStyle.title.logoImg){

            function getBase64Image(img, width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = width ? width : img.width;
                canvas.height = height ? height : img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                var dataURL = canvas.toDataURL();
                return dataURL;
              }

                var image = new Image();
                image.src = it.firstStyle.title.logoImg;
                image.onload = function(){
                    var base64Image = getBase64Image(image,40,40);
                    hud.util.registerImage('logo',base64Image ,callback);                
                }
        
            easyDraw.add({
                w:80,
                h:80,
                id: 'logo',
                name: 'logo',
                hor: "left:43.5%",
                ver:"top:5%",
                cache: true,
                interact: true,
                children: [{
                    x:150,
                    y:-25,
                    name: 'text',
                    data: {
                        text: this.theme,
                        color: it.firstStyle.title.color,
                        size: it.firstStyle.title.size,
                        family:"思源黑体",
                    },
                }]
            })
        }else{
            easyDraw.add({
                id: 'logo',
                name: 'text',
                hor: "left:50%",
                ver:"top:3%",
                cache: true,
                interact: true,
                data: {
                    text: this.theme,
                    color: it.firstStyle.title.color,
                    size: it.firstStyle.title.size,
                    family:"思源黑体",
                },
            })
        }

        easyDraw.add({
            id: 'title',
            name: 'title_image',
            hor: "left:30%",
            ver:"top:2%",
            cache: true,
        })
        
    },
})




//右上角返回按钮

var CloseButton = function(theme , rootDiv){
    this.rootDiv = rootDiv;
    this.theme = theme;
    this.init(theme);
}

mono.extend(CloseButton,Object,{
    init: function(theme){
        this.initPanel();
        this.addEvent(theme);
    },

    initPanel: function(){
        var easyDraw = new hud.EasyDraw();
        this.easyDraw  = easyDraw;
        easyDraw.ready();
        easyDraw.designWidth = "1920";
        easyDraw.designHeight = "1080";
        easyDraw.getRootView().style.zIndex = 999;
        easyDraw.getRootView().style.width = '4%';
        easyDraw.getRootView().style.left = '95%';
        easyDraw.getRootView().style.height = '10%';
        easyDraw.getRootView().id = this.theme + 'Close';

        hud.util.autoAdjustBounds(easyDraw, document.documentElement, 'clientWidth', 'clientHeight');
   
        this.addShape(easyDraw);
        
        this.rootPanel = easyDraw.getRootView();

        $(this.rootPanel).appendTo(this.rootDiv);

        
      
    },

    addEvent: function(theme){
        var self =this;
        setTimeout(function(){
            $('#'+theme+'Close .close').on('click',self.handleClick.bind(self));
        },500)
    },

    removeEvent: function (theme) {
        $('#'+theme+'Close .close').off('click',this.handleClick.bind(this));
    },

    handleClick: function () {
        it.firstScreen.show();
        it.firstScreen.setZoomView();
        it[this.theme].hide();
    },

    addShape: function(easyDraw){
        
        easyDraw.add({
            x:0,
            ver:('top','3%'),
            name:'div',
            id:this.theme,
            cache:true,
            data:{
                showHostSpot:false,
                _content:'<img src="./images/close.png" class="close"/>'
            }
        })
    },

    show: function(){

 
    },

    hide: function(){
      
    }
})





