var getImagePath = function (image) {
    if (!image) return null;
    if (image.indexOf('/') > 0) {
        return image;
    }
    return 'models/images/' + image;
}

make.Default.ImageShapeNode = function () {
    make.Default.ImageShapeNode.superClass.constructor.apply(this, arguments);

    this.setClient('showFloor', true); //3D 是否显示地板
    this.setClient("closed", true); //2D 和 3D 中默认是否闭合
    this.setClient('focusColor', 'green');
    this.setClient('resizeBorderWidth', 10);
    this.setClient('resizeBorderLength', 18);
    this.setClient('resizeBorderGap', 10);
    this.setClient('resizeBorderColor', 'yellow');
    this.setClient('size', {
        x: 0,
        y: 300,
        z: 10
    });
    this.setClient('fill', true);
    this.setClient('imageSrc', 'fangkuang.png');

    this.setStyle("vector.outline.color", topoStyle.outerWall.outLineColor);
    this.setStyle("vector.outline.width", topoStyle.outerWall.lineWidth);
    this.setStyle("vector.fill.color", "rgba(184,211,240,0.5)");
    this.setStyle("select.style", 'none');
    this.setClient('repeat', 1000);

    this.setClient('dimLeadLength', 35);
    this.setClient('dimLineOffset', 0.7);
    this.setClient('dimLineWidth', 1);
    this.setClient('dimColor', '#F07819');
    this.setClient('dimTextGap', 5);
    this.setClient('dimTextFont', '12px Arial');
    this.setClient('dimArrowWidth', 8);
    this.setClient('dimArrowHeight', 3);

    this.setClient('coordTextColor', 'white');
    this.setClient('coordTextFont', '12px Arial');
    this.setClient('coordTextOffsetX', 0);
    this.setClient('coordTextOffsetY', 20);
    this.setClient('coordTextAlign', 'center');
    this.setClient('coordTextBaseline', 'middle');
    this.setClient('coordTextBackground', 'rgba(240,120,25,0.7)');

    this.setClient('decimalNumber', 0);
}

twaver.Util.ext('make.Default.ImageShapeNode', twaver.ShapeNode, {
    getCanvasUIClass: function () {
        return make.Default.ImageShapeNodeUI;
    },

    getElementUIClass: function () {
        return make.Default.ImageShapeNodeUI;
    },

    getVectorUIClass: function () {
        return make.Default.ImageShapeNodeUI;
    },

    onChildRemoved: function (child, index) {
        this.refreshChilden();
    },

    onChildAdded: function (child, index) {
        this.refreshChilden();
    },

    onPropertyChanged: function (e) {
        make.Default.ImageShapeNode.superClass.onPropertyChanged.call(this, e);
        if (e.property === 'points') {
            this.refreshChilden();
        }
    },
    checkBlockOnEdge: function (index) {
        var result = false;
        this.getChildren().forEach(function (child) {
            if (child.getClient('edgeIndex') === index) {
                result = true;
            }
        });
        return result;
    },
    refreshChilden: function () {
        this.getChildren().forEach(function (child) {
            child.refresh && child.refresh();
        });
    },

    isPointOnPoints: function (point) {
        var points = this.getPoints();
        for (var i = 0; i < points.size(); i++) {
            if (_twaver.math.getDistance(point, points.get(i)) <= 10) {
                return true;
            }
        }
        return false;
    },
    getPointIndex: function (point) {
        var points = this.getPoints();
        if (points.size() < 2) {
            return -1;
        }
        for (var i = 0; i < points.size(); i++) {
            if (_twaver.math.getDistance(point, points.get(i)) <= 10) {
                return -1;
            }
        }
        var p1 = points.get(0),
            p2;
        for (var i = 1; i < points.size(); i++) {
            p2 = points.get(i);
            if (this.isPointOnLine(point, p1, p2, 10)) {
                return i - 1;
            }
            p1 = p2;
        }
        p1 = points.get(0);
        if (this.isPointOnLine(point, p1, p2, 10)) {
            return points.size() - 1;
        }
        return -1;
    },
    isPointOnLine: function (point, point1, point2, width) {
        if (width < 0) {
            width = 0;
        }
        var distance = this.getDistanceFromPointToLine(point, point1, point2);
        return distance <= width && (point.x >= Math.min(point1.x, point2.x) - width) && (point.x <= Math.max(point1.x, point2.x) + width) && (point.y >= Math.min(point1.y, point2.y) - width) && (point.y <= Math.max(point1.y, point2.y) + width);
    },
    getDistanceFromPointToLine: function (point, point1, point2) {
        if (point1.x === point2.x) {
            return Math.abs(point.x - point1.x);
        }
        var lineK = (point2.y - point1.y) / (point2.x - point1.x);
        var lineC = (point2.x * point1.y - point1.x * point2.y) / (point2.x - point1.x);
        return Math.abs(lineK * point.x - point.y + lineC) / (Math.sqrt(lineK * lineK + 1));
    },
    setOffsetYofPoints: function (offset) {
        this.offsetY = offset;
    },
    setOffsetXofPoints: function (offset) {
        this.offsetX = offset;
    },
    getOffsetYofPoints: function () {
        return this.offsetY || 0;
    },
    getOffsetXofPoints: function () {
        return this.offsetX || 0;
    },
    setNegatedYInterval: function (negatedYInterval) {
        this.negatedYInterval = negatedYInterval;
    },
    getNegatedYInterval: function () {
        return this.negatedYInterval;
    }

});

make.Default.ImageShapeNodeUI = function (shapeNode, network) {
    make.Default.ImageShapeNodeUI.superClass.constructor.apply(this, arguments);
}

twaver.Util.ext('make.Default.ImageShapeNodeUI', twaver.vector.ShapeNodeUI, {
    drawDefaultBody: function (ctx) {
        var element = this._element;
        //      points = element._points;
        if (!element._points || element._points.size() < 1) return;
        var points = this._getZoomPoints();
        var segments = element._segments,
            borderWidth = element.getStyle('vector.outline.width'),
            borderPattern = element.getStyle('vector.outline.pattern'),
            lineWidth = element.getStyle('vector.outline.width'),
            strokeStyle = element.getStyle('vector.outline.color'),
            close = element.getClient('closed'),
            rect = twaver.Util.getRect(points),
            g = ctx;
        if (borderWidth > 0) {
            twaver.Util.grow(rect, borderWidth, borderWidth);
        }
        var selected = this._network.isSelected(this._element),
            resizeBorderWidth = this._element.getClient('resizeBorderWidth'),
            resizeBorderLength = this._element.getClient('resizeBorderLength'),
            resizeBorderGap = this._element.getClient('resizeBorderGap'),
            resizeBorderColor = this._element.getClient('resizeBorderColor'),
            pointsRect;


        if (selected) {
            pointsRect = _twaver.clone(rect);
        }
        g = this.setShadow(this, g);

        //draw shape node
        g.beginPath();
        //var image = twaver.Util.getImageAsset(getImagePath(element.getClient('imageSrc')));
        var src = getImagePath(element.getClient('imageSrc'));
        if (src) {
            var image = twaver.Util.getImageAsset(src);
            if (image) {
                g.fillStyle = g.createPattern(image.getImage(), 'repeat');
            } else {
                twaver.Util.registerImageByUrl(src, src, null, function () {
                    element.setClient('imageSrc-trigger', 1)
                });
            }
        }
        g.lineWidth = lineWidth;
        g.strokeStyle = strokeStyle;
        _twaver.g.drawLinePoints(g, points, borderPattern, segments, close);
        if (src) {
            g.fill();
        }
        g.stroke();

        var index = element.getClient('focusIndex');
        if (index >= 0) {
            var from = points.get(index),
                to = points.get(index === points.size() - 1 ? 0 : index + 1);
            g.beginPath();
            g.strokeStyle = element.getClient('focusColor');
            g.moveTo(from.x, from.y);
            g.lineTo(to.x, to.y);
            g.stroke();
        }

        if (selected) {
            g.lineWidth = resizeBorderWidth + 2;
            g.strokeStyle = 'black';
            g.beginPath();
            this._borderLines = [];
            var p1, p2, p3;
            p1 = {
                x: pointsRect.x - resizeBorderGap,
                y: pointsRect.y - resizeBorderGap
            };
            p2 = {
                x: p1.x,
                y: p1.y + resizeBorderLength
            };
            p3 = {
                x: p1.x + resizeBorderLength,
                y: p1.y
            };
            this._addBorderLine(g, p1, p2, p3);

            p1 = {
                x: pointsRect.x + pointsRect.width + resizeBorderGap,
                y: pointsRect.y - resizeBorderGap
            };
            p2 = {
                x: p1.x - resizeBorderLength,
                y: p1.y
            };
            p3 = {
                x: p1.x,
                y: p1.y + resizeBorderLength
            };
            this._addBorderLine(g, p1, p2, p3);

            p1 = {
                x: pointsRect.x + pointsRect.width + resizeBorderGap,
                y: pointsRect.y + pointsRect.height + resizeBorderGap
            };
            p2 = {
                x: p1.x,
                y: p1.y - resizeBorderLength
            };
            p3 = {
                x: p1.x - resizeBorderLength,
                y: p1.y
            };
            this._addBorderLine(g, p1, p2, p3);

            p1 = {
                x: pointsRect.x - resizeBorderGap,
                y: pointsRect.y + pointsRect.height + resizeBorderGap
            };
            p2 = {
                x: p1.x + resizeBorderLength,
                y: p1.y
            };
            p3 = {
                x: p1.x,
                y: p1.y - resizeBorderLength
            };
            this._addBorderLine(g, p1, p2, p3);
            g.stroke();

            g.beginPath();
            g.lineWidth = resizeBorderWidth;
            g.strokeStyle = resizeBorderColor;
            resizeBorderLength -= 1;
            p1 = {
                x: pointsRect.x - resizeBorderGap,
                y: pointsRect.y - resizeBorderGap
            };
            p2 = {
                x: p1.x,
                y: p1.y + resizeBorderLength
            };
            p3 = {
                x: p1.x + resizeBorderLength,
                y: p1.y
            };
            g.moveTo(p2.x, p2.y);
            g.lineTo(p1.x, p1.y);
            g.lineTo(p3.x, p3.y);

            p1 = {
                x: pointsRect.x + pointsRect.width + resizeBorderGap,
                y: pointsRect.y - resizeBorderGap
            };
            p2 = {
                x: p1.x - resizeBorderLength,
                y: p1.y
            };
            p3 = {
                x: p1.x,
                y: p1.y + resizeBorderLength
            };
            g.moveTo(p2.x, p2.y);
            g.lineTo(p1.x, p1.y);
            g.lineTo(p3.x, p3.y);

            p1 = {
                x: pointsRect.x + pointsRect.width + resizeBorderGap,
                y: pointsRect.y + pointsRect.height + resizeBorderGap
            };
            p2 = {
                x: p1.x,
                y: p1.y - resizeBorderLength
            };
            p3 = {
                x: p1.x - resizeBorderLength,
                y: p1.y
            };
            g.moveTo(p2.x, p2.y);
            g.lineTo(p1.x, p1.y);
            g.lineTo(p3.x, p3.y);

            p1 = {
                x: pointsRect.x - resizeBorderGap,
                y: pointsRect.y + pointsRect.height + resizeBorderGap
            };
            p2 = {
                x: p1.x + resizeBorderLength,
                y: p1.y
            };
            p3 = {
                x: p1.x,
                y: p1.y - resizeBorderLength
            };
            g.moveTo(p2.x, p2.y);
            g.lineTo(p1.x, p1.y);
            g.lineTo(p3.x, p3.y);
            g.stroke();
        }

        if (selected) {
            this.drawCoord(g);
            this.drawDim(g);
        }

    },

    validateBodyBounds: function () {
        make.Default.ImageShapeNodeUI.superClass.validateBodyBounds.call(this);

        //calculate body bounds here.
        var element = this._element;
        //      points = element._points,
        if (!element._points || element._points.size() < 1) return;
        var points = this._getZoomPoints();
        if (points.size() < 2) return;
        var borderWidth = element.getStyle('vector.outline.width');
        //      rect = twaver.Util.getRect(points);
        var rect = this.getPathRect('vector', true);

        if (borderWidth > 0) {
            twaver.Util.grow(rect, borderWidth, borderWidth);
        }
        var selected = this._network.isSelected(this._element),
            resizeBorderWidth = this._element.getClient('resizeBorderWidth'),
            resizeBorderGap = this._element.getClient('resizeBorderGap');
        if (selected) {
            twaver.Util.grow(rect, (resizeBorderWidth + resizeBorderGap) / this._network.getZoom() * 2 + 2, (resizeBorderWidth + resizeBorderGap) / this._network.getZoom() * 2 + 2);
        }

        this.addBodyBounds(rect);
    },

    _addBorderLine: function (g, p1, p2, p3) {
        this._borderLines.push({
            point1: p2,
            point2: p1
        });
        this._borderLines.push({
            point1: p1,
            point2: p3
        });
        g.moveTo(p2.x, p2.y);
        g.lineTo(p1.x, p1.y);
        g.lineTo(p3.x, p3.y);
    },

    isPointOnBorderLine: function (point) {
        if (!this._borderLines) {
            return null;
        }
        var resizeBorderWidth = this._element.getClient('resizeBorderWidth');
        for (var i = 0; i < this._borderLines.length; i++) {
            var line = this._borderLines[i];
            if (this._element.isPointOnLine(point, line.point1, line.point2, resizeBorderWidth)) {
                return Math.floor(i / 2);
            }
        }
        return null;
    },

    drawDim: function (ctx) {
        var self = this;
        var g = ctx;
        var element = this._element;
        //        var points = element.getPoints();
        var points = this._getZoomPoints();
        var logical_points = element.getPoints();
        if (!points || points.size() < 2 || !this._network.isSelected(element)) {
            return;
        }

        var rect = this.getBodyRect();
        var dimLeadLength = element.getClient('dimLeadLength'),
            dimLineOffset = element.getClient('dimLineOffset'),
            dimLineWidth = element.getClient('dimLineWidth'),
            dimColor = element.getClient('dimColor'),
            dimTextGap = element.getClient('dimTextGap'),
            dimTextFont = element.getClient('dimTextFont'),
            dimArrowWidth = element.getClient('dimArrowWidth'),
            dimArrowHeight = element.getClient('dimArrowHeight');

        var bounds = {
            x: rect.x - dimLeadLength,
            y: rect.y - dimLeadLength,
            width: rect.width + dimLeadLength * 2,
            height: rect.height + dimLeadLength * 2
        };
        if (this.isClockwise()) {
            dimLeadLength = -dimLeadLength;
        }
        this.addBodyBounds(bounds);
        g = this.setShadow(this, g);

        g.strokeStyle = dimColor;
        g.lineWidth = dimLineWidth;
        g.fillStyle = dimColor;
        g.font = dimTextFont;
        g.textAlign = 'center';
        g.textBaseline = 'middle';

        function drawDimEdge(p1, p2, distance) {
            if (distance == 0) return;
            var center = _twaver.math.getCenterPoint(p1, p2);
            var angle = angle1 = _twaver.math.getAngle(p1, p2);
            if (p2.x < p1.x) {
                angle = Math.PI + angle;
            }

            //            var distance = _twaver.math.getDistance(p1, p2);
            var text = distance.toFixed(2);
            var textWidth = g.measureText(text).width;

            var matrix = _twaver.math.createMatrix(angle, p1.x, p1.y);
            var newp1 = matrix.transform({
                x: p1.x,
                y: p1.y - dimLeadLength
            });
            var newc1 = matrix.transform({
                x: p1.x,
                y: p1.y - dimLeadLength * dimLineOffset
            });
            matrix = _twaver.math.createMatrix(angle, p2.x, p2.y);
            var newp2 = matrix.transform({
                x: p2.x,
                y: p2.y - dimLeadLength
            });
            var newc2 = matrix.transform({
                x: p2.x,
                y: p2.y - dimLeadLength * dimLineOffset
            });
            var newd1 = self.getPointBetween(newc1, newc2, (0.5 - (textWidth / 2 + dimTextGap) / distance));
            var newd2 = self.getPointBetween(newc1, newc2, (0.5 + (textWidth / 2 + dimTextGap) / distance));
            var a1 = self.getPointBetween(newc1, newc2, dimArrowWidth / distance);
            matrix = _twaver.math.createMatrix(angle, a1.x, a1.y);
            var a11 = matrix.transform({
                x: a1.x,
                y: a1.y - dimArrowHeight
            });
            var a12 = matrix.transform({
                x: a1.x,
                y: a1.y + dimArrowHeight
            });
            var a2 = self.getPointBetween(newc1, newc2, 1 - dimArrowWidth / distance);
            matrix = _twaver.math.createMatrix(angle, a2.x, a2.y);
            var a21 = matrix.transform({
                x: a2.x,
                y: a2.y - dimArrowHeight
            });
            var a22 = matrix.transform({
                x: a2.x,
                y: a2.y + dimArrowHeight
            });

            g.beginPath();
            g.moveTo(p1.x, p1.y);
            g.lineTo(newp1.x, newp1.y);
            g.moveTo(p2.x, p2.y);
            g.lineTo(newp2.x, newp2.y);

            g.moveTo(newc1.x, newc1.y);
            g.lineTo(newd1.x, newd1.y);
            g.moveTo(newd2.x, newd2.y);
            g.lineTo(newc2.x, newc2.y);

            g.moveTo(newc1.x, newc1.y);
            g.lineTo(a11.x, a11.y);
            g.moveTo(newc1.x, newc1.y);
            g.lineTo(a12.x, a12.y);
            g.moveTo(newc2.x, newc2.y);
            g.lineTo(a21.x, a21.y);
            g.moveTo(newc2.x, newc2.y);
            g.lineTo(a22.x, a22.y);
            g.stroke();

            g.save();
            center = {
                x: (newc1.x + newc2.x) / 2,
                y: (newc1.y + newc2.y) / 2
            };
            g.translate(center.x, center.y);
            g.rotate(angle1);
            g.translate(-center.x, -center.y);
            g.fillText(text, center.x, center.y);
            g.restore();
        }

        var p1 = points.get(0);
        var logical_p1 = logical_points.get(0);
        for (var i = 1, n = points.size(); i < n; i++) {
            var p2 = points.get(i);
            var logical_p2 = logical_points.get(i);
            var distance = _twaver.math.getDistance(logical_p1, logical_p2);
            logical_p1 = logical_p2;
            drawDimEdge(p1, p2, distance);
            p1 = p2;
        }
        if (n > 2) {
            var distance = _twaver.math.getDistance(logical_p1, logical_points.get(0));
            drawDimEdge(p1, points.get(0), distance);
        }

    },

    getPointBetween: function (p1, p2, ratio) {
        return {
            x: p1.x + (p2.x - p1.x) * ratio,
            y: p1.y + (p2.y - p1.y) * ratio
        };
    },
    // http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
    isClockwise: function (points) {
        var element = this._element;
        var points = element.getPoints();
        if (!points || points.size() < 2) {
            return true;
        }
        var sum = 0,
            l = points.size();
        for (var i = 0; i < l; i++) {
            var p1 = points.get(i);
            var p2 = points.get((i + 1 === l ? 0 : (i + 1)));
            sum += (p2.x - p1.x) * (p2.y + p1.y);
        }
        return sum > 0;
    },

    drawCoord: function (ctx) {
        var g = ctx;
        var self = this;
        var element = this._element;
        //        var points = element.getPoints();
        var points = this._getZoomPoints();
        var logicalPoints = element.getPoints();
        if (!points) {
            return;
        }
        if (!logicalPoints) {
            return;
        }
        var rect = this.getBodyRect();

        var coordTextColor = element.getClient('coordTextColor'),
            coordTextFont = element.getClient('coordTextFont'),
            coordTextOffsetX = element.getClient('coordTextOffsetX'),
            coordTextOffsetY = element.getClient('coordTextOffsetY'),
            coordTextAlign = element.getClient('coordTextAlign'),
            coordTextBaseline = element.getClient('coordTextBaseline'),
            coordTextBackground = element.getClient('coordTextBackground'),
            decimalNumber = element.getClient('decimalNumber');

        //expend bounds to enough area to hold all text.
        var bounds = {
            x: rect.x - 100,
            y: rect.y - 50,
            width: rect.width + 200,
            height: rect.height + 100
        };
        this.addBodyBounds(bounds);
        g = this.setShadow(this, g);

        g.save();
        g.font = coordTextFont;
        for (var i = 0, n = points.size(); i < n; i++) {
            var p = points.get(i);
            var logical_p = logicalPoints.get(i);
            var text = '(' + (p.x + element.getOffsetXofPoints()).toFixed(decimalNumber) + ', ' + (p.y * (element.getNegatedYInterval() ? -1 : 1) + element.getOffsetYofPoints()).toFixed(decimalNumber) + ')';
            if (logical_p) {
                text = '(' + (logical_p.x + element.getOffsetXofPoints()).toFixed(decimalNumber) + ', ' + (logical_p.y * (element.getNegatedYInterval() ? -1 : 1) + element.getOffsetYofPoints()).toFixed(decimalNumber) + ')';
            }
            var size = _twaver.g.getTextSize(g.font, text);
            g.fillStyle = coordTextBackground;
            g.fillRect(p.x - size.width / 2 + coordTextOffsetX, p.y - size.height / 2 + coordTextOffsetY, size.width, size.height);
            g.fillStyle = coordTextColor;
            g.textAlign = coordTextAlign;
            g.textBaseline = coordTextBaseline
            g.fillText(text, p.x, p.y + coordTextOffsetY); //p.x + coordTextOffsetX
        }
        g.restore();
    }
});

make.Default.WallShapeNode = function () {
    make.Default.WallShapeNode.superClass.constructor.apply(this, arguments);
}

twaver.Util.ext(make.Default.WallShapeNode, make.Default.ImageShapeNode, {});

var idcLayer = {
    'wall': 100,
    'area': 200,
    'innerWall': 300,
    'wallChild': 400,
    'innerWallChild': 500,
    'channel': 600,
    'rack': 700,
    'default': 800
}

var getIdcIconPath = function (icon) {
    if (icon.indexOf('/') > 0) {
        return icon;
    }
    return 'models/images/' + icon;
}

var getModelParameters = function (name, description, icon, category, categoryNumber, order, modelParams, type, layer) {
    return {
        name: name || "外墙",
        description: description || "外墙说明",
        icon: getIdcIconPath(icon || 'column.png'),
        category: category || '默认模型',
        categoryNumber: categoryNumber || 10,
        order: order || 10,
        type: type || 'twaver.Node',
        layer: layer || idcLayer.default,
        modelDefaultParameters: modelParams || {},
    }
}

var get2dWallDefaultParameters = function () {
    return {
        'bid': {
            name: "业务ID",
            value: undefined,
            type: make.Default.PARAMETER_TYPE_STRING,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_CLIENT
        },
        'wallHeight': {
            name: "墙高",
            value: 260,
            type: make.Default.PARAMETER_TYPE_NUMBER,
            propertyType: make.Default.PARAMETER_PROPERTY_TYPE_CLIENT
        }
    }
}

make.Default.register('twaver.idc.wall.top', function (json) {
    var wallJson = {
        objType: 'wall',
        client: {
            'data': json.data,
            'type': 'wall',
            'closed': true
        }
    }
    make.Default.copyProperties(json, wallJson);
    var wall = make.Default.create2dShapeNode(wallJson);
    var children = json.children;
    if (children) {
        children.forEach(function (child) {
            var childNode = make.Default.load(child);
            childNode.setParent(wall);
        });
    }
    return wall;
}, getModelParameters("外墙", "外墙说明", 'wall.png', '2d房间模型', 10, 10, get2dWallDefaultParameters(), 'wall', idcLayer.wall));

make.Default.InnerWallShapeNode = function () {
    make.Default.InnerWallShapeNode.superClass.constructor.apply(this, arguments);
    //设置image为空，解决大套小无法选中问题
    this.setClient('imageSrc', null);
    this.setStyle("vector.outline.color", topoStyle.innerWall.color);
    this.setStyle("vector.outline.width", 5);
    this.setClient("closed", false);
    this.setClient('showFloor', false);
    this.setClient('focusColor', 'green');
    this.setClient('resizeBorderWidth', 10);
    this.setClient('resizeBorderLength', 25);
    this.setClient('resizeBorderGap', 10);
    this.setClient('resizeBorderColor', 'yellow');
    this.setClient('size', {
        x: 0,
        y: 230,
        z: 4
    });
    this.setClient('repeat', {
        row: 1,
        column: 1
    });
}

twaver.Util.ext(make.Default.InnerWallShapeNode, make.Default.WallShapeNode, {});

make.Default.register('twaver.idc.innerWall.top', function (json) {
    var wallJson = {
        objType: 'innerWall',
        client: {
            'data': json.data,
            'type': 'innerWall',
        },
    };
    make.Default.copyProperties(json, wallJson);
    var innerWall = make.Default.create2dShapeNode(wallJson);
    var children = json.children;
    if (children) {
        children.forEach(function (child) {
            var childNode = make.Default.load(child);
            childNode.setParent(innerWall);
        });
    }
    return innerWall;
}, getModelParameters("内墙", "内墙说明", 'innerWall.png', '2d房间模型', 10, 20, get2dWallDefaultParameters(), 'innerWall', idcLayer.innerWall));
