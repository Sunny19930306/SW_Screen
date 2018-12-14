/**
 * 
 * @param {Object} factory 绑定的宿主元素
 */


//创建一个类，读取后台数据库中编辑的路径，得到运动的点和路径，并创建好。
//           创建动画，并有自动更新的功能，每次服务器推送信息，就修改

var PathAnimation = function () {
    this.dataInfo = {};
    this.pathId = [];
    this.am = new AnimateManager();
    this.prevPoint = null;
    // this.init();
}

mono.extend(PathAnimation, Object, {
    init: function () {
        //读取推送的信息，将运动信息存储下来
        this.loadRealDatas();



    },

    loadRealDatas: function (node, pathId) {
        var prevPoint = this.prevPoint;
        if (prevPoint) {
            var link = this.getLink(prevPoint, pathId);
            self.createPath(node, link);
        }
        this.prevPoint = pathId;
    },




    //创建路径,暂时只做了直线，如果有曲线或拐弯，不可取
    createPath: function (node, link) {

        var speed = 10;
        var animate = new twaver.Animate({
            from: 0,
            to: 1,
            type: 'point',
            dur: 2000,
            easing: 'easeNone',
            onUpdate: function (value) {
                var loc = link.getPointAt(value);
                node.setLocation(loc.x, loc.y);
            },
            onDone: function() {
                animate.stop();
            }
        });
        animate.play();
    },


    getLink: function (fromId, toId) {
        var datas = it.allDatas["link"];
        var loc = null;
        var linkNode, self = this;
        datas.forEach(function (link) {
            var fId = link.getFromId();
            var tId = link.getToId();
            // linkNode = self.getNodeByClientId(link.id);
            if (fromId == fId && tId == toId) {
                loc = {
                    fromLoc: {},
                    toLoc: {}
                }
            } else if (fromId == tId && fId == toId) {
                loc = {
                    fromLoc: {},
                    toLoc: {}
                }
            } else {
                continue
            }
        })
        return loc;
    },

    getNodeByClientId: function (id) {
        var quickFinder = new twaver.QuickFinder(this.box, "id", "client");
        var list = quickFinder.find(id);

        var node = list.size() ? list.get(0) : null;

        return node;
    },

})








var AnimateManager = function () {
    this.animateArray = [];
    this.animateState = false;
}

AnimateManager.prototype = {

    /**
     * @param {Object} params 
     * @param {Function} params.func - 动画的函数
     * @param {Object} params.scope - 动画函数的作用域
     */
    addOneAnimate: function (params) {
        this.animateArray.push(params);
        this.doOneAnimate();
    },

    /**
     * 动画的回调函数里面执行一下这个
     *
     */
    endOneAnimate: function () {
        this.animateState = false;
        this.animateArray.splice(0, 1);
        this.doOneAnimate();
    },

    doOneAnimate: function () {
        if (!this.animateState) {
            var animateArray = this.animateArray;
            var self = this;
            if (animateArray.length > 0) {
                var animate = animateArray[0];
                this.animateState = true;
                var ps = new Promise(function (resolve, reject) {
                    animate.func.call(animate.scope, resolve);
                })
                ps.then(function () {
                    self.endOneAnimate();
                })
            }
        }
    },
}