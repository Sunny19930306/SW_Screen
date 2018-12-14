var Ruler = function (component) {
    Ruler.superClass.constructor.apply(this, arguments);
    this._view = this.createElement('div');
    this._view.style.position = 'absolute';
    this._view.style.left = '0px';
    this._view.style.right = '0px';
    this._view.style.top = '0px';
    this._view.style.bottom = '0px';
    this._topRuler = this.createElement('canvas');
    this._leftRuler = this.createElement('canvas');
    this._initRuler();
    this.setComponent(component);
    this.init();
    this.invalidate();
}
twaver.Util.ext(Ruler, twaver.controls.ViewBase, {
    _defaultGap: 10,
    _rulerWidth: 20,
    _lineColor: '#888',
    _lineIntervalLineColor: '#ccc',
    _mousePoint: null,
    _showGuides: true,
    onPropertyChanged: function (e) {
        this.invalidate();
    },
    init: function () {
        if (this._topRuler.visible) this._view.appendChild(this._topRuler);
        if (this._leftRuler.visible) this._view.appendChild(this._leftRuler);
        if (this.component.getView) {
            this._view.appendChild(this.component.getView());
        } else {
            this._view.appendChild(this.component);
        }
    },
    setComponent: function (component) {
        var oldValue = this.component;
        var self = this;
        this.component = component;
        this.firePropertyChange('component', oldValue, component);

        this.addViewPropertyChangeListener(component, this._handleViewPropertyChange);
        /*this.component.getView().addEventListener('mousemove',function(e){
         if(self._showGuides){
         var position = self.getAbsPostion(self.component._rootCanvas);
         self._mousePoint = {x:e.clientX-position.left, y: e.clientY-position.top};
         self.invalidate();
         }
         });*/
        $(this._view).resize(function () {
            var w = $(this._view).width();
            var h = $(this._view).height();
            self.component.adjustBounds({x: 0, y: 0, width: w, height: h});
            self.invalidate();
        });
    },
    getAbsPostion: function (div) {
        var t = 0, l = 0;
        while (div = div.offsetParent) {
            t += div.offsetTop;
            l += div.offsetLeft;
        }
        return {left: l, top: t}
    },
    _initRuler: function () {
        this._topRuler.visible = true;
        this._leftRuler.visible = true;
        this._topRuler.style.borderBottom = "1px solid " + this._lineColor;
        this._topRuler.style.borderLeft = "1px solid " + this._lineColor;
        this._leftRuler.style.borderRight = "1px solid " + this._lineColor;
        this._leftRuler.style.borderTop = "1px solid " + this._lineColor;
    },
    _drawRuler: function () {
        var viewRect = this.getComponentViewRect();
        var zoom = this.getComponentZoom();
        this.calculateGap(zoom);
        var gap = this.getGap();
        var x = viewRect.x;
        var y = viewRect.y;
        var w = viewRect.width;
        var h = viewRect.height;

        var xOffset = x % (gap * 5);
        var x = x - xOffset - gap * 5 - 1;
        var offsetX = Math.round((viewRect.x - xOffset - gap * 5) / zoom);
        var startX = x - viewRect.x;
        if (Math.abs(Math.round(x / (gap * 5)) % 2) === 1) {
            startX = startX - gap * 5;
            offsetX = offsetX - this._defaultGap * 5;
        }
        var endX = w + (gap * 10);

        if (viewRect && this._topRuler.visible) {
            var g = it.Utils.transformAndScaleCanvasContext(this._topRuler);
            this._drawHRuler(g, startX, offsetX, gap, endX, this._rulerWidth);
        }

        //draw vertical ruler
        var yOffset = y % (gap * 5);
        var y = y - yOffset - gap * 5 - 1;
        var offsetY = Math.round((viewRect.y - yOffset - gap * 5) / zoom);
        var startY = y - viewRect.y;
        if (Math.abs(Math.round(y / (gap * 5)) % 2) === 1) {
            startY = startY - gap * 5;
            offsetY = offsetY - this._defaultGap * 5;
        }
        var endY = h + (gap * 10);

        if (viewRect && this._leftRuler.visible) {
            var g = it.Utils.transformAndScaleCanvasContext(this._leftRuler);
            this._drawVRuler(g, startY, offsetY, gap, endY, this._rulerWidth);
        }
    },
    _drawHRuler: function (g, startX, offsetX, gap, w, h) {

        //draw h ruler border
        g.clearRect(startX, 0, w, h);

        //draw h ruler scale
        g.save();
        g.strokeStyle = this._lineIntervalLineColor;
        g.beginPath();
        g.lineWidth = 1;
        var count = 1;
        var startY = h;
        var endY = h - 6;
        var zoom = this.getComponentZoom();

        for (var i = startX + gap; i < startX + w; i += gap) {
            endY = h - 6;
            if (count % 5 == 0) {
                endY = h - 10;
            }
            if (count % 10 !== 0) {
                g.moveTo(i, startY);
                g.lineTo(i, endY);
            }
            count++;
        }
        g.closePath();
        g.stroke();

        count = 1;
        g.beginPath();
        g.strokeStyle = this._lineColor;
        for (var i = startX + gap; i < startX + w; i += gap) {
            if (count % 10 === 0) {
                endY = 1;
                g.moveTo(i, startY);
                g.lineTo(i, endY);
            }
            count++;
        }
        g.stroke();
        g.restore();

        //draw scale text
        g.save();
        g.textBaseline = "middle",
            g.font = "11px Arial";
        g.fillStyle = this._lineColor;
        for (var k = offsetX, j = startX; j < startX + w; j += gap * 10, k += this._defaultGap * 10) {
            g.fillText(k, j + 5, 8);
        }
        g.restore();

        //draw guides
        if (this._showGuides && this._mousePoint) {
            g.save();
            g.strokeStyle = '#f07819';
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(this._mousePoint.x, 0);
            g.lineTo(this._mousePoint.x, 20);
            g.stroke();
            g.restore();
        }
    },
    _drawVRuler: function (g, startY, offsetY, gap, h, w) {
        g.clearRect(0, startY, w, h);

        //draw hruler scale
        g.save();
        g.strokeStyle = this._lineIntervalLineColor;
        g.beginPath();
        g.lineWidth = 1;

        var count = 1;
        var startX = w;
        var endX = w - 6;
        var zoom = this.getComponentZoom();
        for (var i = startY + gap; i < startY + h; i += gap) {
            endX = w - 6;
            if (count % 5 == 0) {
                endX = w - 10;
            }
            if (count % 10 !== 0) {
                g.moveTo(startX, i);
                g.lineTo(endX, i);
            }
            count++;
        }
        g.closePath();
        g.stroke();
        g.restore();

        count = 1;
        g.beginPath();
        g.strokeStyle = this._lineColor;
        for (var i = startY + gap; i < startY + h; i += gap) {
            if (count % 10 === 0) {
                endX = 1;
                g.moveTo(startX, i);
                g.lineTo(endX, i);
            }
            count++;
        }
        g.stroke();
        g.restore();

        //draw scale text
        g.save();
        g.textBaseline = "middle",
            g.textAlign = "left";
        g.font = "11px Arial";
        g.fillStyle = this._lineColor;
        for (var k = offsetY, j = startY; j < startY + h; j += gap * 10, k += this._defaultGap * 10) {
            g.save();
            var size = _twaver.g.getTextSize(g.font, k);
            var rect = {x: 2, y: j - 8, width: size.width, height: size.height};
            g.translate(rect.x, rect.y);
            g.rotate(3 * Math.PI / 2);
            g.translate(-(rect.x ), -(rect.y ));
            g.fillText(k, 0, j - 2);
            g.restore();
        }
        g.restore();

        //draw guides
        if (this._showGuides && this._mousePoint) {
            g.save();
            g.strokeStyle = '#f07819';
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(0, this._mousePoint.y);
            g.lineTo(20, this._mousePoint.y);
            g.stroke();
            g.restore();
        }
    },
    getComponentZoom: function () {
        return this.component.getZoom() || 1;
    },
    getGap: function () {
        var zoom = this.getComponentZoom();
        return this._defaultGap * zoom;
    },
    calculateGap: function (zoom) {
        if (zoom < 0.17) {
            this._defaultGap = 50;
        }else if (zoom < 0.5) {
            this._defaultGap = 20;
        } else if (zoom < 0.9) {
            this._defaultGap = 10;
        } else if (zoom < 3.2) {
            this._defaultGap = 5;
        } else {

            this._defaultGap = 1;
        }
    },
    setShowGuides: function (showGuides) {
        var oldValue = this._showGuides;
        this._showGuides = showGuides;
        this._drawRuler();
    },
    isShowGuides: function () {
        return this._showGuides;
    },
    setShowRuler: function (showRuler) {
        var oldValue = this._topRuler.visible;
        this._topRuler.visible = showRuler;
        this._leftRuler.visible = showRuler;
        if (showRuler) {
            if (!this.hasChildNode(this._view, this._topRuler)) {
                this._view.appendChild(this._topRuler);
            }
            if (!this.hasChildNode(this._view, this._leftRuler)) {
                this._view.appendChild(this._leftRuler);
            }
        } else {
            if (this.hasChildNode(this._view, this._topRuler)) {
                this._view.removeChild(this._topRuler);
            }
            if (this.hasChildNode(this._view, this._leftRuler)) {
                this._view.removeChild(this._leftRuler);
            }
        }
        this.firePropertyChange("showRuler", oldValue, showRuler);
    },
    hasChildNode: function (parent, child) {
        var children = parent.childNodes;
        for (var i in children) {
            if (children[i] == child) {
                return true;
            }
        }
        return false;
    },
    getComponentViewRect: function () {
        return this.component.getViewRect ? this.component.getViewRect() : null;
    },
    addViewPropertyChangeListener: function (view, handler) {
        if (view && view.addPropertyChangeListener) {
            view.addPropertyChangeListener(handler, this);
        }
    },
    _handleViewPropertyChange: function (e) {
        var self = this;
        if (e.property == 'viewRect') {
            this._drawRuler();
        }
    },
    createElement: function (type) {
        return document.createElement(type);
    },
    validateImpl: function () {
        var w = this._view.offsetWidth, h = this._view.offsetHeight;
        // console.log(this._view.offsetWidth, this._view.offsetHeight);
        var th = 0, lw = 0, tx = 0, ly = 0, cx = 0, cy = 0, cw = w, ch = h;
        if (this._topRuler.visible) {
            th = this._rulerWidth;
            ly = this._rulerWidth;
            cy = this._rulerWidth;
        }
        if (this._leftRuler.visible) {
            lw = this._rulerWidth;
            tx = this._rulerWidth;
            cx = this._rulerWidth;
        }
        cw = w - lw, ch = h - th;

        if (this._topRuler.visible) {
            this._topRuler.width = cw;
            this._topRuler.height = th;
            // console.log(tx, 0, cw, th);
            _twaver.setViewBounds(this._topRuler, {x: tx, y: 0, width: cw, height: th});
            it.Utils.transformAndScaleCanvasContext(this._topRuler, true);
        }
        if (this._leftRuler.visible) {
            this._leftRuler.width = lw;
            this._leftRuler.height = ch;
            _twaver.setViewBounds(this._leftRuler, {x: 0, y: ly, width: lw, height: ch});
            it.Utils.transformAndScaleCanvasContext(this._leftRuler, true);
        }
        if (this.component) {
            _twaver.setViewBounds(this.component, {x: cx, y: cy, width: cw, height: ch});
            it.Utils.transformAndScaleCanvasContext(this.component._rootCanvas, true);
        }
        this._drawRuler();
    },
    getView: function () {
        return this._view;
    },
    left: function (left) {
        this._view.style.left = left + 'px';
        this.invalidate();
    }
});