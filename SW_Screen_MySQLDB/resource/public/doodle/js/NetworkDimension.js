var NetworkDimension = function() {};

twaver.Util.ext(NetworkDimension, Object, {
  _alignLineDash: [10, 5],
  _alignLineWidth: 1,
  _alignLineColor: 'blue',
  _dimensionLineWidth: 1,
  _dimensionLineColor: 'red',
  _dimensionTextColor: 'red',
  _dimensionTextFont: '20px arial',
  _dimensionArrowWidth: 5,
  _dimensionArrowHeight: 3,
  _snapGap: 5,
  _snapLineColor: 'green',
  _snapLineWidth: 2,
  _alignBaseNode: null,
  _alignBaseHighligthColor: 'blue',

  _filter: function(element) {
    return true;
  },
  _alignFilter: function(element) {
    return true;
  },
  _snapFilter: function(element) {
    return true;
  },
  bind: function(network) {
    var self = this;
    self._network = network;
    network.getView().addEventListener('mousedown', function(e) {
      var element = network.getElementAt(e);
      if(element instanceof twaver.Node && self._filter(element)) {
        self.movingElement = element;
      }
    });
    network.getView().addEventListener('mousemove', function(e) {
      if(!self.movingElement) {
        return;
      }
      self.isEditing = network.isEditingElement();
      network.repaintTopCanvas();
 
   
      self.calculateRect();

    });
    network.getView().addEventListener('blur', function(e) {
      self.clearStatus();
    });
    window.addEventListener('mouseup', function(e) {
      self.clearStatus();
    });
    network.getElementBox().addDataBoxChangeListener(function(e) {
      if(e.kind === 'remove') {
        network.repaintTopCanvas();
      }
    });
    network.getElementBox().addDataPropertyChangeListener(function(e) {
      network.repaintTopCanvas();
    });
    network.addMarker(self);
  },
  clearStatus: function() {
    var self = this;
    if(self.movingElement && self._snapFilter(self.movingElement)) {
      self.snap();
    } else {
      self.rackSnap();
    }
    self.movingElement = null;
    self.leftRect = null;
    self.topRect = null;
    self.rightRect = null;
    self.bottomRect = null;
    self.isEditing = null;
    self._flag = true;
  },
  calculateRect: function() {
    var self = this,
      network = self._network,
      movingElement = self.movingElement,
      alignFilter = self._alignFilter,
      movingRect = self.movingRect = movingElement.getRect(),
      rects = [],
      snapGap = self._snapGap,
      alignBaseNode = self._alignBaseNode,
      leftRect, topRect, rightRect, bottomRect;
    self.setRectRightAndBottom(movingRect);
    if(alignBaseNode) {
      if(alignBaseNode !== movingElement) {
        var rect;
        if(alignBaseNode._side != null) {
          var side = alignBaseNode._side;
          var points = alignBaseNode.getPoints();
          var index1 = side;
          var index2 = side === points.size() - 1 ? 0 : side + 1;
          var p1 = points.get(index1);
          var p2 = points.get(index2);
          rect = twaver.Util.getRect([p1, p2]);
        } else {
          rect = alignBaseNode.getRect();
        }
        self.setRectRightAndBottom(rect);
        rects.push(rect);
      }
    } else {
      network.getElementBox().forEach(function(element) {
        if(element !== movingElement &&
          element instanceof twaver.Node &&
          element.getHost &&
          element.getHost() !== movingElement &&
          network.isVisible(element) &&
          alignFilter(element)) {
          var rect = element.getRect();
          self.setRectRightAndBottom(rect);
          rects.push(rect);
        }
      });
    }
    rects.forEach(function(rect) {
      if(rect.right <= movingRect.x || rect.x <= movingRect.x) {
        if(rect.right <= movingRect.x) {
          rect._left = rect.right;
        } else {
          rect._left = rect.x;
        }
        if(!leftRect) {
          leftRect = rect;
        } else {
          if(rect._left > leftRect._left) {
            leftRect = rect;
          }
        }
      }
      if(rect.bottom <= movingRect.y || rect.y <= movingRect.y) {
        if(rect.bottom <= movingRect.y) {
          rect._top = rect.bottom;
        } else {
          rect._top = rect.y;
        }
        if(!topRect) {
          topRect = rect;
        } else {
          if(rect._top > topRect._top) {
            topRect = rect;
          }
        }
      }
      if(rect.x >= movingRect.right || rect.right >= movingRect.right) {
        if(rect.x >= movingRect.right) {
          rect._right = rect.x;
        } else {
          rect._right = rect.right;
        }
        if(!rightRect) {
          rightRect = rect;
        } else {
          if(rect._right < rightRect._right) {
            rightRect = rect;
          }
        }
      }
      if(rect.y >= movingRect.bottom || rect.bottom >= movingRect.bottom) {
        if(rect.y >= movingRect.bottom) {
          rect._bottom = rect.y;
        } else {
          rect._bottom = rect.bottom;
        }
        if(!bottomRect) {
          bottomRect = rect;
        } else {
          if(rect._bottom < bottomRect._bottom) {
            bottomRect = rect;
          }
        }
      }
    });
    self.leftRect = leftRect;
    self.topRect = topRect;
    self.rightRect = rightRect;
    self.bottomRect = bottomRect;
    if(leftRect && movingRect.x - leftRect.x <= snapGap) {
      leftRect.snapLeft = true;
    }
    if(topRect && movingRect.y - topRect.y <= snapGap) {
      topRect.snapTop = true;
    }
    if(rightRect && rightRect.right - movingRect.right <= snapGap) {
      rightRect.snapRight = true;
    }
    if(bottomRect && bottomRect.bottom - movingRect.bottom <= snapGap) {
      bottomRect.snapBottom = true;
    }
  },
  snap: function() {
    var self = this,
      isEditing = self.isEditing,
      leftRect = self.leftRect,
      topRect = self.topRect,
      rightRect = self.rightRect,
      bottomRect = self.bottomRect,
      movingElement = self.movingElement,
      movingRect = self.movingRect;
    if(leftRect && leftRect.snapLeft) {
      if(isEditing) {
        movingElement.setWidth(movingElement.getWidth() + movingRect.x - leftRect.x);
      }
      movingElement.setX(leftRect.x);
    }
    if(topRect && topRect.snapTop) {
      if(isEditing) {
        movingElement.setHeight(movingElement.getHeight() + movingRect.y - topRect.y);
      }
      movingElement.setY(topRect.y);
    }
    if(rightRect && rightRect.snapRight) {
      if(isEditing) {
        movingElement.setWidth(movingElement.getWidth() + rightRect.right - movingRect.right);
      } else {
        movingElement.setX(rightRect.right - movingElement.getWidth());
      }
    }
    if(bottomRect && bottomRect.snapBottom) {
      if(isEditing) {
        movingElement.setHeight(movingElement.getHeight() + bottomRect.bottom - movingRect.bottom);
      } else {
        movingElement.setY(bottomRect.bottom - movingElement.getHeight());
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
      x1, x2, y1, y2;

    ctx.save();
    var zoom = network.getZoom();
    ctx.scale(zoom, zoom);
    ctx.translate(-network.viewRect.x / zoom, -network.viewRect.y / zoom);

    if(movingElement) {
      if(leftRect) {
        x1 = x2 = leftRect._left;
        y1 = Math.min(leftRect.y, movingRect.y);
        y2 = Math.max(leftRect.bottom, movingRect.bottom);
        self._drawDashLine(ctx, x1, y1, x2, y2, leftRect.snapLeft);
        x1 = leftRect._left;
        x2 = movingRect.x;
        y1 = y2 = movingRect.y + movingRect.height / 2;
        self._drawDimension(ctx, x1, y1, x2, y2, leftRect.snapLeft);
      }
      if(topRect) {
        x1 = Math.min(topRect.x, movingRect.x);
        y1 = y2 = topRect._top;
        x2 = Math.max(topRect.right, movingRect.right);
        self._drawDashLine(ctx, x1, y1, x2, y2, topRect.snapTop);
        x1 = x2 = movingRect.x + movingRect.width / 2;
        y1 = topRect._top;
        y2 = movingRect.y;
        self._drawDimension(ctx, x1, y1, x2, y2, topRect.snapTop);
      }
      if(rightRect) {
        x1 = x2 = rightRect._right;
        y1 = Math.min(rightRect.y, movingRect.y);
        y2 = Math.max(rightRect.bottom, movingRect.bottom);
        self._drawDashLine(ctx, x1, y1, x2, y2, rightRect.snapRight);
        x1 = movingRect.right;
        x2 = rightRect._right;
        y1 = y2 = movingRect.y + movingRect.height / 2;
        self._drawDimension(ctx, x1, y1, x2, y2, rightRect.snapRight);
      }
      if(bottomRect) {
        x1 = Math.min(bottomRect.x, movingRect.x);
        y1 = y2 = bottomRect._bottom;
        x2 = Math.max(bottomRect.right, movingRect.right);
        self._drawDashLine(ctx, x1, y1, x2, y2, bottomRect.snapBottom);
        x1 = x2 = movingRect.x + movingRect.width / 2;
        y1 = movingRect.bottom;
        y2 = bottomRect._bottom;
        self._drawDimension(ctx, x1, y1, x2, y2, bottomRect.snapBottom);
      }
    }

    var alignBaseNode = self._alignBaseNode;
    if(this._network.isVisible(alignBaseNode)) {
      var side = alignBaseNode._side,
        points = alignBaseNode.getPoints && alignBaseNode.getPoints(),
        rect = alignBaseNode.getRect();
      ctx.strokeStyle = self._alignBaseHighligthColor;
      if(side == null) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
      } else {
        ctx.lineWidth = alignBaseNode.getStyle('vector.outline.width');
        ctx.beginPath();
        var index1 = side;
        var index2 = side === points.size() - 1 ? 0 : side + 1;
        var p1 = points.get(index1);
        var p2 = points.get(index2);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  },
  _drawDashLine: function(ctx, x1, y1, x2, y2, snap) {
    var self = this,
      dash = self._alignLineDash;
    ctx.save();
    if(snap) {
      ctx.lineWidth = self._snapLineWidth;
      ctx.strokeStyle = self._snapLineColor;
    } else {
      ctx.mozDash = dash;
      ctx.setLineDash(dash);
      ctx.lineWidth = self._alignLineWidth;
      ctx.strokeStyle = self._alignLineColor;
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  },
  _drawDimension: function(ctx, x1, y1, x2, y2, snap) {
    var self = this,
      x = (x1 + x2) / 2,
      y = (y1 + y2) / 2,
      h = y1 === y2,
      value = Math.floor((y2 - y1) || (x2 - x1)),
      arrowWidth = self._dimensionArrowWidth,
      arrowHeight = self._dimensionArrowHeight,
      ignorArrowWidth = arrowWidth * 2;
    if(value <= self._snapGap && snap) {
      return;
    }
    ctx.save();
    ctx.lineWidth = self._dimensionLineWidth;
    ctx.strokeStyle = self._dimensionLineColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    // Arrow
    if(value >= ignorArrowWidth) {
      if(h) {
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
  setFilter: function(filter) {
    this._filter = filter;
  },
  setSnapFilter: function(filter) {
    this._snapFilter = filter;
  },
  setAlignFilter: function(filter) {
    this._alignFilter = filter;
  },
  setRectRightAndBottom: function(rect) {
    rect.right = rect.x + rect.width;
    rect.bottom = rect.y + rect.height;
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
  },
  getAlignBaseNode: function() {
    return this._alignBaseNode;
  },
  setAlignBaseNode: function(node) {
    this._alignBaseNode = node;
    this._network.repaintTopCanvas();
  },
  rackRect: function(type, elements) {

    var self = this,
      network = self._network,
      movingElement = self.movingElement,
      alignFilter = self._alignFilter,
      movingRect = self.movingRect = movingElement.getRect(),
      rects = [],
      snapGap = self._snapGap,
      alignBaseNode = self._alignBaseNode,
      leftRect, topRect, rightRect, bottomRect;
    self.setRectRightAndBottom(movingRect);
    elements && elements.forEach(function(element) {
      if(element !== movingElement &&
        element.getHost &&
        element.getHost() !== movingElement &&
        network.isVisible(element) && element.getClient('type') === type &&
        alignFilter(element)) {
        var rect = element.getRect();
        self.setRectRightAndBottom(rect);
        rects.push(rect);
      }
      if(element.getClient('type') === 'rackposition') {
        if(element.getChildrenSize() > 0) {
          if(movingElement.getParent() === element) {
            self._flag = true;
          } else {
            self._flag = false;
          }
        } else {
          self._flag = true;
        }
      }
    });
    rects.forEach(function(rect) {
      if(rect.right <= movingRect.x || rect.x <= movingRect.x) {
        if(rect.right <= movingRect.x) {
          rect._left = rect.right;
        } else {
          rect._left = rect.x;
        }
        if(!leftRect) {
          leftRect = rect;
        } else {
          if(rect._left > leftRect._left) {
            leftRect = rect;
          }
        }
      }
      if(rect.bottom <= movingRect.y || rect.y <= movingRect.y) {
        if(rect.bottom <= movingRect.y) {
          rect._top = rect.bottom;
        } else {
          rect._top = rect.y;
        }
        if(!topRect) {
          topRect = rect;
        } else {
          if(rect._top > topRect._top) {
            topRect = rect;
          }
        }
      }
      if(rect.x >= movingRect.right || rect.right >= movingRect.right) {
        if(rect.x >= movingRect.right) {
          rect._right = rect.x;
        } else {
          rect._right = rect.right;
        }
        if(!rightRect) {
          rightRect = rect;
        } else {
          if(rect._right < rightRect._right) {
            rightRect = rect;
          }
        }
      }
      if(rect.y >= movingRect.bottom || rect.bottom >= movingRect.bottom) {
        if(rect.y >= movingRect.bottom) {
          rect._bottom = rect.y;
        } else {
          rect._bottom = rect.bottom;
        }
        if(!bottomRect) {
          bottomRect = rect;
        } else {
          if(rect._bottom < bottomRect._bottom) {
            bottomRect = rect;
          }
        }
      }
    });
    self.leftRect = leftRect;
    self.topRect = topRect;
    self.rightRect = rightRect;
    self.bottomRect = bottomRect;
    var lRect = leftRect && movingRect.x - leftRect.x;
    var tRect = topRect && movingRect.y - topRect.y;
    var rRect = rightRect && rightRect.right - movingRect.right;
    var bRect = bottomRect && bottomRect.bottom - movingRect.bottom;
    var str = Math.min(lRect, tRect, rRect, bRect);
    switch(str) {
      case lRect:
        leftRect.snapLeft = true;
        break;
      case tRect:
        topRect.snapTop = true;
        break;
      case rRect:
        rightRect.snapRight = true;
        break;
      case bRect:
        bottomRect.snapBottom = true;
        break;
    };
  },
  rackSnap: function() {
    var self = this,
      isEditing = self.isEditing,
      leftRect = self.leftRect,
      topRect = self.topRect,
      rightRect = self.rightRect,
      bottomRect = self.bottomRect,
      movingElement = self.movingElement,
      movingRect = self.movingRect;
    if(self._flag) {
      if(leftRect && leftRect.snapLeft) {
        if(isEditing) {
          movingElement.setWidth(movingElement.getWidth() + movingRect.x - leftRect.x);
        }
        movingElement.setX(leftRect.x);
      }
      if(topRect && topRect.snapTop) {
        if(isEditing) {
          movingElement.setHeight(movingElement.getHeight() + movingRect.y - topRect.y);
        }
        movingElement.setY(topRect.y);
      }
      if(rightRect && rightRect.snapRight) {
        if(isEditing) {
          movingElement.setWidth(movingElement.getWidth() + rightRect.right - movingRect.right);
        } else {
          movingElement.setX(rightRect.right - movingElement.getWidth());
        }
      }
      if(bottomRect && bottomRect.snapBottom) {
        if(isEditing) {
          movingElement.setHeight(movingElement.getHeight() + bottomRect.bottom - movingRect.bottom);
        } else {
          movingElement.setY(bottomRect.bottom - movingElement.getHeight());
        }
      }
    }

  },
});