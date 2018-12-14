var RoomDragInteraction = function (box, network) {
    RoomDragInteraction.superClass.constructor.call(this, network);
    this.network = network;
    this.box = box;
}


twaver.Util.ext(RoomDragInteraction, twaver.vector.interaction.BaseInteraction, {
    setUp: function () {
        this.addListener('mousedown', 'mousemove', 'mouseup', 'dragover', 'drop', 'dblclick');
    },
    tearDown: function () {
        this.removeListener('mousedown', 'mousemove', 'mouseup', 'dragover', 'drop', 'dblclick');
    },

    handle_dblclick: function (e) {

    },

    //get element by mouse event, set lastElement as WallShapeNode
    handle_dragover: function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        e.dataTransfer.dropEffect = 'copy';

        var element = this.network.getElementAt(e);
        if (!element) return;
        if (this.network.lastElement && this.network.lastElement !== element) {
            if (this.network.lastElement instanceof make.Default.WallShapeNode) {
                this.network.lastElement.setClient('focusIndex', -1);
            }
            this.network.lastElement = null;
        }
        //if mouse over a shapenode side, set focus index for shapenode and set lastelement as this shapenode
        if (element instanceof make.Default.WallShapeNode) {
            var point = this.network.getLogicalPoint(e); //getLogicalPosition(e) 2015-01-04
            var index = element.getPointIndex(point);
            element.setClient('focusIndex', index);
            if (index >= 0) {
                this.network.lastElement = element;
            }
        } else {
            this.network.lastElement = null;
        }
        return false;
    },

    handle_drop: function (e, data) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var text = e.dataTransfer.getData('Text');
        if (!text) {
            return false;
        }
        var obj = JSON.parse(text);
        var id = data.id;
        var id2d = data.id2d;

        var element = this.network.getElementAt(e);

        if (obj.id) {
            var layerId = make.Default.getOtherParameter(id2d, 'layer') || 900;
            var type = make.Default.getOtherParameter(id2d, 'type');
            if (type === 'wall' || type === 'innerWall') {
                var type = function (points) {
                    var data = [];
                    points.forEach(function (p) {
                        data.push(p.x);
                        data.push(p.y);
                    });
                    var type = make.Default.getType(id);
                    if (type == 'wall' && data.length < 3 * 2) {
                        return null;
                    } else if (type == 'innerWall' && data.length < 2 * 2) {
                        return null;
                    }
                    var node = make.Default.load({
                        id: id2d,
                        data: data
                    });
                    return node;
                };
                this._createShapeNodeInteractions(type);
            }
        }
        this._setNetworkCreateShapeNodeCursor();
        return false;
    },

    _createShapeNodeInteractions: function (type) {
        this.network.setInteractions([
            new MyCreateShapeNodeInteraction(this.network, type),
            new twaver.vector.interaction.DefaultInteraction(this.network)
        ]);
    },

    _setNetworkCreateShapeNodeCursor: function () {
        var self = this;
        this.network.getInteractions().forEach(function (handler) {
            if (handler instanceof twaver.vector.interaction.CreateShapeNodeInteraction) {
                self.network.getView().style.cursor = 'crosshair';
            }
        });
    },

    handle_mousedown: function (e) {
        // $utils.stopPropagation(e);   
        this.mouseDown = true;
        this.lastLogicalPoint = this.network.getLogicalPoint(e); //getLogicalPosition(e) 2015-01-04
        if (!this.lastLogicalPoint) return;
        //        alert(this.lastLogicalPoint.x + " ; " + this.lastLogicalPoint.y);
        var element = this.network.getElementAt(e);
        if (element && !$utils.isMoveModel(element)) {
            //判断是否是禁止移动的对象
            return;
        }
        if (element instanceof make.Default.WallShapeNode) {
            resize = this.network.getElementUI(element).isPointOnBorderLine(this.lastLogicalPoint);
            if (resize !== null) {
                this.lastElement = element;
                this.network.isMovable = function (element) {
                    return false;
                };
            } else {
                var index = element.getPointIndex(this.network.getLogicalPoint(e)); ////getLogicalPosition(e) 2015-01-04
                if (index >= 0) {
                    this.lastIndex = index;
                    this.lastElement = element;
                    this.network.isMovable = function (element) {
                        return false;
                    };
                }
            }
        }
        if (element instanceof make.Default.Block) {
            this.block = element;
        }
    },

    handle_mousemove: function (e) {
        // $utils.stopPropagation(e);
        // if(lock2d) {
        //   return;
        // }
        var resize;
        this._setNetworkCreateShapeNodeCursor();
        if (this.mouseDown) {
            var point = this.network.getLogicalPoint(e); //getLogicalPosition(e) 2015-01-04
            if (!point) {
                this.network.getView().scrollTop += 10;
                this.network.getView().scrollLeft += 10;
                return;
            }
            if (this.lastElement && !$utils.isMoveModel(this.lastElement)) {
                //判断是否是禁止移动的对象
                return;
            }
            if (this.block && !$utils.isMoveModel(this.block)) {
                //判断是否是禁止移动的对象
                return;
            }
            offsetX = this.lastLogicalPoint ? point.x - this.lastLogicalPoint.x : 0;
            offsetY = this.lastLogicalPoint ? point.y - this.lastLogicalPoint.y : 0;
            if (this.lastIndex >= 0) {
                $utils.stopPropagation(e);
                var points = this.lastElement.getPoints(),
                    from = points.get(this.lastIndex),
                    to = points.get(this.lastIndex === points.size() - 1 ? 0 : this.lastIndex + 1);
                if (!this.network.enableSingleOrientationMove) {
                    if (!this.mouseMoved && _twaver.isCtrlDown(e)) {
                        this.horizontal = Math.abs(offsetX) >= Math.abs(offsetY);
                        this.vertical = !this.horizontal;
                        this.mouseMoved = true;
                    }
                } else if (!this.mouseMoved) {
                    this.horizontal = from.x == to.x;
                    this.vertical = !this.horizontal;
                    this.mouseMoved = true;
                }
                //                if (!this.mouseMoved && _twaver.isCtrlDown(e)) {
                //                    this.horizontal = Math.abs(offsetX) >= Math.abs(offsetY);
                //                    this.vertical = !this.horizontal;
                //                    this.mouseMoved = true;
                //                }
                if (!this.vertical) {
                    from.x += offsetX;
                    to.x += offsetX;
                }
                if (!this.horizontal) {
                    from.y += offsetY;
                    to.y += offsetY;
                }
                this.lastElement.firePointsChange(null, this.lastElement.getPoints());
                this.lastLogicalPoint = point;
            }
            if (this.block) {
                var index = this.block.getClient('edgeIndex'),
                    length = this.block.getClient('length'),
                    offset = this.block.getClient('offset'),
                    points = this.block.getParent().getPoints(),
                    from = points.get(index),
                    to = points.get(index === points.size() - 1 ? 0 : index + 1),
                    dx = to.x - from.x,
                    dy = to.y - from.y,
                    h = Math.abs(dx) > Math.abs(dy),
                    change = h ? offsetX : offsetY,
                    move = change;
                if (this.block.getClient('focusLeft')) {
                    if (h) {
                        if (dx > 0) {
                            move = -move;
                        }
                    } else {
                        if (dx >= 0 && dy < 0) {
                            change = -change;
                        }
                        if (dx >= 0 && dy > 0) {
                            move = -move;
                        }
                        if (dx < 0 && dy > 0) {
                            change = -change;
                            move = -move;
                        }
                    }
                    this.block.setClient('length', length - change);
                    this.block.setClient('offset', offset - move / Math.abs(h ? dx : dy) / 2);
                } else if (this.block.getClient('focusRight')) {
                    if (h) {
                        if (dx < 0) {
                            move = -move;
                        }
                    } else {
                        if (dx >= 0 && dy < 0) {
                            change = -change;
                            move = -move;
                        }
                        if (dx < 0 && dy > 0) {
                            change = -change;
                        }
                        if (dx < 0 && dy < 0) {
                            move = -move;
                        }
                    }
                    this.block.setClient('length', length + change);
                    this.block.setClient('offset', offset + move / Math.abs(h ? dx : dy) / 2);
                } else {
                    var offset = Math.abs(dx) > Math.abs(dy) ? (point.x - this.lastLogicalPoint.x) / dx : (point.y - this.lastLogicalPoint.y) / dy;
                    this.block.setClient('offset', this.block.getClient('offset') + offset);
                }
                this.lastLogicalPoint = point;
            }
            if (resize !== null && this.lastElement) {
                if (resize === 0) {
                    this.lastElement.setLocation(this.lastElement.getX() + offsetX, this.lastElement.getY() + offsetY);
                    this.lastElement.setSize(this.lastElement.getWidth() - offsetX, this.lastElement.getHeight() - offsetY);
                } else if (resize === 1) {
                    this.lastElement.setLocation(this.lastElement.getX(), this.lastElement.getY() + offsetY);
                    this.lastElement.setSize(this.lastElement.getWidth() + offsetX, this.lastElement.getHeight() - offsetY);
                } else if (resize === 2) {
                    this.lastElement.setSize(this.lastElement.getWidth() + offsetX, this.lastElement.getHeight() + offsetY);
                } else if (resize === 3) {
                    this.lastElement.setLocation(this.lastElement.getX() + offsetX, this.lastElement.getY());
                    this.lastElement.setSize(this.lastElement.getWidth() - offsetX, this.lastElement.getHeight() + offsetY);
                }
                this.lastLogicalPoint = point;
            }
        } else {
            var element = this.network.getElementAt(e),
                point = this.network.getLogicalPoint(e); //getLogicalPosition(e) 2015-01-04
            if (element && !$utils.isMoveModel(element)) {
                //判断是否是禁止移动的对象
                return;
            }
            if (this.lastElement && this.lastElement !== element) {
                if (this.lastElement instanceof make.Default.WallShapeNode) {
                    this.lastElement.setClient('focusIndex', -1);
                    this.network.getView().style.cursor = 'default';
                }
                if (this.lastElement instanceof make.Default.Block) {
                    this.lastElement.setClient('focus', false);
                    this.lastElement.setClient('focusLeft', false);
                    this.lastElement.setClient('focusRight', false);
                    this.network.getView().style.cursor = 'default';
                }
                this.lastElement = null;
            }
            if (element instanceof make.Default.WallShapeNode) {
                resize = this.network.getElementUI(element).isPointOnBorderLine(point);
                if (resize !== null) {
                    this.lastElement = element;
                    this.network.getView().style.cursor = 'move';
                } else {
                    var index = element.getPointIndex(point);
                    element.setClient('focusIndex', index);
                    if (index >= 0) {
                        this.lastElement = element;
                        if (_twaver.isAltDown(e)) {
                            this.network.getView().style.cursor = this.addPointCursor;
                        } else {
                            this.network.getView().style.cursor = 'move';
                        }
                    } else {
                        if (!element.isPointOnPoints(point)) {
                            this.network.getView().style.cursor = 'default';
                        }
                    }
                }
            } else if (element instanceof make.Default.Block) {
                element.setClient('focus', true);
                if (this.network.getSelectionModel().contains(element) && _twaver.math.getDistance(point, element.getClient('leftPoint')) <= 10) {
                    element.setClient('focusLeft', true);
                    element.setClient('focusRight', false);
                    this.network.getView().style.cursor = 'move';
                } else if (this.network.getSelectionModel().contains(element) && _twaver.math.getDistance(point, element.getClient('rightPoint')) <= 10) {
                    element.setClient('focusLeft', false);
                    element.setClient('focusRight', true);
                    this.network.getView().style.cursor = 'move';
                } else {
                    element.setClient('focusLeft', false);
                    element.setClient('focusRight', false);
                    this.network.getView().style.cursor = 'default';
                }
                this.lastElement = element;
            } else {
                this.lastElement = null;
            }
        }

    },

    handle_mouseup: function (e) {
        this.mouseDown = false;
        this.mouseMoved = false;
        this.horizontal = false;
        this.vertical = false;
        this.lastIndex = -1;
        this.lastElement = null;
        this.lastLogicalPoint = null;
        this.block = null;
        this.resize = false;
        this.network.getView().style.cursor = 'default';
        delete this.network.isMovable;
    },

    getAllElementsAt: function (point) {
        var rect = {
            x: point.x - 1,
            y: point.y - 1,
            width: 2,
            height: 2
        };
        var elements = this.network.getElementsAtRect(rect, true, null, false);
        return elements;
    },
    findFirstFloorAt: function (point) {
        var elements = this.getAllElementsAt(point);
        if (elements) {
            for (var i = 0; i < elements.size(); i++) {
                if (elements.get(i) instanceof nsp.edit.data.FloorShapeNode) {
                    return elements.get(i);
                }
            }
        }
    }

});