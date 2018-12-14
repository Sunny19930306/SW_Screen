var $SecondScreen = function (theme) {
    this.init(theme)

};



mono.extend($SecondScreen, Object, {
    init: function (theme) {
        this.box = new twaver.ElementBox();
        this.table = new twaver.controls.Table();
        this.table.setDataBox(this.box);

        this.headerList = {};
        this.unit = {};
        this.isChartMap = {};
        this.chartDataList = {};
        this.chartList = {};
        this.isShow = false;


        //设置不被选中,未解决选中状态下背景色的问题，暂时不做处理
        this.table.getSelectionModel().setSelectionMode('noneSelection');

        this.rootDiv = $('<div id = ' + theme + '>');
        this.rootDiv.css('visibility', 'hidden');
        this.rootDiv.css('zIndex', 1);
        this.rootDiv.appendTo($('#second'));
        this.loadAllDatas(theme);

        this.secondPanel = new SecondPanel(theme, this.rootDiv);



        this.theme = theme;

        this.initTable();

        this.switchToTheme(theme);



        this.checkBoxPanel = new CheckBoxPanel(theme, this.headerList, this.tableDom);

        this.addEvent(theme);

        this.batteryCount = 0;

    },

    loadAllDatas: function (theme) {
        var self = this;
        //表头数据
        this.tableHeader = it.allDatas['tableHeader'];
        this.loadDataBase();


    },

    switchToTheme: function (theme) {
        //通过点击的主题，初始化表格


        this.initTableHeader();

        var data = this.getDataByTheme(theme);



        this.initDataBox(data);

    },

    upData: function (data, dataTheme) {
        var dataInfo = JSON.parse(data.data);
        var node;
        var theme = this.theme;
        var list = this.getNodeById(data.id);

        if (theme === dataTheme) {

            if (list.size() === 0) {
                node = new twaver.Node();
                node.setClient('id', data.id);
                for (var i in dataInfo) {
                    node.setClient(i, dataInfo[i]);
                }
                this.box.add(node)
            } else {
                node = list.get(0);
                for (var i in dataInfo) {
                    node.setClient(i, dataInfo[i]);
                }
            }

        }
    },

    getDataByTheme: function (theme) {
        var self = this;

        if (theme === 'equipment') {
            var data = xianzhi.realTimeData["certification"];

        } else if (theme === 'agv') {
            var data = xianzhi.realTimeData["robot"];

        } else if (theme === 'quality') {
            var data = xianzhi.realTimeData["quality"];
        } else if (theme === 'produce') {
            var data = xianzhi.realTimeData["produce"];
        }
        return data;
    },

    initTable: function () {
        //设置table
        var table = this.table;
        var tablePane = new twaver.controls.TablePane(table);
        var tableHeader = tablePane.getTableHeader();

        table.setColumnLineWidth(0);
        //设置列的线条的宽度
        table.setRowLineWidth(0);
        //设置行的线条的宽度
        table.setEditable(true);

        tableHeader.getView().style.background = 'rgba(0,0,0,0)';
        tableHeader.getView().className = 'tableHeader';
        $(tableHeader.getView()).next().css('zIndex', -1);
        tableHeader.setHeight(60);

        var w = document.documentElement.clientWidth * 0.95;
        var h = document.documentElement.clientHeight * 0.85;

        this.tableDom = tablePane.getView();
        this.tableDom.className = 'tableDom'
        this.tableDom.style.left = '3%';
        this.tableDom.style.top = '10%';
        this.tableDom.style.zIndex = '-100';
        this.tableDom.style.width = w + 'px';
        this.tableDom.style.height = h + 'px';
        this.tableDom.style.background = 'url(./images/tableBg.png) no-repeat 0 0 ';
        this.tableDom.style.backgroundSize = '100% 100%';
        this.tableDom.id = this.theme + 'Dom';

        $(this.tableDom).appendTo(this.rootDiv);

        _twaver.html.release = function (parent, level) {
            level = level || 0;
            var count = parent.childNodes.length;
            for (var i = 0; i < count; i++) {
                _twaver.html.release(parent.childNodes[i], level + 1);
            }
            if (level <= 1) {
                _twaver.html.clear(parent);
            }
            if (parent._pool) {
                parent._pool.release(parent);
            }
        }


    },

    initTableHeader: function () {
        this.showMap = new Array();
        var theme = this.theme;
        var table = this.table;

        var list = this.headerList[theme];
        //表头的总参数
        for (var key in list) {

            if (list[key]['showInSecond'] === true) {
                this.isChartMap[list[key]['id']] = list[key]['isChart'];
                this.showMap.push({
                    id: list[key]['id'],
                    name: list[key]['name']
                });
            }
        }
        this.tableWidth = this.tableDom.style.width;



        //设置修改后的宽度
        var index = this.showMap.length;

        //table,name,title,propertyName,'propertyType,valueType
        //加载表头，可以通过勾选控制的

        var rowHeight = null;
        for (var i in this.showMap) {
            if (this.isChartMap[this.showMap[i]["id"]]) {
                //有表格的情况行高
                rowHeight = 150
                break;
            } else {
                //没有表格的情况行高
                rowHeight = 40
            }
        }

        var chartSum = 0;
        for (var i in this.showMap) {
            if (this.isChartMap[this.showMap[i]["id"]]) {
                chartSum++;
            }
        }
        var maxAverageWidth = (this.tableWidth.split('px')[0] - 500) / (index - 1);
        if (maxAverageWidth > 300 || !chartSum) {
            this.averageWidth = maxAverageWidth;
        } else {
            this.averageWidth = (this.tableWidth.split('px')[0] - 250 * chartSum - 500) / (index - 1 - chartSum);
        }

        //TODO: 有没有必须要显示的信息?   例如：机器人编号  暂时设置设备ID编码
        // this.createColumn(table, "设备ID", "设备ID", 'id', 'client', 'string', this.averageWidth, rowHeight);
        this.createColumn(table, "设备ID", "设备ID", 'id', 'client', 'string', 200, rowHeight);
        for (var i in this.showMap) {
            if (this.isChartMap[this.showMap[i]["id"]] && this.averageWidth < 100) {
                var averageWidth = 100;
            } else {
                var averageWidth = this.averageWidth;
            }
            if(this.showMap[i]["id"] == 'vehicle_id' || this.showMap[i]["id"] == 'battery_level' || this.showMap[i]["id"] == 'confidence'){
                this.createColumn(table, this.showMap[i]["name"], this.showMap[i]["name"], this.showMap[i]["id"], 'client', 'string', 250, rowHeight);
            }else{
                this.createColumn(table, this.showMap[i]["name"], this.showMap[i]["name"], this.showMap[i]["id"], 'client', 'string', averageWidth, rowHeight);
            }
        }

    },

    initDataBox: function (data) {

        for (var key in data) {
            var item = data[key]
            var node = new twaver.Node();
            node.setClient('id', item.id);
            var dataInfo = JSON.parse(item.data);
            for (var i in dataInfo) {
                node.setClient(i, dataInfo[i])
            }
            this.box.add(node)
        }

    },

    //重载样式
    createColumn: function (table, name, title, propetyName, propertyType, valueType, width, rowHeight) {
        var column = new twaver.Column(name); //创建column对象
        column.setName(title); //设置类名
        column.setPropertyName(propetyName); //设置属性名称
        column.setPropertyType(propertyType); //设置属性类别
        if (valueType) {
            //数据类型有就设,没有就不设
            column.setValueType(valueType);
        }
        if (width) {
            column.setWidth(width);
        }
        var isChart = this.isChartMap[propetyName];
        table.setRowHeight(rowHeight);

        table.getColumnBox().add(column);
        var self = this;
        //重载表头
        column.renderHeader = function (div) {
            //此处传入的div是每一列的标题单元格的父元素,内部已经定义,自动传入
            var span = document.createElement('span'); //动态创建span标签
            //为span标签设置样式
            span.style.whiteSpace = 'nowrap';
            span.style.verticalAlign = 'middle';
            span.style.font = '20px 思源黑体';
            span.style.display = 'inline-block';

            //填入span标签的HTML内容,设置了name便把name赋给span,若没有值便把设置的属性名赋值给span
            span.innerHTML = column.getName() ? column.getName() : column.getPropertyName();
            span.setAttribute('title', span.innerHTML);

            // 如对其父元素有样式要求可以对其传入的div样式做调整
            div.style.textAlign = 'center';
            div.style.color = 'rgb(128,213,255)';
            div.style.background = 'rgba(0,0,0,0) no-repeat center right';

            div.appendChild(span); //将创建的span元素放进父元素div中
        };
        //重载表体
        column.renderCell = function (params) {
            table.getView().className = 'tableBody';

            //设置行高
            //以上的设置方法是官方提供,可直接查询官方API设置

            var div = params.div; //获得单元格
            var scrollDiv = div.parentNode.parentNode.parentNode.parentNode; //获得table滚动条
            var scrollParentDiv = div.parentNode.parentNode.parentNode.parentNode.parentNode; //获得table滚动条的父元素
            //设置样式的过程
            // scrollDiv.style.overflowX = 'hidden'; //隐藏横向滚动条
            // scrollDiv.style.overflowY = 'hidden'; //隐藏纵向滚动条
            scrollDiv.style.width = '100%';
            scrollParentDiv.style.overFlow = 'hidden';
            div.style.textAlign = 'center';
            div.style.font = '19px 思源黑体';
            div.style.border = 'none';

            if (propetyName !== "id") {
                // div.style.marginLeft = '15px';
            }
            div.style.width = width - 5 + 'px';

            div.parentNode.style.border = 'none';
            div.parentNode.style.overFlow = 'hidden';
            div.style.backgroundColor = 'transparent';

            //rowIndex是生成列时自动创建的行标数,从0开始,通过它来给奇数行和偶数行填充不一样的颜色,此处需注意设置background参数要使用渐变填充,直接赋值RGB或RGBA或16进制颜色不生效
            if (params.rowIndex % 2 == 0) {
                params.div.style.background =
                    '-webkit-linear-gradient(top, rgba(31, 75, 118,0.6), rgba(31, 75, 118,0.6))';
            } else {
                params.div.style.background =
                    '-webkit-linear-gradient(top, rgba(31, 75, 118,0.0), rgba(31, 75, 118,0.0))';
            }
            params.div.style.color = 'rgb(255,255,255)'
            params.div.style.verticalAlign = 'middle';
            params.div.style.lineHeight = rowHeight + 'px';


            var value = params.value;
            var id = params.column.getId();


            //TODO:对传过来的值进行判断，根据类型显示

            if (typeof (value) === "boolean") {
                value = value.toString();

            }

            if (value === "true") {
                value = "<img src='./images/yes_table.png' title='true' />";
            } else if (value === "false") {
                value = "<img src='./images/no_table.png'  title='false'  />";
            }

            if (value === "working") {
                value = "<img src='./images/正常.png ' title='正常'  '/>"
            } else if (value === "pause") {
                value = "<img src='./images/暂停.png' title='暂停' />"
            } else if (value === "trouble") {
                value = "<img src='./images/故障.png' title='故障' />"
            }

            if (isChart) {
                var children = $(text).children();
                var dataId = params.data.getClient('id');
                self.handleValue(dataId, propetyName, value);
                value = self.createOrUpdateChart(dataId, propetyName);

            }

            value = value || "空   ";


            var data = it.allDatas['tableHeader'];
            for (var i in data) {
                var item = data[i];
                if (item["name"] === id) {
                    if (item.unit === null || item.unit === "") {
                        value = value;
                    } else {
                        value += item.unit;
                    }
                }
            }

            if (typeof (value) == 'string') {
                var text = params.view._stringPool.get();
                _twaver.setText(text, value);
                params.div.appendChild(text);
            } else {
                $(params.div).append(value);
            }



        };
        return column;
    },

    handleValue: function (id, propetyName, value) {
        if (!this.chartDataList[id]) {
            this.chartDataList[id] = {};
        }
        if (!this.chartDataList[id][propetyName]) {
            this.chartDataList[id][propetyName] = [];
        }
        
        var date = new Date();
        var val = [
            date,
            value
        ];
        // console.log("!!!!!", id, propetyName, value, this.batteryCount);
        if (this.chartDataList[id][propetyName].length < customer.eChart.num) {
            if (propetyName == "battery_level") {
                if (this.batteryCount++ > 60) {
                    this.batteryCount = 0;
                    this.chartDataList[id][propetyName].push(val);
                }
            } else {
                this.chartDataList[id][propetyName].push(val);
            }
        } else {
            this.chartDataList[id][propetyName].shift();
            this.chartDataList[id][propetyName].push(val);
        }
    },


    createOrUpdateChart: function (id, propetyName) {
        var self = this;

        var chart, $div
        if (!this.chartList[id] || !this.chartList[id][propetyName]) {
            $div = $('<div style="width: 250px; height: 150px; display: inline-block; margin：auto;"></div>');
            chart = echarts.init($div[0]);
            option = {
                grid: {
                    left: 30,
                    top: 20,
                    bottom: 30
                },
                xAxis: {
                    type: 'time',
                    axisLabel: {
                        textStyle: {
                            color: it.secondStyle.eChart.xAxisColor
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: it.secondStyle.eChart.xAxisColor,
                            opacity: 0.8
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: it.secondStyle.eChart.xAxisColor,
                            opacity: 0.8
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: it.secondStyle.eChart.xAxisColor,
                            opacity: 0.3
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: it.secondStyle.eChart.yAxisColor
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: it.secondStyle.eChart.yAxisColor,
                            opacity: 0.8
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: it.secondStyle.eChart.yAxisColor,
                            opacity: 0.8
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: it.secondStyle.eChart.yAxisColor,
                            opacity: 0.3
                        }
                    }
                },
                series: [{
                    data: self.chartDataList[id][propetyName],
                    type: 'line',
                    symbol: "circle",
                    symbolSize: 5,
                    label: {
                        normal: {
                            show: false,
                            position: 'top',
                            textStyle: {
                                color: it.secondStyle.eChart.numColor
                            }
                        },
                    },
                    lineStyle: {
                        normal: {
                            color: it.secondStyle.eChart.lineColor
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: it.secondStyle.eChart.pointColor,
                            shadowColor: it.secondStyle.eChart.pointColor,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 10
                        }
                    },
                    animation: false
                }]
            };
            chart.setOption(option);
        } else {
            $div = this.chartList[id][propetyName]["div"];
            chart = this.chartList[id][propetyName]["chart"];
            chart.setOption({
                series: [{
                    data: self.chartDataList[id][propetyName]
                }]
            })
        }

        if (!this.chartList[id]) {
            this.chartList[id] = {};
        }
        this.chartList[id][propetyName] = {
            div: $div,
            chart: chart
        };

        return $div
    },

    show: function () {

        this.rootDiv.css('visibility', 'visible');
        this.rootDiv.css('zIndex', 20);
        this.rootDiv.children().css('zIndex', 999);
        this.isShow = true;
    },

    hide: function () {
        this.rootDiv.css('visibility', 'hidden');
        this.rootDiv.css('zIndex', 1);
        this.rootDiv.children().css('zIndex', -999);
        this.isShow = false;

    },

    destory: function () {

    },

    addEvent: function () {
        $('#' + this.theme + 'Dom .item').on("click", this.handleSave)
        $('#' + this.theme + 'Dom .button').on("click", this.handleButton.bind(this));
        $('#' + this.theme + 'Dom .btn_search').on('click', this.handleSearch.bind(this));

        var self = this;
        window.onresize = function () {

            var w = document.documentElement.clientWidth * 0.95;
            var h = document.documentElement.clientHeight * 0.85;

            self.tableDom.style.left = '3%';
            self.tableDom.style.top = '10%';
            self.tableDom.style.zIndex = '-100';
            self.tableDom.style.width = w + 'px';
            self.tableDom.style.height = h + 'px';
        }
    },

    removeEvent: function () {
        $('#' + this.theme + 'Dom .item').off("click", this.handleSave)
        $('#' + this.theme + 'Dom .button').off("click", this.handleButton.bind(this));
    },

    handleButton: function () {
        //存储
        this.handleCommit();
        //根据数据渲染
        this.renderByData();
    },

    //点击确认之后的事件,存储现在需要显示的数据
    handleCommit: function () {
        var theme = this.theme
        var storage = {};

        $('.item').each(function () {
            var key = $(this).text();
            var value;
            if ($(this).val() == 1) {
                value = true;
            } else {
                value = false;
            }
            storage[key] = value;
        })

        this.saveToDataBase(theme, storage);
    },


    //点击之后存储状态
    handleSave: function () {
        if ($(this).val() == 1) {
            $(this).css('backgroundImage', 'url(../images/searchImg/background01.png)').val(2)
        } else {
            $(this).css('backgroundImage', 'url(../images/searchImg/background02.png)').val(1)
        }
    },

    //待改进
    saveToDataBase: function (theme, storage) {

        var headerList = this.headerList[theme];
        var newData = new Array();
        for (var i in headerList) {
            headerList[i]["showInSecond"] = storage[i];
            newData.push(headerList[i]);
        }
        //传递给数据库
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/tableHeader/batchAddOrUpdate',
            data: JSON.stringify(newData),
            contentType: 'application/json; charset=UTF-8',
            success: function (datas) {
                console.log("保存成功");
            },
            error: function (err) {
                console.log(err)
            }
        });


    },

    //加载数据库
    loadDataBase: function () {
        var agv = {};
        var equipment = {};
        var quality = {};
        var produce = {};
        var unit = this.unit;
        var tableHeader = this.tableHeader;
        for (var i in tableHeader) {
            unit[tableHeader[i]["name"] || tableHeader[i]["id"]] = tableHeader[i]["unit"];
            if (tableHeader[i]['type'] === 'robot') {
                agv[tableHeader[i]["name"] || tableHeader[i]["id"]] = tableHeader[i];
            } else if (tableHeader[i]['type'] === 'certification') {
                equipment[tableHeader[i]["name"] || tableHeader[i]["id"]] = tableHeader[i];
            } else if (tableHeader[i]['type'] === 'quality') {
                quality[tableHeader[i]["name"] || tableHeader[i]["id"]] = tableHeader[i];
            } else if (tableHeader[i]['type'] === 'produce') {
                produce[tableHeader[i]["name"] || tableHeader[i]["id"]] = tableHeader[i];
            }
        }
        this.headerList["agv"] = agv;
        this.headerList["equipment"] = equipment;
        this.headerList["quality"] = quality;
        this.headerList["produce"] = produce;
    },

    renderByData: function () {
        this.showMap = [];
        this.table.getColumnBox().clear();
        this.initTableHeader();
    },


    handleSearch: function () {
        var box = this.box
        var box1 = new twaver.ElementBox();
        box1.clear()
        var searchId = $('#' + this.theme + 'Dom #in').val();
        var findFunc = new twaver.QuickFinder(box, 'id', 'client');
        node = findFunc.find(searchId)._as[0]
        if (!node) {
            this.table.setDataBox(box);
        } else {
            box1.add(node)
            this.table.setDataBox(box1)
        }
        findFunc.dispose();
    },

    getNodeById: function (id, box) {
        var findFunc = new twaver.QuickFinder(this.box, 'id', 'client');
        var list = findFunc.find(id);

        findFunc.dispose();

        return list
    }

});