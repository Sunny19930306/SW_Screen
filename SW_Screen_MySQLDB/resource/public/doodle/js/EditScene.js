var EditScene = function (box, network) {
    this.box = box;
    this.network = network;
    this.doorImage();
    this.allEquipmentNodes = {};
    this.allPath = {};
    this.allPointNodes = {};
}

it.Utils.ext(EditScene, twaver.vector.interaction.BaseInteraction, {

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

    },

    handle_drop: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var text = e.dataTransfer.getData('Text');
        var data = JSON.parse(text);
        var type = data.type;
        var element = this.network.getElementAt(e);
        var nodeName = type + new Date().getTime();
        var point = this.network.getLogicalPoint(e);
        if (type === 'wall' || type === 'innerWall' || type === 'channel') {
            var type = this.wallInnerWall.bind(this.myCreateShapeNodeInteraction, data, nodeName);
            this._createShapeNodeInteractions(type);
        } else {
            var rotateY = null;
            if (type === 'door' || type === "window") {
                if (element && (element instanceof make.Default.WallShapeNode)) { //getLogicalPosition(e) 2015-01-04
                    element.setClient('focusIndex', -1);
                    var index = element.getPointIndex(point);
                    if (index >= 0) {
                        var points = element.getPoints(),
                            from = points.get(index),
                            to = points.get(index === points.size() - 1 ? 0 : index + 1);
                        rotateY = Math.atan((from.y - to.y) / (from.x - to.x)) / Math.PI * 180;
                    }
                }

            } else if (type !== 'pillar') {
                if (Object.keys(this.allEquipmentNodes).length > 0) {
                    if (!element || element instanceof twaver.ShapeNode || element instanceof twaver.Link) return;
                    if (!data.imageName) {
                        return;
                    }
                    if (element.getClient('category') === "point") {
                        return;
                    }
                    // element.setImage(data.type);
                    element.setClient('category', data.type);
                    element.setSize(80, 80);
                    return
                }
            }
            var node = this.loadModels(data, rotateY, point, nodeName);
            this.box.add(node);
        }
    },
    wallInnerWall: function (data, nodeName, points) {
        if (!data) return;
        var path = [];
        var id2d, layerId,firstPoint,lastPoint,adjustPoint;
        var points = points || data.path;
        var type = data.type;
        if(points instanceof twaver.List){
            points = points.toArray();
        }
        points.forEach(function (p,index) {
            if (!p) return;
            if(index ==0){
                firstPoint = p;
                path.push(firstPoint.x);
                path.push(firstPoint.y);
            }else if(index ==points.length-2){
                lastPoint = p;
                path.push(lastPoint.x);
                path.push(lastPoint.y);
            }else if(index == points.length-1){
                adjustPoint = p;
                if(adjustPoint.y == lastPoint.y && Math.abs(adjustPoint.x - firstPoint.x)<200){
                    adjustPoint.x = firstPoint.x
                }else  if(adjustPoint.x == lastPoint.x&& Math.abs(adjustPoint.y - firstPoint.y)<200){
                    adjustPoint.y = firstPoint.y
                }
                path.push(adjustPoint.x);
                path.push(adjustPoint.y);
            }
            else{
                path.push(p.x);
                path.push(p.y);
            }
         
        });

        if (type == 'wall' && path.length < 3 * 2) {
            return null;
        } else if (type == 'innerWall' && path.length < 2 * 2) {
            return null;
        }
        if (type == "wall") {
            id2d = 'twaver.idc.wall.top';
            layerId = 300;
        } else if (type == "innerWall" || type === 'channel') {
            id2d = 'twaver.idc.innerWall.top';
            layerId = 400;
        }
        var node = make.Default.load({
            id: id2d,
            data: path
        });
        if (type == 'channel') {
            node.setStyle("vector.outline.width", 50);
            node.setStyle("vector.outline.color", topoStyle.channel.color)
        }
        node.setLayerId(layerId);
        node.setClient('id', nodeName);
        node.setName(nodeName);
        node.setStyle('label.color', 'rgba(0,0,0,0)');
        node.setClient('category', data.type);
        node.setClient('location', points);
        node.setAngle(0);
        node.setClient('path', node.getPoints()._as);
        return node;
    },
    loadModels: function (data, rotate, point, nodeName) {
        if (!data) return
        var node = new twaver.Node();
        node.setImage(data.type);
        var rotate = rotate || 0;
        node.setClient('id', nodeName);
        node.setClient('name', nodeName);
        node.setName(nodeName);
        node.setStyle('label.color', 'rgba(0,0,0,0)');
        node.setClient('category', data.type);
        node.setClient('location', point);
        node.setAngle(rotate);
        node.setCenterLocation(point.x, point.y);
        node.setLayerId(500);
        return node
    },
    handle_mousedown: function (e) {
        var element = this.network.getElementAt(e);
        if (element && !it.Utils.isMoveModel(element)) {
            //判断是否是禁止移动的对象
            return;
        }
        // if (element instanceof make.Default.WallShapeNode) {
        //     this.network.isMovable = function (element) {
        //         return false;
        //     };
        // }
    },

    handle_mouseup: function (e) {
        // delete this.network.isMovable;

    },

    handle_mousemove: function (e) {

    },

    _createShapeNodeInteractions: function (type) {
        this.myCreateShapeNodeInteraction = new MyCreateShapeNodeInteraction(this.network, type);
        this.network.setInteractions([
            this.myCreateShapeNodeInteraction,
            new twaver.vector.interaction.DefaultInteraction(this.network)
        ]);
    },

    createAllNode: function (data) {
        var self = this;
        this.allEquipmentNodes = {};
        this.allPath = {};
        this.allPointNodes = {};
        var locations = data.location;
        var points = data.point;
        var paths = data.path;
        this.box.clear();
        if (locations) {
            this.createEquipmentNodes(locations);
        }
        if (points) {
            this.createPointNodes(points);
        }
        self.createPaths(paths);
        this.equipmentLink();
        setTimeout(function() {
            self.equipmentOffset();
            network.zoomOverview();
        }, 100)
    },

    createEquipmentNodes: function (locations) {
        for (var i in locations) {
            var item = locations[i];
            item["yPosition"] = -item["yPosition"];
            var node = this.createEquipmentNode(item);
            this.box.add(node);
        }
    },

    createEquipmentNode: function (location) {
        if (!location) return;
        var xPos, yPos, linkPoint, link, node, rotate;
        var id = location.id || location.name;
        var name = location.name;
        var type = location.type || 'equipment';
        rotate = Number(location.rotate) || 0;
        xPos = (location.xPosition || location.xPosition == 0) ? location.xPosition * 0.05 : location.pos.x;
        xPos = Number(xPos);
        yPos = (location.yPosition || location.yPosition == 0) ? location.yPosition * 0.05 : location.pos.y;
        yPos = Number(yPos);
        if (location.linkPoint) {
            linkPoint = location.linkPoint;
        } else {
            link = location.childNodes.link;
            linkPoint = link[Object.keys(link)[0]].point;
        }
        // node = new twaver.Follower();
        node = new twaver.Node();
        node.setClient('id', id);
        node.setClient('name', name);
        node.setName(id);
        node.setStyle('label.color',topoStyle.label.color);
		node.setStyle('label.position',topoStyle.label.position);	
		node.setStyle('label.xoffset',topoStyle.label.xOffset);
        node.setStyle('label.yoffset',topoStyle.label.yOffset);
        node.setStyle('label.font',topoStyle.label.font);
        if(!topoStyle.label.showLabel){
            node.setStyle('label.color',"rgba(0,0,0,0)");
        }
        node.setClient('editable', 'onlyRotate');
        node.setClient('category', type);
        node.setClient('deleteable', 'noDelete');
        node.setSize(80, 80);
        node.setClient('linkPoint', linkPoint);
        node.setCenterLocation(xPos, yPos);
        node.setImage("equipment");
        node.setAngle(rotate);
        node.setLayerId(900);
        this.allEquipmentNodes[id] = node;
        return node;
    },

    createPointNodes: function (points) {
        for (var i in points) {
            var item = points[i];
            item["yPosition"] = -item["yPosition"];
            var node = this.createPointNode(item);
            this.box.add(node);
        }
    },

    createPointNode: function (point) {
        if (!point) return;
        var xPos, yPos, node;
        var id = point.id || point.name;
        var name = point.name;
        xPos = Number(point.xPosition * 0.05 || point.pos.x);
        yPos = Number(point.yPosition * 0.05 || point.pos.y);
        node = new twaver.Node();
        node.setImage('point');
        node.setName(id);
        node.setStyle('label.color',topoStyle.label.color);
		node.setStyle('label.position',topoStyle.label.position);	
		node.setStyle('label.xoffset',topoStyle.label.xOffset);
        node.setStyle('label.yoffset',topoStyle.label.yOffset);
        node.setStyle('label.font',topoStyle.label.font);
        if(!topoStyle.label.showLabel){
            node.setStyle('label.color',"rgba(0,0,0,0)");
        }
        node.setClient('id', id);
        node.setClient('name', name);
        node.setClient('category', 'point');
        node.setClient('editable', 'noEdit');
        this.allPointNodes[id] = node;
        node.setLayerId(800);
        node.setCenterLocation(xPos, yPos);
        return node;
    },

    createPaths: function (paths) {
        var pathInfo = {};
        for (var i in paths) {
            var path = paths[i]
            var fromNodeId = path.sourcePoint;
            var toId = path.destinationPoint;
            if (pathInfo[fromNodeId + '-' + toId] || pathInfo[toId + '-' + fromNodeId]) {
                var data = pathInfo[fromNodeId + '-' + toId] || pathInfo[toId + '-' + fromNodeId];
                data.direction = 'bidirection';
            } else {
                pathInfo[fromNodeId + '-' + toId] = paths[i];
            }
        }
        for (var id in pathInfo) {
            var link = this.createPath(pathInfo[id]);
            this.box.add(link);
        }
    },

    createPath: function (path) {
        if (!path) return;
        var fromNode, fromNodeId, toNode, toNodeId, link;
        var id = path.id || path.name;
        var name = path.name;
        fromNodeId = path.fromId || path.sourcePoint;
        toNodeId = path.toId || path.destinationPoint;
        if (!fromNodeId || !toNodeId) return;
        fromNode = this.allPointNodes[fromNodeId];
        toNode = this.allPointNodes[toNodeId];
        if (!fromNode || !toNode) return;
        var link = new twaver.Link(name, fromNode, toNode);
        link.setClient('id', id);
        link.setClient('name', name);
        link.setStyle('backward', true);
        link.setClient('category', 'link');
        link.setStyle('arrow.to', true);
        link.setStyle('link.width', 2);
        link.setStyle('arrow.to.xoffset', 0);
        link.setStyle('link.color', topoStyle.linkAndArrow.linkColor );
        link.setStyle('arrow.to.color',topoStyle.linkAndArrow.arrowColor );
        link.setStyle('arrow.to.width', topoStyle.linkAndArrow.arrowWidth);
        link.setStyle('arrow.to.height', topoStyle.linkAndArrow.arrowHeight);
        link.setClient('editable', 'noEdit');
        link.setClient('length', path.length);
        link.setClient('sourcePoint', fromNodeId);
        link.setClient('destinationPoint', toNodeId);
        if (path.direction === 'bidirection') {
            link.setStyle('arrow.from', true);
            link.setStyle('arrow.from.xoffset', 0);
            link.setStyle('arrow.from.color', topoStyle.linkAndArrow.arrowColor);
            link.setStyle('arrow.from.width', topoStyle.linkAndArrow.arrowWidth);
            link.setStyle('arrow.from.height', topoStyle.linkAndArrow.arrowHeight);
            link.setClient('direction', 'bidirection');
        }
        link.setLayerId(700);
        // link.reverseBundleExpanded()
        this.allPath[fromNodeId + '-' + toNodeId] = link;
        return link;
    },

    equipmentLink: function () {
        var self = this;
        var equipments = this.allEquipmentNodes;
        for (var id in equipments) {
            var equipment = equipments[id];
            var linkPoint = equipment.getClient('linkPoint');
            var node = self.getNodeById(linkPoint);
            if(node&&equipment&&(node instanceof twaver.Node)&&(equipment instanceof twaver.Node)){
                var link = new twaver.Link(node, equipment);
                link.s('link.width', 1.5);
                link.s("link.color", topoStyle.dashed.color);
                link.s('link.pattern', [5, 5]);
                self.box.add(link);
                console.log('---')
                console.log(link)
                console.log(node)
                console.log(equipment)
                console.log('---')


            } else{
                console.log(node,equipment)
                console.log(linkPoint)
            }
        }
    },

    equipmentOffset: function () {
        var self = this;
        setTimeout(function () {
            var equipments = self.allEquipmentNodes;
            for (var id in equipments) {
                var equipment = equipments[id];
                var loc = equipment.getCenterLocation();
                self.direction = [{
                    x: loc.x - 120,
                    y: loc.y,
                    loc: {
                        x: loc.x - 80,
                        y: loc.y,
                    }
                }, {
                    x: loc.x + 120,
                    y: loc.y,
                    loc: {
                        x: loc.x + 80,
                        y: loc.y,
                    }
                }, {
                    x: loc.x,
                    y: loc.y - 120,
                    loc: {
                        x: loc.x,
                        y: loc.y - 80,
                    }
                }, {
                    x: loc.x,
                    y: loc.y + 120,
                    loc: {
                        x: loc.x,
                        y: loc.y + 80,
                    }
                }]

                var newLoc = self.isHaveOther(0);
                if (!newLoc) return;
                equipment.setCenterLocation(newLoc.x, newLoc.y)
            }
            this.direction = null;
            // this.network.zoomOverview();
        }, 0);
    },

    getNodeById: function (id) {
        var quickFinder = new twaver.QuickFinder(this.box, "id", "client");
        var list = quickFinder.find(id);

        var node = list.size() ? list.get(0) : null;

        return node;
    },


    isHaveOther: function (index) {
        if (index === this.direction.length) return null;
        var direction = this.direction[index];
        var nodes = this.network.getElementsAtRect({
            x: direction.x,
            y: direction.y,
            width: 80,
            height: 80
        }, true)
        if (nodes.size() < 1) {
            return direction.loc
        } else {
            return this.isHaveOther(++index);
        }
    },

    doorImage: function () {
        var self = this;
        twaver.Util.registerImage('equipment', {
            w: 50,
            h: 50,
            origin: {
                x: 0.5,
                y: 0.5
            },
            getAngle: function (node) {
                return -node.getAngle();
            },
            getName: function (node) {
                return node.getClient('name');
            },
            fill: topoStyle.equipment.backgroundColor,
            v: [{
                shape: "draw",
                draw: function (g, node, view) {
                    var state = node.getClient('category');
                    if (state === 'equipment') {
                        g.drawShape({
                            shape: 'rect',
                            rect: [-25, -25, 50, 50],
                            line: {
                                width: 5,
                                color: topoStyle.equipment.borderColor,
                            }
                        });
                        g.drawShape({
                            shape: 'text',
                            text: '<%= this.getName(data) %>',
                            rotate: '<%= this.getAngle(data) %>',
                            fill: topoStyle.equipment.textColor,
                            x: 0,
                            y: 0,
                        })
                    } else {
                        g.drawShape({
                            w: 50,
                            h: 50,
                            x: -25,
                            y: -25,
                            shape: "image",
                            name: state
                        })
                    }
                }
            }]
        })

        twaver.Util.registerImage('point', {
            w: 40,
            h: 40,
            origin: {
                x: 0.5,
                y: 0.5
            },
            fill: topoStyle.point.color,
            v: [{
                shape: 'circle',
                cx: 0,
                cy: 0,
                r: topoStyle.point.r,
                line: {
                    width: topoStyle.point.width,
                    color: topoStyle.point.outColor
                }
            }]
        })


        twaver.Util.registerImage('door', {
            w: 80,
            h: 80,
            scale: 1,
            origin: {
                x: 0,
                y: 0
            },
            getRotate: function (data) {
                return data.getClient("rotate");
            },
            rotate: '<%= this.getRotate(data) %>',
            rotateOrigin: {
                x: 40,
                y: 40
            },
            v: [{
                    shape: 'path',
                    data: [{
                            x: 0,
                            y: 0
                        },
                        {
                            x: 0,
                            y: 42
                        },
                        {
                            x: 80,
                            y: 42
                        },
                        {
                            x: 80,
                            y: 0
                        }
                    ],
                    lineColor: topoStyle.door.color,
                    lineWidth: 2.5,
                },
                {
                    shape: 'draw',
                    draw: function (g, node, view) {
                        g.sector(80, 41, 41, 180 * Math.PI / 180, 270 * Math.PI / 180);
                        g.fillStyle = topoStyle.door.color;
                        g.fill();
                    },
                },
                {
                    shape: 'draw',
                    draw: function (g, node, view) {
                        g.sector(0, 41, 41, -90 * Math.PI / 180, 0 * Math.PI / 180);
                        g.fillStyle = topoStyle.door.color;
                        g.fill();
                    },
                }
            ]
        })

        twaver.Util.registerImage('pillar', {
            w: 16,
            h: 16,
            origin: {
                x: 0,
                y: 0
            },
            v: [{
                shape: 'path',
                data: [{
                        x: 0,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 16
                    },
                    {
                        x: 16,
                        y: 16
                    },
                    {
                        x: 16,
                        y: 0
                    }
                ],
                fill: topoStyle.pillar.color
            }]
        });

        twaver.Util.registerImage("window", {
            w: 100,
            h: 36,
            clip: true,
            v: [{
                shape: "draw",
                draw: function (g, node, view) {
                    var windowDatas = node.getClient("windowDatas");

                    var offset = (windowDatas && windowDatas.offset) || 12 / 1.3;
                    var lineWidth = (windowDatas && windowDatas.lineWidth) || 90;
                    var lineHeight = (windowDatas && windowDatas.lineHeight) || 2;
                    var color1 = topoStyle.window.color;
                    var color2 = topoStyle.window.color;

                    g.beginPath();
                    g.lineWidth = lineHeight;
                    g.moveTo(-lineWidth / 2, offset / 2);
                    g.lineTo(lineWidth / 2, offset / 2);
                    g.moveTo(-lineWidth / 2, -offset / 2);
                    g.lineTo(lineWidth / 2, -offset / 2);
                    g.moveTo(-lineWidth / 2, -offset / 2 * 3);
                    g.lineTo(lineWidth / 2, -offset / 2 * 3);
                    g.moveTo(-lineWidth / 2, offset / 2 * 3);
                    g.lineTo(lineWidth / 2, offset / 2 * 3);
                    g.closePath();
                    g.strokeStyle = color1;
                    g.stroke();

                    g.beginPath();
                    g.lineWidth = lineHeight * 2;
                    g.moveTo(-lineWidth / 2, -offset / 2 * 3 - lineHeight / 2);
                    g.lineTo(-lineWidth / 2, offset / 2 * 3 + lineHeight / 2);
                    g.moveTo(lineWidth / 2, -offset / 2 * 3 - lineHeight / 2);
                    g.lineTo(lineWidth / 2, offset / 2 * 3 + lineHeight / 2);
                    g.closePath();
                    g.strokeStyle = color2;
                    g.stroke();

                }
            }]
        })

        models[1].contents.forEach(function (val) {
            self.registerImage({
                id: val.type,
                url: './models/images/' + val.imageName
            })
        })


    },

    registerImage: function (data) {
        var id = data.id;
        var url = data.url;
        var scaleX = data.scale && data.scale.x ? data.scale.x : 1;
        var scaleY = data.scale && data.scale.y ? data.scale.y : 1;
        var self = this;
        var img = new Image();
        img.src = url;
        img.onload = function () {
            img.onload = null;
            // var name = self.getImageName(url)
            twaver.Util.registerImage(id, img, img.width / scaleX, img.height / scaleY);
            self.network.invalidateElementUIs();
        };
    },

    getImageName: function (url) {
        var index = url.lastIndexOf('/');
        var name = url;
        if (index >= 0) {
            name = url.substring(index + 1);
        }
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    },
})