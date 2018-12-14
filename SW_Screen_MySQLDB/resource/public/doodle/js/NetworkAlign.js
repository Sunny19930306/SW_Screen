/**
 * [NetworkAlign network水平垂直辅助线]
 */
var NetworkAlign = function() {

};

twaver.Util.ext(NetworkAlign, Object, {
    _alignLineDash: [10, 5],
    _alignLineWidth: 1,
    _alignLineColor: 'blue',
    _dimensionLineWidth: 1,
    _dimensionLineColor: 'red',
    _dimensionTextColor: 'red',
    _dimensionTextFont: '20px arial',          
    _dimensionArrowWidth: 2,
    _dimensionArrowHeight: 1.5,
    _snapGap: 5,
    _snapLineColor: 'green',
    _snapLineWidth: 1,

    bind: function(network) {
        var self = this;
        self._network = network;
        network.getView().addEventListener('mousedown', function(e) {
            var element = network.getElementAt(e);
            if (network.isRotatingElement()) return;
            if (element instanceof twaver.Node) {
                console.log(element);
                self.movingElement = element;
                self.calculateRect();
                network.repaintTopCanvas();
            }
        });
        network.getView().addEventListener('mousemove', function(e) {
            if (!self.movingElement) {
                return;
            }
            self.isEditing = network.isEditingElement();
            self.calculateRect();
            network.repaintTopCanvas();
        });
        window.addEventListener('mouseup', function(e) {
            if (self.movingElement) {
                self.snap();
            }
            self.movingElement = null;
            self.leftRect = null;
            self.topRect = null;
            self.rightRect = null;
            self.bottomRect = null;
            self.isEditing = null;
        });
        network.addMarker(self);
    },
    compare: function(a, b) {
        return Math.abs(a - b) <= this._snapGap;
    },
    dValue: function(a, b) {
        return Math.abs(a - b);
    },
    calculateRect: function() {
        var self = this,
            movingElement = self.movingElement,
            movingRect = self.movingRect = movingElement.getRect(),
            rects = [],
            snapGap = self._snapGap,
            box = self._network.getElementBox(),
            leftRect, topRect, rightRect, bottomRect, centerXRect, centerYRect;
        self.setRectRightAndBottom(movingRect);
        box.forEach(function(element) {
            if (element !== movingElement && element instanceof twaver.Node) {
                var rect = element.getRect();
                self.setRectRightAndBottom(rect);
                rects.push(rect);
            }
        });
        rects.forEach(function(rect) {
            if (self.compare(rect.right, movingRect.x) || self.compare(rect.x, movingRect.x)) {
                if (self.dValue(rect.right, movingRect.x) < self.dValue(rect.x, movingRect.x)) {
                    rect._left = rect.right;
                } else {
                    rect._left = rect.x;
                }
                if (!leftRect) {
                    leftRect = rect;
                } else {
                    if (rect._left > leftRect._left) {
                        leftRect = rect;
                    }
                }
            }
            if (self.compare(rect.bottom, movingRect.y) || self.compare(rect.y, movingRect.y)) {
                if (self.dValue(rect.bottom, movingRect.y) < self.dValue(rect.y, movingRect.y)) {
                    rect._top = rect.bottom;
                } else {
                    rect._top = rect.y;
                }
                if (!topRect) {
                    topRect = rect;
                } else {
                    if (rect._top > topRect._top) {
                        topRect = rect;
                    }
                }
            }
            if (self.compare(rect.x, movingRect.right) || self.compare(rect.right, movingRect.right)) {
                if (self.dValue(rect.x, movingRect.right) < self.dValue(rect.right, movingRect.right)) {
                    rect._right = rect.x;
                } else {
                    rect._right = rect.right;
                }
                if (!rightRect) {
                    rightRect = rect;
                } else {
                    if (rect._right < rightRect._right) {
                        rightRect = rect;
                    }
                }
            }
            if (self.compare(rect.y, movingRect.bottom) || self.compare(rect.bottom, movingRect.bottom)) {
                if (self.dValue(rect.y, movingRect.bottom) < self.dValue(rect.bottom, movingRect.bottom)) {
                    rect._bottom = rect.y;
                } else {
                    rect._bottom = rect.bottom;
                }
                if (!bottomRect) {
                    bottomRect = rect;
                } else {
                    if (rect._bottom < bottomRect._bottom) {
                        bottomRect = rect;
                    }
                }
            }
            if (self.compare(rect.centerX, movingRect.centerX)) {
                rect._centerX = rect.centerX;
                if (!centerXRect) {
                    centerXRect = rect;
                } else {
                    if (rect._centerX < centerXRect._centerX) {
                        centerXRect = rect;
                    }
                }
            }
            if (self.compare(rect.centerY, movingRect.centerY)) {
                rect._centerY = rect.centerY;
                if (!centerYRect) {
                    centerYRect = rect;
                } else {
                    if (rect._centerY < centerYRect._centerY) {
                        centerYRect = rect;
                    }
                }
            }
        });
        self.leftRect = leftRect;
        self.topRect = topRect;
        self.rightRect = rightRect;
        self.bottomRect = bottomRect;
        self.centerXRect = centerXRect;
        self.centerYRect = centerYRect;

        leftRect && (leftRect.snapLeft = true);
        topRect && (topRect.snapTop = true);
        rightRect && (rightRect.snapRight = true);
        bottomRect && (bottomRect.snapBottom = true);
        centerXRect && (centerXRect.snap = true);
        centerYRect && (centerYRect.snap = true);
        // if (leftRect && movingRect.x - leftRect.x <= snapGap) {
        //   leftRect.snapLeft = true;
        // }
        // if (topRect && movingRect.y - topRect.y <= snapGap) {
        //   topRect.snapTop = true;
        // }
        // if (rightRect && rightRect.right - movingRect.right <= snapGap) {
        //   rightRect.snapRight = true;
        // }
        // if (bottomRect && bottomRect.bottom - movingRect.bottom <= snapGap) {
        //   bottomRect.snapBottom = true;
        // }
    },
    snap: function() {
        var self = this,
            isEditing = self.isEditing,
            leftRect = self.leftRect,
            topRect = self.topRect,
            rightRect = self.rightRect,
            bottomRect = self.bottomRect,
            movingElement = self.movingElement,
            movingRect = self.movingRect,
            centerXRect = self.centerXRect,
            centerYRect = self.centerYRect;
        if (leftRect && leftRect.snapLeft) {
            if (isEditing) {
                // movingElement.setWidth(movingElement.getWidth() + movingRect.x - leftRect.x);
                movingElement.setWidth(movingElement.getWidth() + movingRect.x - leftRect._left);
            }
            movingElement.setX(leftRect._left);
        }
        if (topRect && topRect.snapTop) {
            if (isEditing) {
                // movingElement.setHeight(movingElement.getHeight() + movingRect.y - topRect.y);
                movingElement.setHeight(movingElement.getHeight() + movingRect.y - topRect._top);
            }
            // movingElement.setY(topRect.y);
            movingElement.setY(topRect._top);
        }
        if (rightRect && rightRect.snapRight) {
            if (isEditing) {
                // movingElement.setWidth(movingElement.getWidth() + rightRect.right - movingRect.right);
                movingElement.setWidth(movingElement.getWidth() + rightRect._right - movingRect.right);
            } else {
                // movingElement.setX(rightRect.right - movingElement.getWidth());
                movingElement.setX(rightRect._right - movingElement.getWidth());
            }
        }
        if (bottomRect && bottomRect.snapBottom) {
            if (isEditing) {
                // movingElement.setHeight(movingElement.getHeight() + bottomRect.bottom - movingRect.bottom);
                movingElement.setHeight(movingElement.getHeight() + bottomRect._bottom - movingRect.bottom);
            } else {
                // movingElement.setY(bottomRect.bottom - movingElement.getHeight());
                movingElement.setY(bottomRect._bottom - movingElement.getHeight());
            }
        }
        if (centerXRect && centerXRect.snap) {
            if (isEditing) {
                movingElement.setWidth(movingElement.getWidth() + centerXRect._centerX - (movingRect.right - movingRect.x) / 2);
            } else {
                movingElement.setX(centerXRect._centerX - movingElement.getWidth() / 2);
            }
        }
        if (centerYRect && centerYRect.snap) {
            if (isEditing) {
                movingElement.setHeight(movingElement.setHeight() + centerYRect._centerY - (movingRect.bottom - movingRect.y) / 2);
            } else {
                movingElement.setY(centerYRect._centerY - movingElement.getHeight() / 2);
            }
        }
    },
    paint: function(ctx) {
        var self = this,
            network = self._network,
            leftRect = self.leftRect,
            topRect = self.topRect,
            rightRect = self.rightRect,
            bottomRect = self.bottomRect,
            movingRect = self.movingRect,
            movingElement = self.movingElement,
            centerXRect = self.centerXRect,
            centerYRect = self.centerYRect,
            x1, x2, y1, y2;
        if (!movingElement) {
            return;
        }

        var zoom = network.getZoom(),
            viewRect = network.getViewRect(),
            bx = viewRect.x / zoom,
            by = viewRect.y / zoom,
            networkW = viewRect.width / zoom,
            networkH = viewRect.height / zoom;

        ctx.save();
        var zoom = network.getZoom();
        ctx.scale(zoom, zoom);
        ctx.translate(-network.viewRect.x / zoom, -network.viewRect.y / zoom);

        if (leftRect && !centerXRect) {
            x1 = x2 = leftRect._left;
            y1 = 0;
            y2 = networkH;
            self._drawDashLine(ctx, x1, y1, x2, y2, leftRect.snapLeft);
        }
        if (topRect && !centerYRect) {
            x1 = bx;
            y1 = y2 = topRect._top;
            x2 = networkW;
            self._drawDashLine(ctx, x1, y1, x2, y2, topRect.snapTop);
        }
        if (rightRect && !centerXRect) {
            x1 = x2 = rightRect._right;
            y1 = by;
            y2 = networkH;
            self._drawDashLine(ctx, x1, y1, x2, y2, rightRect.snapRight);
        }
        if (bottomRect && !centerYRect) {
            x1 = bx;
            y1 = y2 = bottomRect._bottom;
            x2 = networkW;
            self._drawDashLine(ctx, x1, y1, x2, y2, bottomRect.snapBottom);
        }
        if (centerXRect) {
            x1 = x2 = centerXRect._centerX;
            y1 = by;
            y2 = networkH;
            self._drawDashLine(ctx, x1, y1, x2, y2, centerXRect.snap);
        }
        if (centerYRect) {
            x1 = bx;
            y1 = y2 = centerYRect._centerY;
            x2 = networkW;
            self._drawDashLine(ctx, x1, y1, x2, y2, centerYRect.snap);
        }


        ctx.restore();
    },
    _drawDashLine: function(ctx, x1, y1, x2, y2, snap) {
        var self = this,
            dash = self._alignLineDash;
        ctx.save();
        if (snap) {
            ctx.lineWidth = self._snapLineWidth;
            ctx.strokeStyle = self._snapLineColor;
        } else {
            ctx.mozDash = dash;
            ctx.setLineDash(dash);
            ctx.lineWidth = self._alignLineWidth;
            ctx.strokeStyle = self._alignLineColor;
        }
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1 + 0.5);
        ctx.lineTo(x2 + 0.5, y2 + 0.5);
        ctx.stroke();
        ctx.restore();
    },
    _drawDimension: function(ctx, x1, y1, x2, y2, snap) {
        // return;
        var self = this,
            x = (x1 + x2) / 2,
            y = (y1 + y2) / 2,
            h = y1 === y2,
            value = Math.floor((y2 - y1) || (x2 - x1)),
            arrowWidth = self._dimensionArrowWidth,
            arrowHeight = self._dimensionArrowHeight,
            ignorArrowWidth = arrowWidth * 2;
        if (value <= self._snapGap && snap) {
            return;
        }
        ctx.save();
        ctx.lineWidth = self._dimensionLineWidth;
        ctx.strokeStyle = self._dimensionLineColor;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        // Arrow
        if (value >= ignorArrowWidth) {
            if (h) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + arrowWidth, y1 - arrowHeight);
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + arrowWidth, y1 + arrowHeight);
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - arrowWidth, y2 - arrowHeight);
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - arrowWidth, y2 + arrowHeight);
            } else {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 - arrowHeight, y1 + arrowWidth);
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + arrowHeight, y1 + arrowWidth);
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - arrowHeight, y2 - arrowWidth);
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 + arrowHeight, y2 - arrowWidth);
            }
        }
        ctx.stroke();
        ctx.font = self._dimensionTextFont;
        ctx.fillStyle = self._dimensionTextColor;
        ctx.fillText(value, x, y);
        ctx.restore();
    },
    setRectRightAndBottom: function(rect) {
        rect.right = rect.x + rect.width;
        rect.bottom = rect.y + rect.height;
        rect.centerX = rect.x + parseInt((rect.width / 2).toFixed(2));
        rect.centerY = rect.y + parseInt((rect.height / 2).toFixed(2));
    },
    setAlignLineDash: function(value) {
        this._alignLineDash = value;
    },
    setAlignLineWidth: function(value) {
        this._alignLineWidth = value;
    },
    setAlignLineColor: function(value) {
        this._alignLineColor = value;
    },
    setDimensionLineWidth: function(value) {
        this._dimensionLineWidth = value;
    },
    setDimensionLineColor: function(value) {
        this._dimensionLineColor = value;
    },
    setDimensionTextColor: function(value) {
        this._dimensionTextColor = value;
    },
    setDimensionTextFont: function(value) {
        this._dimensionTextFont = value;
    },
    setDimensionArrowWidth: function(value) {
        this._dimensionArrowWidth = value;
    },
    setDimensionArrowHeight: function(value) {
        this._dimensionArrowHeight = value;
    },
    setSnapGap: function(value) {
        this._snapGap = value;
    },
    setSnapLineColor: function(value) {
        this._snapLineColor = value;
    },
    setSnapLineWidth: function(value) {
        this._snapLineWidth = value;
    }
});