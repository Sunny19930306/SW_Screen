var PropertySheet = function (box, network, propertySheet) {
    this.box = box;
    this.network = network;
    this.propertySheet = propertySheet;
    this.init();
}

it.Utils.ext(PropertySheet, Object, {
    init: function () {
        this.initPane();

        this.propertySheet.setSelectColor("rgba(31, 75, 118, 0.2)");
        this.propertySheet.setIndent(0);
        this.propertySheet.setRowHeight(30);
        this.propertySheet.setPropertyNameWidth(70);
        this.propertySheet.getExpandIcon=function(){
            return false;
        }

        //重载表头样式
        this.propertySheet.renderCategory = function(div,categoryName){
          
            $('<div class="titleFont">'+categoryName+'</div>').appendTo($(div));
            $(".titleFont").css('color',it.doodleStyle.propertySheet.titleColor).css('fontSize','20px');
            $(".titleFont").parent().css('background','transparent').css('borderStyle','none');
            $(div).next().children().remove();
           
            $('<div class="titleLine"></div>').appendTo($(div));
            $('.titleLine').css('background','linear-gradient(to right, rgba(255, 255, 255, 0),#5DDDD3,rgba(255,255,255,0))');
        }
    
        this.sheetBox = this.propertySheet.getPropertyBox();

        //设置共有属性，例如ID等信息
        var property = this.addClientProperty(this.sheetBox, 'ID', "配置属性", '业务ID');
        property.isVisible = function (data) {
            var flag = data.getClient('category');
            if(flag ==='point' || flag ==='equipment' ||flag ==="certification"  || flag === "charge" || flag ==="quality"|| flag ==='link'){
                return false;
            }
            return true;
            
        };

        var property = this.addClientProperty(this.sheetBox, 'name', "配置属性", '业务ID')
        property.isVisible = function (data) {
            var flag = data.getClient('category');
            if(flag ==="point" || flag ==="certification" || flag === "equipment"|| flag ==="link"){
                return true
            }else {
                return false
            }
        };

        //除了墙都显示旋转角度
        var property = this.addAccessorProperty(this.sheetBox, 'angle', "配置属性", '旋转角度');
        property.isVisible = function (data) {
            var flag = data.getClient('category');
            if(data instanceof make.Default.WallShapeNode || data instanceof twaver.Link ||flag ==='point'){
                return false;
            }else{
                return true;
            }
        };


        //设置设备的属性，长度，宽度
        var property = this.addAccessorProperty(this.sheetBox, 'width', "配置属性", '长度');
        property.isVisible = function (data) {
            var flag = data.getClient('category')
            if(flag ==='quality' || flag ==='certification' || flag ==='charge'){
                return true;
            }else{
                return false;
            }
        };
        var property = this.addAccessorProperty(this.sheetBox, 'height', "配置属性", '宽度');
        property.isVisible = function (data) {
            var flag = data.getClient('category')
            if(flag ==='quality' || flag ==='certification' || flag ==='charge'){
                return true;
            }else{
                return false;
            }
        };

        var property = this.addStyleProperty(this.sheetBox, 'link.color', "配置属性", '颜色');
        property.isVisible = function (data) {
            var flag = data.getClient('category')
            if (flag === 'channel') {
                return true;
            } else {
                return false;
            }
        };


        var property = this.addStyleProperty(this.sheetBox, 'vector.outline.width', "配置属性", '宽度');
        property.isVisible = function (data) {
            var flag = data.getClient('category')
            if (flag === 'channel') {
                return true;
            } else {
                return false;
            }
        };
        

        //设置设备的属性，X，Y轴的位置
        var propertyX = this.addAccessorProperty(this.sheetBox, 'location', "配置属性", 'X轴位置');
        propertyX.setValue = function(data ,value ,view){
            data.setX(value);
        }
        propertyX.getValue = function(data){
            return data.getX()
        }
        propertyX.isVisible = function (data) {
            var flag = data.getClient('editable')
            return flag === "onlyRotate";
        };



        var propertyY = this.addAccessorProperty(this.sheetBox, 'location', "配置属性", 'Y轴位置');
        propertyY.getValue = function(data){
            return data.getY()
        }
        propertyY.setValue = function(data ,value ,view){
            data.setY(value);
        }
        propertyY.isVisible = function (data) {
            var flag = data.getClient('editable')
            return flag === "onlyRotate";
        };
    },

    initPane: function () {
        this.sheetView = this.propertySheet.getView();
        var sheetView = this.sheetView;
        // sheetView.style.background = 'transparent';
        sheetView.style.position = 'absolute';
        sheetView.style.top = '120px';
        sheetView.style.right = '30px';
        sheetView.style.width = '270px';
        sheetView.style.height = '250px';
        sheetView.style.zIndex = '999';
        sheetView.style.display = 'none';
        sheetView.id = 'sheetView';
      

        document.body.appendChild(sheetView);

        this.propertySheet.setEditable(true);
    },

    addStyleProperty: function (box, propertyName, category, name) {
        return this._addProperty(box, propertyName, category, name, 'style');
    },
    addClientProperty: function (box, propertyName, category, name) {
        return this._addProperty(box, propertyName, category, name, 'client');
    },
    addAccessorProperty: function (box, propertyName, category, name) {
        return this._addProperty(box, propertyName, category, name, 'accessor');
    },
    _addProperty: function (box, propertyName, category, name, proprtyType) {
        //设置property
        var property = new twaver.Property();
        property.setCategoryName(category);
     
        
        //设置属性名
        property.setName(name);
        property.setEditable(true);
        //三种属性设置（client、accessor、style）
        property.setPropertyType(proprtyType);
        //设置对应的属性名
        property.setPropertyName(propertyName);

        var valueType;
        //返回数据类型
        if (proprtyType === 'style') {
            valueType = twaver.SerializationSettings.getStyleType(propertyName);
        } else if (proprtyType === 'client') {
            valueType = twaver.SerializationSettings.getClientType(propertyName);
        } else {
            valueType = twaver.SerializationSettings.getPropertyType(propertyName);
        }
        if (valueType) {
            property.setValueType(valueType);
        }

        property.renderValue = function (params) {
            

        
            var div = params.rowDiv;
            div.className = 'propertyItem';
            div.style.borderWidth = "0";
           
            $('<div class = "line"></div>').appendTo($(div));
            $('.line').css('background','linear-gradient(to right, rgba(255, 255, 255, 0),#5DDDD3,rgba(255,255,255,0))');
    
            params.view._dataDiv.style.border = '1px solid '+it.doodleStyle.propertySheet.borderColor;
            params.view._dataDiv.style.width = '260px'; 
            params.view._dataDiv.className = 'rootDiv';
            params.view._dataDiv.style.background = it.doodleStyle.propertySheet.background;
            params.valueRender.style.borderStyle = "none";
            params.valueRender.style.width = '160px';
            params.valueRender.className = 'valueDiv';
            params.valueRender.style.color = it.doodleStyle.propertySheet.color;
            params.valueRender.style.background = "transparent";
            params.nameRender.style.paddingLeft = '20px';
            params.nameRender.style.borderStyle = "none";
           


            var value = params.value;
            var enumInfo = property.getEnumInfo();
            if (enumInfo && !Array.isArray(enumInfo)) {
              value = enumInfo.map[value];
            }
            if (params.view.isCellEditable(params.data, property)) {
              params.enumInfo = enumInfo;
              params.valueRender._editInfo = params;
            }
      
            (function (value, div, view, innerText) {
              if (value == null) {
                return;
              }
      
              var text = view._stringPool.get();// 获取需要添加的属性框
              text.style.whiteSpace = 'nowrap';
              text.style.verticalAlign = 'middle';
              text.style.padding = '0px 2px'; 
              if (div.getElementsByTagName("*").length == 0) { 
                //判断添加的属性框中是否已经添加过子属性元素span只有子元素为0时添加,有子元素则跳过只修改
                div.appendChild(text);
              }
      
      
              _twaver.setText(text, value, innerText);
              text.setAttribute('title', value);
            })(value, params.valueRender, params.view, property.isInnerText());
          
          }

        box.add(property);
        return property;
    },

    show: function(){
        this.sheetView.style.display = 'block'
    },

    hide: function(){
        this.sheetView.style.display = 'none'
    }

})