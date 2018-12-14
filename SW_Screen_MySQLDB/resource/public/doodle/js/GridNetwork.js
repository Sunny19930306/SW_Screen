/**
 *
 * @param elementBox
 * @private
 * @constructor
 */
var GridNetwork = function (elementBox) {

    var self = this;
    elementBox = elementBox || new twaver.ElementBox();
    GridNetwork.superClass.constructor.call(this, elementBox);
    this._positionMagneticEnabled = true;
    this._positionMagneticX = 1;
    this._positionMagneticY = 1;
    this.grids = [];
    this._showGrid = true;
    this.autoShowOrHide = true;

    this.grid1 = {
        width: 1000,
        height: 1000,
        visible: true,
        visibleFilter: function (zoom) {
            return zoom > 0.05
        },
        shapeColor: topoStyle.grid.zoom1Color,
        shapeSize: 1,
        shape: 'line' //line point
    }

    this.grid2 = {
        width: 100,
        height: 100,
        skipX: [],
        skipY: [],
        visible: true,
        visibleFilter: function (zoom) {
            return zoom > 0.099
        },
        shapeColor: topoStyle.grid.zoom2Color,
        shapeSize: 1,
        shape: 'line' //line point
    }
    this.grid3 = {
        width: 50,
        height: 50,
        skipX: [100,50],
        skipY: [100,50],
        visible: true,
        visibleFilter: function (zoom) {
            return zoom > 1
        },
        shapeColor: topoStyle.grid.zoom3Color,
        shapeSize: 1,
        shape: 'line' //line point
    }

    this.grid4 = {
        width: 5,
        height: 5,
        skipX: [100, 50,25],
        skipY: [100, 50,25],
        visible: true,
        visibleFilter: function (zoom) {
            return zoom > 2.0
        },
        shapeColor: topoStyle.grid.zoom4Color,
        shapeSize: 1,
        shape: 'point' //line point
    }

    this.initGridNetwork();
}

GridNetwork.prototype = {

    initGridNetwork: function () {

        var self = this;

        this.setKeyboardRemoveEnabled(false);

        this._box.addDataBoxChangeListener(function (e) {
            //console.log(e);
            var kind = e.kind;
            var node = e.data;
            if (kind == 'add') {
                self.nodePositionMagneticInit(node);
            }
        }, this);
        this.addInteractionListener(function (e) {
            //console.log(e);
            if (e.kind == 'liveMoveStart') { //开始移动

                var nodes = self._box.getSelectionModel().getSelection();
                self.beginMove(nodes);

            } else if (e.kind == 'liveMoveEnd') { //结束已动工

                var nodes = self._box.getSelectionModel().getSelection();
                self.endMove(nodes);
            }
            //  else if (e.kind == 'doubleClickBackground' && self.autoShowOrHide) {
            //     self.setShowGrid(!self.isShowGrid());
            // }
        }, this);

        this.addPropertyChangeListener(function (e) {
            if (e.property == "zoom") {
                this.invalidateGrids(this.grids);
            }
        }, this);

        this.grids.push(this.grid1);
        this.grids.push(this.grid2);
        this.grids.push(this.grid3);
        this.grids.push(this.grid4);
        this.invalidateGrids(this.grids);

    },

    beginMove: function (nodes) {
        var self = this;
        if (nodes && nodes.size() > 0) {
            nodes.forEach(function (node) {
                if (!(node instanceof twaver.Node)) {
                    return;
                }
                node.childNodeLiveMove = true;
                node.childNodeLastPoint = node.getLocation();
                node.childNodeLastPointOffset = {x: 0, y: 0};
            })
        }
    },

    endMove: function (nodes) {
        var self = this;
        if (nodes && nodes.size() > 0) {
            nodes.forEach(function (node) {
                delete node.childNodeLiveMove;
                delete node.childNodeLastPoint;
                delete node.childNodeLastPointOffset;
            })
        }
    },

    setGrids: function (grids) {
        this.grids = grids;
        this.invalidateGrids(this.grids);
    },
    getGrids: function () {
        return this.grids;
    },

    resizeCanvas: function (e) {
        this.repaint();
    },

    repaint: function () {
        this.invalidateElementUIs();
    },

    setShowGrid: function (showGrid) {
        this._showGrid = showGrid;
        this.repaint();
    },
    isShowGrid: function () {
        return this._showGrid;
    },

    setCursorPosition: function (e) {
        this.cursorPosition = e;
        this.repaint();
    },
    getCursorPosition: function () {
        return this.cursorPosition;
    },

    /**
     * 校验所有的grid
     * 1 根据zoom判断是否显示grid
     * 2 后面的grid显示要跳过已经绘制的轨迹
     * @param grids
     */
    invalidateGrids: function (grids) {

        var zoom = this.getZoom();
        var length = grids.length;
        for (var i = 0; i < length; i++) {
            var grid = grids[i];
            grid.skipX = [];
            grid.skipY = [];
            for (var j = 0; j < i; j++) {
                grid.skipX.push(grids[j].width)
                grid.skipY.push(grids[j].height)
            }
            if (grid.visibleFilter) {
                grid.visible = grid.visibleFilter(zoom);
            }
        }
    },

    /**
     * 判断当前坐标x是否需要跳过
     * @param grid
     * @param x
     * @returns {boolean}
     */
    isSkipX: function (grid, x) {

        for (var i = 0; i < grid.skipX.length; i++) {
            if (x % grid.skipX[i] == 0)
                return true;
        }
        return false;
    },

    /**
     * 绘制表格
     * 根据表格的width和height格式化grid.bound
     * 准备画布
     * x轴方向循环
     * y轴方向循环
     * @param ctx
     * @param grid
     * @param paintActionX x轴方向绘制
     * @param paintActionY y轴方向绘制
     */
    paintGridAction: function (ctx, grid, paintActionX, paintActionY) {

        var width = grid.width,
            height = grid.height,
            x = grid.bound.x,
            y = grid.bound.y,
            w = grid.bound.w,
            h = grid.bound.h,
            g = ctx,
            zoom = this.getZoom();
        var xOffset = x % (width),
            yOffset = y % (height),
            x = x - xOffset - width,
            y = y - yOffset - height,
            w = w + width * 2,
            h = h + height * 2,

            xFrom = x,
            xEnd = x + w,
            yFrom = y,
            yEnd = y + h;

        var rect = {
            xFrom: xFrom,
            xEnd: xEnd,
            yFrom: yFrom,
            yEnd: yEnd,
            width: w,
            height: h
        }
        var lineWidth = grid.shapeSize / zoom;

        g.lineWidth = lineWidth;
        g.strokeStyle = grid.shapeColor;
        //draw even lines
        var offset = lineWidth / 2;
        grid.offset = offset;
        for (var i = xFrom; i < xEnd; i += width) {

            if (!this.isSkipX(grid, i)) {
                paintActionX.call(this, grid, g, rect, i)
            }
        }

        for (var j = yFrom; j < yEnd; j += height) {
            if (!this.isSkipY(grid, j)) {
                paintActionY.call(this, grid, g, rect, j)
            }
        }

    },

    /**
     * 判断当前坐标y是否需要跳过
     * @param grid
     * @param y
     * @returns {boolean}
     */
    isSkipY: function (grid, y) {
        for (var i = 0; i < grid.skipY.length; i++) {
            if (y % grid.skipY[i] == 0)
                return true
        }
        return false;
    },

    /**
     * 绘制point类型表格
     * @param ctx
     * @param grid
     */
    paintPointGrid: function (ctx, grid) {
        this.paintGridAction(ctx, grid, this.paintPointGridX, this.paintPointGridY)
    },

    /**
     * 绘制point类型表格,x方向, i为当前x轴坐标
     * @param grid
     * @param g
     * @param rect 为grid.bound 按照grid的width和height格式化后的值
     * @param i
     */
    paintPointGridX: function (grid, g, rect, i) {

        for (var j = rect.yFrom; j < rect.yEnd; j += grid.height) {
            if (!this.isSkipY(grid, j)) {
                g.moveTo(i - grid.offset, j);
                g.lineTo(i + grid.offset, j);
                g.moveTo(i, j - grid.offset);
                g.lineTo(i, j + grid.offset);
            }
        }
    },

    /**
     * 绘制point类型表格,y方向, j为当前y轴坐标, point时,不需要绘制
     * @param grid
     * @param g
     * @param rect 为grid.bound 按照grid的width和height格式化后的值
     * @param i
     */
    paintPointGridY: function (grid, g, rect, j) {

        //for (var i = rect.xFrom; i < rect.xEnd; i += grid.width) {
        //    if (!this.isSkipX(grid, i)) {
        //        g.moveTo(i-grid.offst, j - grid.offset);
        //        //TODO draw ball
        //    }
        //}
    },

    /**
     * 绘制line类型表格
     * @param ctx
     * @param grid
     */
    paintLineGrid: function (ctx, grid) {

        this.paintGridAction(ctx, grid, this.paintLineGridX, this.paintLineGridY)
    },

    /**
     * 绘制point类型表格,x方向, i为当前x轴坐标
     * @param grid
     * @param g
     * @param rect 为grid.bound 按照grid的width和height格式化后的值
     * @param i
     */
    paintLineGridX: function (grid, g, rect, i) {
        g.moveTo(i - grid.offset, rect.yFrom);
        g.lineTo(i - grid.offset, rect.yEnd);
    },

    /**
     * 绘制point类型表格,y方向, j为当前y轴坐标,
     * @param grid
     * @param g
     * @param rect 为grid.bound 按照grid的width和height格式化后的值
     * @param i
     */
    paintLineGridY: function (grid, g, rect, j) {
        g.moveTo(rect.xFrom, j - grid.offset);
        g.lineTo(rect.xEnd, j - grid.offset);
    },

    /**
     * 绘制表格
     * 判断是point类型还是line类型
     * @param ctx
     * @param grid
     */
    paintGrid: function (ctx, grid) {

        if (!this._showGrid || !grid.visible) {
            return;
        }
        ctx.beginPath();
        if (grid.shape == 'point') {
            this.paintPointGrid(ctx, grid);
        } else {
            this.paintLineGrid(ctx, grid);
        }
        ctx.stroke();
    },

    /**
     *
     * 绘制所有的表格
     * @param ctx
     * @param dirtyRect
     */
    paintGrids: function (ctx, dirtyRect) {

        var length = this.grids.length;
        if (length > 0) {
            var bound = this.getViewRect();
            var zoom = this.getZoom();

            var x = bound.x / zoom,
                y = bound.y / zoom,
                w = bound.width / zoom,
                h = bound.height / zoom,
                g = ctx;

            g.save();
            //g.clearRect(x, y, w, h);

            var bound = {
                x: x, y: y, w: w, h: h
            }

            for (var i = 0; i < length; i++) {
                var grid = this.grids[i];
                grid.bound = bound;
                this.paintGrid(ctx, grid)
            }

            g.restore();
        }

    },
    paintBottom: function (ctx, dirtyRect) {
        this.paintGrids(ctx, dirtyRect);
    },

    /**
     * 取得x坐标的吸附最小单位
     * @returns {number|*}
     */
    getPositionMagneticX: function () {
        return this._positionMagneticX;
    },

    /**
     * 设置x坐标的吸附最小单位
     * @param magnetic
     */
    setPositionMagneticX: function (magnetic) {
        this._positionMagneticX = magnetic;
    },

    /**
     * 取得y坐标的吸附最小单位
     * @returns {number|*}
     */
    getPositionMagneticY: function () {
        return this._positionMagneticY;
    },

    /**
     * 设置x坐标的吸附最小单位
     * @param magnetic
     */
    setPositionMagneticY: function (magnetic) {
        this._positionMagneticY = magnetic;
    },

    /**
     * 是否启用吸附功能
     * 全局功能
     * 如果禁用,全局禁用
     * 如果启用,判断节点是否单独设置有禁用
     * @returns {boolean}
     */
    isPositionMagneticEnabled: function () {
        return !!this._positionMagneticEnabled;
    },

    setPositionMagneticEnabled: function (enable) {
        return this._positionMagneticEnabled = enable;
    },

    /**
     * 取得节点单独设置的x坐标吸附最小单位
     * 如果没有设定,默认取值network上的值
     * @param node
     * @returns {*}
     */
    getNodePositionMagneticX: function (node) {
        if (node) {
            var magnetic = node.getClient('magnetic.x');
            if (magnetic != undefined && magnetic != null) {
                return magnetic;
            }
        }
        return this.getPositionMagneticX();
    },

    /**
     * 取得节点单独设置的y坐标吸附最小单位
     * 如果没有设定,默认取值network上的值
     * @param node
     * @returns {*}
     */
    getNodePositionMagneticY: function (node) {
        if (node) {
            var magnetic = node.getClient('magnetic.y');
            if (magnetic != undefined && magnetic != null) {
                return magnetic;
            }
        }
        return this.getPositionMagneticY();
    },

    /**
     * 是否启用吸附功能
     * 如果节点禁用吸附, 禁止吸附
     * 如果节点启用,判断network是否启用
     * @param node
     * @returns {boolean}
     */
    isNodePositionMagneticDisabled: function (node) {
        if (node) {
            var magnetic = node.getClient('magnetic.disabled');
            if (!!magnetic) {
                return true;
            }
        }
        return !this.isPositionMagneticEnabled();
    },

    /**
     * 设置节点坐标, 会根据吸附参数格式化坐标
     * @param node
     * @param tx
     * @param ty
     */
    setNodePositionMagnetic: function (node, tx, ty) {

        if (!this.isNodePositionMagneticDisabled(node) && !this.isEditingElement(node)) {
            var mx = this.getNodePositionMagneticX(node);
            var my = this.getNodePositionMagneticY(node);
            var tx = Math.round(tx / mx) * mx;
            var ty = Math.round(ty / my) * my;
        }
        node.originalSetLocation(tx, ty);
    },

    /**
     * 初始化节点吸附功能
     * @param node
     */
    nodePositionMagneticInit: function (node) {

        if (!(node instanceof twaver.Node)) {
            //logger.warn('');
            return;
        }
        if (node.originalSetLocation) {
            return;
        }
        var self = this;

        var oldSetLocationFun = node.setLocation;
        node.originalSetLocation = oldSetLocationFun;
        node.setLocation = function (tx, ty) {
            if (arguments.length == 1) {
                var arg0 = tx;
                tx = arg0.x;
                ty = arg0.y;
            }
            self.setNodePositionMagnetic(node, tx, ty);
        }

        var oldTranslate = node.translate;
        node.translate = function (ox, oy) {
            if (node.childNodeLiveMove) {
                node.childNodeLastPointOffset.x += ox;
                node.childNodeLastPointOffset.y += oy;
                var tx = node.childNodeLastPoint.x + node.childNodeLastPointOffset.x;
                var ty = node.childNodeLastPoint.y + node.childNodeLastPointOffset.y;
                self.setNodePositionMagnetic(node, tx, ty);
            } else {
                oldTranslate.call(node, ox, oy);
            }
        }

        var x = node.getX();
        var y = node.getY();
        node.setLocation(x, y);
    }
}

it.Utils.ext(GridNetwork, twaver.vector.Network)
