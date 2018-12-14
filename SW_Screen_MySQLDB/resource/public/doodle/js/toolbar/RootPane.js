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
        hud.util.registerImage('title_image', it.doodleStyle.title.imgSrc ,callback);
        if(it.doodleStyle.title.logoImg){

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
                image.src = it.doodleStyle.title.logoImg;
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
                        text: it.doodleStyle.title.text,
                        color: it.doodleStyle.title.color,
                        size: it.doodleStyle.title.size,
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
                    text: it.doodleStyle.title.text,
                    color: it.doodleStyle.title.color,
                    size: it.doodleStyle.title.size,
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
            interact: true,
        })


      

    }
      


})




