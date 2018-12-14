var FirstRootPanel = function(){
    this.init();
}

/**
 * 
 * 背景面板（标题、时间、侧边栏）
 * 
 */

mono.extend(FirstRootPanel,Object,{
    init: function(){
        this.initPanel();
    },

    show: function(){
        $(this.rootPanel).appendTo($('#main'));
    },

    hide: function(){
        $(this.rootPanel).remove();
        this.easyDraw.clear();
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

      
    },

    addShape: function(easyDraw){
        //注册图片

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
                        text: it.firstStyle.title.text,
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
                    text: it.firstStyle.title.text,
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
            interact: true,
        })

        

        //两边的线
        easyDraw.add({
            id:'dbline1',
            name:'dbline',
            hor:"left:4%",
            ver:"top:10%",
            cache:true,
            interact:true,
            data:{
                startColor: it.firstStyle.splitLine.startColor,
                endColor: it.firstStyle.splitLine.endColor,
            },
            children:[
                {
                    name: 'dbline',
                    data: {
                        beginPoint: {
                            x:15,
                            y: 0
                        },
                        endPoint: {
                            x:15,
                            y:600
                        },
                        startColor: it.firstStyle.splitLine.startColor,
                        endColor: it.firstStyle.splitLine.endColor,
                        lineWidth: 2
                    }
                }
            ]
        })

        easyDraw.add({
            id:'dbline2',
            name:'dbline',
            hor:"right:4%",
            ver:"top:10%",
            cache:true,
            interact:true,
            data:{
                startColor: it.firstStyle.splitLine.startColor,
                endColor: it.firstStyle.splitLine.endColor,
            },
            children:[
                {
       
                    name: 'dbline',
                    data: {
                        beginPoint: {
                            x:15,
                            y: 0
                        },
                        endPoint: {
                            x:15,
                            y:600
                        },
                        startColor: it.firstStyle.splitLine.startColor,
                        endColor: it.firstStyle.splitLine.endColor,
                        lineWidth: 2
                    }
                }
            ]
        })
    
    },
})




