
//创建一个类，读取后台数据库中编辑的路径，得到运动的点和路径，并创建好。
//           创建动画，并有自动更新的功能，每次服务器推送信息，就修改

var PathAnimation = function () {
    //读取推送的信息，将运动信息存储下来
    this.prevPoints = {};
}

mono.extend(PathAnimation, Object, {
    init: function () {
       
        this.loadRealDatas();
    
    },

    loadRealDatas: function (data) {
       
            var dataInfo = JSON.parse(data.data);
            var id = data.id;
            var pathId = dataInfo[customer.realData.currentStation];

            var prevPoints = this.prevPoints;

             this.createPath(id, prevPoints[id], pathId);
            
            prevPoints[id] = pathId;


    },


    getNodeById: function (id) {

        var findFunc = new twaver.QuickFinder(box, 'id', 'client');
        var node = findFunc.find(id)._as[0];
        findFunc.dispose();
        return node;
    },


    //创建路径,暂时只做了直线，如果有曲线或拐弯，不可取
    createPath: function (id, prevId, pathId) {
        if(!prevId) return
        var speed = customer.pathAnimate.speed || 10;

        var fromLoc = this.getPosById(prevId)
        var toLoc = this.getPosById(pathId);
        var node = this.getNodeById(id);


        var animate = new twaver.Animate({
            from: fromLoc,
            to: toLoc,
            type: 'point',
            delay: 0,
            dur: speed * 1000,
            source: node,
            attr: 'centerLocation',
            easing: 'easeNone',
            onUpdate: function () {
                // network.invalidateElementUIs();
            }
        });
        animate.play();

    },


    getPosById: function (id) {
        var datas = it.allDatas["data"];
        var path;
        for (var i in datas) {
            var item = datas[i];
            if (item.id === id) {
                path = item.pos;
            }
        }
        return path;
    }
})