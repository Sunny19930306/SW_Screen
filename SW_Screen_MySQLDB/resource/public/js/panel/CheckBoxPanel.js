//只负责生成面板
var CheckBoxPanel = function (theme , headerList , rootDiv) {
    this.unit = {};
    this.theme = theme;
    this.tableHeader = it.allDatas['tableHeader'];
	this.headerList = headerList;
    this.temp = new Array();
    this.init(theme);
}


//将信息存储为{item1:true,item2:false}
mono.extend(CheckBoxPanel, Object, {
    init: function (theme) {
        var data = this.headerList[theme];
        this.data = data;
        this.initPanel(data);
    },



    initItemBg: function (data) {
        if(!data){
            return;
        }
        var index = 0;
        for(var key in data){
            if(data[key]["showInSecond"]){
                $('#'+this.theme+'Dom .item').eq(index).css('backgroundImage','url(../images/searchImg/background02.png)').val(1);
            }
            index++;
        }
       
    
     
    },

    initPanel: function (data) {
        var self = this;
        this.checkBox = $('<div class = "checkBox"><div class="header">筛选</div></div>');
        $('<div class = "searchDiv" ><input type = "text" id="in" placeholder="请输入设备名称"><button class="btn_search"></input></div>').appendTo(this.checkBox)
        this.filterDiv = $('<div class = "filterDiv"></div>');
        this.filterDiv.appendTo(this.checkBox);


        for (var i in data) {
        
            $('<div class = "item" >' + i+ '</div>').appendTo(this.filterDiv)
        }

        $('<div class = "button">确认</div>').appendTo(this.filterDiv);

        this.checkBox.appendTo($('#'+this.theme+'Dom'));
        this.initItemBg(this.data);


    },

    show: function () {
     

    },

    hide: function () {
        
    }




}) 