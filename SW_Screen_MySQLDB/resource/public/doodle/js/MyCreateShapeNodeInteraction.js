/**
 * @private
 * @param network
 * @param typeOrShapeNodeFunction
 * @constructor
 */
var MyCreateShapeNodeInteraction = function (network, typeOrShapeNodeFunction) {
    MyCreateShapeNodeInteraction.superClass.constructor.call(this, network, typeOrShapeNodeFunction);
}

twaver.Util.ext(MyCreateShapeNodeInteraction, twaver.vector.interaction.CreateShapeNodeInteraction, {

    setUp: function () {
        this.addListener('mousedown', 'mousemove', 'keydown');
        this.network.addMarker(this);
    },

    handle_mousedown: function (e) {
        if (e.button !== 0) {
            return;
        }
        var point = this.currentPoint || this.network.getLogicalPoint2(e);
        if (!point) {
            return;
        }
        if (e.detail === 2) {
            if (this.points) {
                var shapeNode = this.shapeNodeFunction(this.points);
                if (shapeNode) {
                    this.network.addElementByInteraction(shapeNode);
                    this.clear();
                    var self = this;
                    setTimeout(function () {
                        self.network.setEditingElement(false);
                    }, 0);
                }
            }
        } else {
            if (!this.network.isEditingElement()) {
                this.network.setEditingElement(true);
            }
            if (!this.points) {
                this.points = new twaver.List();
            }
            if (this.points.size() > 0) {
                var lastPoint = this.points.get(this.points.size() - 1);
                if (lastPoint.x === point.x && lastPoint.y === point.y) {
                    return;
                }
            }
            this.points.add(point);
        }
        this.repaint();
    },
    handle_mousemove: function (e) {
        if (this.points) {
            var lastPoint = this.points.get(this.points.size() - 1);
            var currPoint = this.network.getLogicalPoint2(e);
            //如果按住了ctrl键,允许任意打点,否则只能水平或竖直
            if (!_twaver.isCtrlDown(e)) {
                var dx = currPoint.x - lastPoint.x;
                var dy = currPoint.y - lastPoint.y;
                if (Math.abs(dx) >= Math.abs(dy)) {
                    //水平
                    currPoint.y = lastPoint.y;
                } else {
                    //竖直
                    currPoint.x = lastPoint.x;
                }
            }
            this.currentPoint = currPoint;
            this.repaint();
        }
    },
    handle_keydown: function (e) {
        if (e && e.keyCode == 13) {
            if (this.points) {
                this.points.add(this.currentPoint);
                this.currentPoint = null;
                var shapeNode = this.shapeNodeFunction(this.points);
                if (shapeNode) {
                    this.network.addElementByInteraction(shapeNode);
                    this.clear();
                    var self = this;
                    setTimeout(function () {
                        self.network.setEditingElement(false);
                    }, 0);
                }
            }
        }
    },
});