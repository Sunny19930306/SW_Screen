function createPomise(url) {
    return new MyPromise(function(resolve, reject) {
        $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json; charset=UTF-8',
            success: function (datas) {
                resolve(datas);
            },
            error: function (err) {
                reject(err)
            }
        });
    })
}

var promise = MyPromise.all([createPomise('http://localhost:8080/api/data/findAll'), createPomise('http://localhost:8080/api/link/findAll')])

promise.then(function(json) {
    createNode(json[0]);
    createLink(json[1]);
}, function(err) {
    console.log(err);
})

function createNode(datas) {
    if (datas.length === 0) {
        console.log("无数据")
        return;
    }
    datas.forEach(function (data) {
        var type = data.type;
        var node = null;
        data.pos = JSON.parse(data.pos);
        data.path = JSON.parse(data.path);
        if (type == "wall" || type == "innerWall" || type == 'channel') {
            var nodeName = data.id;
            node = it.editor.editScene.wallInnerWall(data, nodeName);
        } else if (type == "door" || type == "pillar" || type === "window") {
            var point = data.pos;
            var nodeName = data.id;
            var rotate = data.rotate;
            node = it.editor.editScene.loadModels(data, rotate, point, nodeName);
        } else if (type == 'point') {
            node = it.editor.editScene.createPointNode(data);
        } else {
            node = it.editor.editScene.createEquipmentNode(data);
        }
        it.editor.editScene.box.add(node)
    })
    it.editor.editScene.equipmentLink();
}

function createLink(datas) {
    if (datas.length === 0) {
        console.log("无数据")
        return;
    }
    datas.forEach(function (data) {
        var link = it.editor.editScene.createPath(data);
        it.editor.editScene.box.add(link)
    })
}