it.SaveScene = function (id) {
    this.$dom = $('#' + id);
    this.box = it.editor.box;
    this.init();
}

it.SaveScene.prototype = {

    init: function () {
        this.handleClick = this.handleClick.bind(this);
        this.$dom.click(this.handleClick);
        this.handleClear();
    },

    handleClick: function () {

        var self = this;
        var datas = [];
        var link = [];
        var nodes = this.box.getDatas()

        nodes.forEach(function (node) {
            if(!node.getClient('id')) return
            var data = {
                id: node.getClient("id"),
                name: node.getName() || node.getClient('id')
            }
            if (node.getClient('category') === 'link') {
                data.fromId = node.getClient("sourcePoint");
                data.toId = node.getClient("destinationPoint");
                data.direction = node.getClient("direction");
                data.length = node.getClient("length");
                link.push(data);
            } else {
                data.type = node.getClient("category");
                data.path = node.getPoints && node.getPoints()._as || null; //内外墙
                data.path = JSON.stringify(data.path);
                data.pos = JSON.stringify((node.getCenterLocation && node.getCenterLocation()) || (node.getLocation && node.getLocation()) || null);
                data.rotate = (node.getAngle && node.getAngle()) || 0;
                data.linkPoint = node.getClient('linkPoint');
                console.log(data);
                datas.push(data);
            }
        })
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/data/remove',
            data: null,
            // processData:false,
            contentType: 'application/json; charset=UTF-8',
            success: function () {
                console.log("删除成功");
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/data/batchAddOrUpdate',
                    data: JSON.stringify(datas),
                    contentType: 'application/json; charset=UTF-8',
                    success: function (data) {
                        console.log(data)
                        console.log("数据保存成功");
                        self.handleCommit();
                    },
                    error: function (err) {
                        console.log(err)
                    }
                });
            },
            error: function (err) {
                console.log("删除失败")
            }
        });

         $.ajax({
             type: 'POST',
             url: 'http://localhost:8080/api/link/remove',
             data: null,
             // processData:false,
             contentType: 'application/json; charset=UTF-8',
             success: function () {
                 console.log("删除成功");
                 $.ajax({
                     type: 'POST',
                     url: 'http://localhost:8080/api/link/batchAddOrUpdate',
                     data: JSON.stringify(link),
                     contentType: 'application/json; charset=UTF-8',
                     success: function (data) {
                         console.log(data)
                         console.log("连线保存成功");
                         self.handleCommit();
                     },
                     error: function (err) {
                         console.log(err)
                     }
                 });
             },
             error: function (err) {
                 console.log("删除失败")
             }
         });


    },

    handleCommit: function () {
        it.Utils.show("数据保存成功");
        it.Utils.hide(1000);
    },

    handleClear: function () {
        $(document.body).mousedown(function () {
            it.Utils.hide();
        })
    }

}