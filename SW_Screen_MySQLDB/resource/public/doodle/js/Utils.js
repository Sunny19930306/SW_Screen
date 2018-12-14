var it = it || {};

window.it = it;

var Utils = function () {

};

Utils.prototype.ext = function (subClass, superClass, o) {
    var prototype = subClass.prototype;
    twaver.Util.ext(subClass, superClass, o);

    if (prototype && subClass.prototype) {
        for (var p in prototype) {
            subClass.prototype[p] = prototype[p];
        }
    }
}

Utils.prototype.isMoveModel = function (element) {

    return true;
};


Utils.prototype.isChild = function (element) {
    var type = element.getClient('type');
    var types = ['door', 'window'];
    if (type && types.indexOf(type) >= 0) {
        return true;
    }
    return false;
};

/**
 * transformAndScaleCanvasContext
 *
 * @param canvas
 * @param force
 * @returns {CanvasRenderingContext2D}
 */
Utils.prototype.transformAndScaleCanvasContext = function (canvas, force) {
    var context = canvas.getContext("2d");
    if (!force && canvas.isTransfor && canvas.width && canvas.height) return context;

    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {

        var oldWidth = canvas.offsetWidth;
        var oldHeight = canvas.offsetHeight;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        context.scale(ratio, ratio);

    }
    if (canvas.width && canvas.height) canvas.isTransfor = true;
    return context;
};

Utils.prototype.isCtrlDown = function (evt) {
    return evt.ctrlKey || evt.metaKey;
};

Utils.prototype.isAltDown = function (evt) {
    return evt.altKey || evt.metaKey;
};

Utils.prototype.getNodeData = function (node) {
    if (!node.getClient('id')) return
    var data = {
        id: node.getClient("id"),
        name: node.getName() || node.getClient('id')
    }
    if (node.getClient('category') === 'link') {
        data.fromId = node.getClient("sourcePoint");
        data.toId = node.getClient("destinationPoint");
        data.length = node.getClient("length");
    } else {
        data.type = node.getClient("category");
        data.path = node.getPoints && node.getPoints()._as || null; //内外墙
        data.path = JSON.stringify(data.path);
        data.pos = JSON.stringify((node.getCenterLocation && node.getCenterLocation()) || (node.getLocation && node.getLocation()) || null);
        data.rotate = (node.getAngle && node.getAngle()) || 0;
        data.linkPoint = node.getClient('linkPoint');
    }
    return data;
}

Utils.prototype.clone = function (data) {
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
    } else if (type == 'link') {
        node = it.editor.editScene.createPath(data);
    } else {
        node = it.editor.editScene.createEquipmentNode(data);
    }
    return node;
}

Utils.prototype.show = function (context) {
    $("#myModal h1").html(context);
    $("#myModal").show(500);
};



Utils.prototype.hide = function (time) {
    //延时关闭
    time = time || 0;
    setTimeout(function () {
        $("#myModal").hide(500);
    }, time);
};

it.Utils = new Utils();