var $FirstScreen = function (box, network) {
	this.emptyBox = new twaver.ElementBox();
	this.box = box;
	this.network = network;
	this.isShow = false;
	xianzhi.pathAnimation = new PathAnimation();
	// icon的位置信息列表
	this._iconPosition = ['topleft.topleft', 'topright.topright', 'bottomleft.bottomleft', 'bottomright.bottomright'];
	this._iconPosition2 = ['top', 'top', 'top', 'top'];

	// robot可以显示的字段
	this._robotDisplayList = ["totalMileage", "actualSpeed", "runningTime", "cumulativeRunningTime", "confidenceCoefficient", "currentSite", "modelVersion", "robotModel", "mapVersion", "currentlyLoadedMap", "operationMode", "scram", "displayFieldName", "bandTypeBrake", "resist", "battery"];

	// 设备icon的偏移
	this._iconOffset = [{
		xoffset: [0],
		yoffset: [-10]
	},
	{
		xoffset: [-20, 20],
		yoffset: [-10, -10]
	},
	{
		xoffset: [-40, 0, 40],
		yoffset: [-10, -10, -10]
	},
	{
		xoffset: [-60, -20, 20, 60],
		yoffset: [-10, -10, -10, -10]
	},
	]
	this.init();
}

mono.extend($FirstScreen, Object, {
	init: function () {
		this.ignore = [];
		this.bottomPanel = new BottomPanel();
		this.firstRootPanel = new FirstRootPanel();
	
		wallPathImage(); //注册图片
		this.imageData = {};
		this.initLayer();
		this.loadAllData();
		this.registerImages();
		this.loadImage();
		this.updateIcon();

		this.networkView = $(network.getView());
		this.networkView.appendTo($('#main'));
		$(this.element).appendTo($('#main'));
		this.bottomPanel.show()
		this.firstRootPanel.show();
		$('#main').css('visibility' , 'hidden');
		$('#main').css('zIndex',1);


	},

	loadImage: function () {
		var element = this.element = document.createElement("div");
		element.style.position = "absolute";
		element.style.width = 300 + "px";
		element.style.height = 250 + "px";
		element.style.left = 100 + "px";
		element.style.top = 100 + "px";
		element.style.backgroundImage = "url(./images/index.png)";
		element.style.backgroundRepeat = "no-repeat";
		element.style.pointerEvents = "none";
		element.style.zIndex = 999;

	},
	initLayer: function () {
		var layerBox = this.box.getLayerBox();
		for (var i = 100; i <= 900; i += 100) {
			var layer = new twaver.Layer(i);
			layerBox.add(layer);
		}
	},

	initFactory: function () {
		var factory, self = this;
		var datas = this.datas;
		datas.forEach(function (data) {
			var type = data.type;
			data.pos = JSON.parse(data.pos);
			data.path = JSON.parse(data.path);

			if (type === "wall") {
				factory = self.wallPathImages(data);
				factory.setClient('factory', 'true');
			}
			if (type === "innerWall") {
				node = self.wallPathImages(data);
			}
			if (type === "pillar" || type === "door" || type === "window") {
				self.otherNodeImages(data);
			}
			if (type === 'channel') {
				self.createChannel(data);
			}

		});
		setTimeout(function(){
			self.setZoomView(factory);
		}, 0);
		return factory;
	},

	setZoomView: function (factory) {
		if (!factory) {
			network.zoomOverview();
			return
		}
		var viewWidth = network.getViewRect().width - 50;
		var zoomVal = viewWidth / factory.getWidth()
		network.setZoom(zoomVal);

		var w = document.documentElement.clientWidth;
		var h = document.documentElement.clientHeight;
		var viewX = factory.getCenterLocation().x * zoomVal - w * 0.8 / 2;
		var viewY = factory.getCenterLocation().y * zoomVal - h * 0.7 / 2;


		network.setViewRect(viewX, viewY, w * 0.8, h * 0.7);
	},


	createChannel: function (data) {
		var points = data.path;
		var fromPoint = points.shift();
		var fromNode = new twaver.Node();
		fromNode.setLocation(fromPoint.x.toFixed(2) - 0, fromPoint.y.toFixed(2) - 0);
		fromNode.setSize(0, 0);
		this.box.add(fromNode);
		var toPoint = points.pop();
		var toNode = new twaver.Node();
		toNode.setLocation(toPoint.x.toFixed(2) - 0, toPoint.y.toFixed(2) - 0);
		toNode.setSize(0, 0);
		this.box.add(toNode);
		var link = new twaver.ShapeLink({
			id: data.id,
			fromNode: fromNode,
			toNode: toNode
		});
		points.forEach(function (point) {
			point.x = point.x.toFixed(2) - 0;
			point.y = point.y.toFixed(2) - 0;
			link.addPoint(point);
		})
		points.unshift(fromPoint);
		points.push(toPoint);
		link.setClient('id', data.id);
		link.setClient('name', data.name);
		link.setStyle('link.width', 50);
		link.setStyle('link.color', topoStyle.channel.color);
		link.setClient('type', data.type);
		link.setLayerId(400);
		this.box.add(link);
	},


	createPath: function (path) {
		if (!path) return;
		var fromNode, fromNodeId, toNode, toNodeId, link;
		var id = path.id || path.name;
		var name = path.name;
		fromNodeId = path.fromId || path.sourcePoint;
		toNodeId = path.toId || path.destinationPoint;
		if (!fromNodeId || !toNodeId) return;
		fromNode = this.getNodeByClientId(fromNodeId);
		toNode = this.getNodeByClientId(toNodeId);
		if (!fromNode || !toNode) return;
		var link = new twaver.Link(name, fromNode, toNode);
		link.setClient('id', id);
		link.setClient('name', name);
		link.setStyle('backward', true);
		link.setClient('category', 'link');
		link.setStyle('arrow.to', true);
		link.setStyle('link.width', 2);
		link.setStyle('arrow.to.xoffset', 0);
		link.setStyle('link.color', topoStyle.linkAndArrow.linkColor);
		link.setStyle('arrow.to.color', topoStyle.linkAndArrow.arrowColor);
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
		this.box.add(link)
	},

	wallPathImages: function (data) {
		var points = data.path;
		var type = data.type;
		var path = [];
		var id2d, layerId;
		points.forEach(function (p) {
			path.push(p.x);
			path.push(p.y);
		});

		if (type === "wall") {
			id2d = 'twaver.idc.wall.top';
			layerId = 300;
		} else if (type === "innerWall") {
			id2d = 'twaver.idc.innerWall.top';
			layerId = 400;
		}

		var node = make.Default.load({
			id: id2d,
			data: path
		});
		if (type === " wall ") {
			node.setClient('factory', node);
		}
		node.setLayerId(layerId);
		this.box.add(node);
		return node;
	},
	otherNodeImages: function (data) {
		var type = data.type;
		var path = data.path || null;
		var locationX = data.pos.x || 0;
		var locationY = data.pos.y || 0;
		var rotate = data.rotate || 0;
		var node = new twaver.Node();
		if (type === "innerWall") {
			node.setImage('partitionWallPath');
			node.setLayerId(400);
		} else if (type === "door") {
			node.setImage('door');
			node.setCenterLocation(locationX, locationY);
			node.setAngle(rotate);
			node.setLayerId(500);
		} else if (type === "pillar") {
			node.setImage('pillar');
			node.setCenterLocation(locationX, locationY);
			node.setAngle(rotate);
			node.setLayerId(500);
		} else if (type === "window") {
			node.setImage('window');
			node.setCenterLocation(locationX, locationY);
			node.setAngle(rotate);
			node.setLayerId(500);
		}
		this.box.add(node);
	},

	createNodes: function (factory) {
		var self = this;
		this.initFactory();
		// this.initStateImg();

		this.datas.forEach(function (data) {
			var type = data.type;
			var imageName = self.imageData[type];
			if (type === "point") {
				self.createPointNode(data);
			}
			
			self.initNode(data, imageName);
		})

		this.linkInfo.forEach(function (data) {
			self.createPath(data);
		});

		this.equipmentLink();

		// this._linkCollections.forEach(function (node) {
		// 	self.addLink(node)
		// })


		// this.createPathAnimation(factory);

	},

	equipmentLink: function () {
		var self = this;
		var equipments = this._linkCollections;
		for (var id in equipments) {
			var equipment = equipments[id];
			var linkPoint = equipment.getClient('linkPoint');
			var node = self.getNodeByClientId(linkPoint);
			var link = new twaver.Link(node, equipment);
			link.s('link.width', 1.5);
			link.s("link.color", topoStyle.dashed.color);
			link.s('link.pattern', [5, 5]);
			link.setLayerId(800);
			self.box.add(link);
		}
	},

	createPointNode: function (data, hostNode) {
		if (!data) return;
		var id = data.id;
		var loc = data.pos;
		var type = data.type;
		var follower = new twaver.Node();
		follower.setClient('id', id);
		follower.setName(id);
		follower.setStyle('label.color',topoStyle.label.color);
		follower.setStyle('label.position',topoStyle.label.position);	
		follower.setStyle('label.xoffset',topoStyle.label.xOffset);
		follower.setStyle('label.yoffset',topoStyle.label.yOffset);
		follower.setStyle('label.font',topoStyle.label.font);
		if(!topoStyle.label.showLabel){
            follower.setStyle('label.color',"rgba(0,0,0,0)");
        }
		follower.setImage(type);
		follower.setLayerId(800);
		follower.setCenterLocation(loc.x, loc.y);
		this.box.add(follower);
	},

	// 创建机器人
	createRobot: function (datas) {
		var data = JSON.parse(datas.data);
		var id = datas.id;
		var pos = this.getPosById(data[customer.realData.currentStation]);
		if (!pos) return;
		var node = new twaver.Follower();
		node.setClient('id', id);
		node.setName(id);
		node.setStyle('label.color',topoStyle.label.color);
		node.setStyle('label.position',topoStyle.label.position);	
		node.setStyle('label.xoffset',topoStyle.label.xOffset);
		node.setStyle('label.yoffset',topoStyle.label.yOffset);
		node.setStyle('label.font',topoStyle.label.font);
		if(!topoStyle.label.showLabel){
            node.setStyle('label.color',"rgba(0,0,0,0)");
        }
		node.setImage('agv');
		node.setSize(80, 80);
		node.setCenterLocation(pos);
		node.setLayerId(900);
		node.s("icons.position", this._iconPosition);
		this.box.add(node);

		return node;
	},

	getPosById: function (id) {
		var datas = it.allDatas["data"];
		var path;
		for (var i in datas) {
			var item = datas[i];
			if (item.id === id) {
				path = item.pos;
			}
		}
		return path;
	},

	initNode: function (data, imageName) {
		if (!imageName) return;
		var id = data.id;
		var loc = data.pos;
		var follower = new twaver.Node();
		follower.setClient('id', id);
		follower.setName(id);
		follower.setStyle('label.color',topoStyle.label.color);
		follower.setStyle('label.position',topoStyle.label.position);
		follower.setStyle('label.xoffset',topoStyle.label.xOffset);
		follower.setStyle('label.yoffset',topoStyle.label.yOffset);
		follower.setStyle('label.font',topoStyle.label.font);		
		if(!topoStyle.label.showLabel){
            follower.setStyle('label.color',"rgba(0,0,0,0)");
        }
		follower.setSize(80, 80);
		follower.setImage(imageName);
		follower.setLayerId(900);
		follower.setCenterLocation(loc.x, loc.y);
		if (data.type === "certification" || data.type === 'quality' || data.type === 'charge') {
			follower.setClient('linkPoint', data.linkPoint)
			// follower.setClient('chargingId', data.info.charging)
			if (!this._linkCollections) {
				this._linkCollections = []
			}
			this._linkCollections.push(follower)
		}
		this.box.add(follower);
	},

	registerImages: function () {
		var self = this;
		this.count = 1;
		// this.models = this.models.concat([{
		// 	id: "zhengchang",
		// 	url: './images/zhengchang.png'
		// }, {
		// 	id: "zanting",
		// 	url: './images/zanting.png'
		// }, {
		// 	id: "guzhang",
		// 	url: './images/guzhang.png'
		// }, {
		// 	id: "jiqirenshishiweizhi",
		// 	url: './images/jiqirenshishiweizhi.png'
		// }])
		this.len = this.models.length;
		this.models.forEach(function (data) {
			self.registerImage(data)
		})
	},

	registerImageCompleted: function () {
		// var self = this;
		if (this.count === this.len) {
			this.createNodes(this.hostNode);
		} else {
			this.count++;
		}
	},

	registerImage: function (data) {
		var id = data.id;
		var url = data.url;
		var self = this;
		var img = new Image();
		img.src = url;
		img.onload = function () {
			img.onload = null;
			var name = self.getImageName(url);
			if(name){
				twaver.Util.registerImage(name, img, img.width, img.height);
				self.network.invalidateElementUIs();
				self.imageData[id] = name;
				self.registerImageCompleted();
			}
		};
		img.onerror = function(){
			self.registerImageCompleted();
		}
	
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

	loadAllData: function () {
		this.datas = it.allDatas['data'];
		this.models = it.allDatas['modelUrl'];
		this.linkInfo = it.allDatas['link'];
		this.tableHeader = it.allDatas['tableHeader'];
	},

	updateIcon: function () {
		var that = this;

		it.event.on('DeviceStatus',this.upDateEquipment, this);



		it.event.on('VehicleStatus',this.upDateAgv, this);

	},

	upDateEquipment: function (type , datas) {
		var that = this;
		var data = JSON.parse(datas.data);
		var id = datas.id;
		var nodeData = that.getData(id);

		it.equipment.upData(datas,'equipment');

		var certification = that.getNodeByClientId(id);
		if (!certification) return
		var referencesDatas = that.getReferencesData(that.tableHeader,nodeData.type);

		if(JSON.stringify(referencesDatas) == "{}") return;
		
		certification.setStyle("icons.names", [["device-0"],["device-1"],["device-2"],["device-3"]]);
		certification.setClient("icon_data", data);
		certification.setClient("referencesDatas", referencesDatas);
		var offset = that._iconOffset[referencesDatas.index.length - 1];
		certification.s("icons.yoffset", offset.yoffset);
		certification.s("icons.xoffset", offset.xoffset);
		certification.s("icons.position", that._iconPosition2); 

	},

	upDateAgv: function (type , datas ) {
		var that = this;

		it.agv.upData(datas,'agv');


		var data = JSON.parse(datas.data);
		var id = datas.id;
		var robot = that.getNodeByClientId(id);
		if (!robot) {
			robot = that.createRobot(datas);
		}

		var referencesDatas = that.getReferencesData(that.tableHeader, 'robot');
		if(JSON.stringify(referencesDatas) == "{}") return;
		xianzhi.pathAnimation.loadRealDatas(datas);
		if(!robot) return;
		
		robot.setStyle("icons.names", [["customIcon-0"],["customIcon-1"],["customIcon-2"],["customIcon-3"]]);
		
		robot.setClient("icon_data", data);
		robot.setClient("referencesDatas", referencesDatas);
		// robot.s("icons.yoffset", [83.5, 83.5, -83.5, -83.5]);
		robot.s("icons.yoffset", [43.5, 43.5, -43.5, -43.5]);
		// robot.s("icons.xoffset", [118, -122, 118, -122]);
		robot.s("icons.xoffset", [18, -22, 18, -22]);
	},

	

	getData: function(id) {
		var data;
		var allDatas = it.allDatas['data'];
		allDatas.forEach(function(val) {
			if(val.id === id) {
				data = val
			}
		})
		return data;
	},

	getNodeByClientId: function (id) {
		var quickFinder = new twaver.QuickFinder(this.box, "id", "client");
		var list = quickFinder.find(id);

		var node = list.size() ? list.get(0) : null;

		quickFinder.dispose();

		return node;
	},

	addLink: function (node) {
		//得到充电柱上正在充电的设备id
		var chargingId = node.getClient('chargingId')
		var findFunc = new twaver.QuickFinder(box, 'id', 'client');
		node2 = findFunc.find(chargingId)._as[0]
		findFunc.dispose();

		var link = new twaver.Link(node, node2);
		//设置样式
		link.s('link.width', 1.5);
		link.s("link.color", topoStyle.dashed.color);
		link.s('link.pattern', [1.5, 1.5])
		box.add(link);
	},

	addStateImg: function (followerName, value, imgName) {
		var followerName = new twaver.Follower({
			location: {
				x: value.x,
				y: value.y
			},
			image: imgName
		});
		followerName.setMovable(false);
		followerName.setHost(this.hostNode);
		followerName.setLayerId(600)
		box.add(followerName);
	},

	initStateImg: function () {
		var pos = this.getOrignalPoint();
		this.addStateImg("ZC", {
			x: pos.x + 98,
			y: pos.y + 130
		}, "zhengchang");
		this.addStateImg("ZT", {
			x: pos.x + 100,
			y: pos.y + 180
		}, "zanting");
		this.addStateImg("GZ", {
			x: pos.x + 300,
			y: pos.y + 78
		}, "guzhang");
		this.addStateImg("JQ", {
			x: pos.x + 94,
			y: pos.y + 80
		}, "jiqirenshishiweizhi");
	},

	// 获取外墙的pos
	getOrignalPoint: function () {
		var quickFinder = new twaver.QuickFinder(this.box, "id", "client");
		var wallList = quickFinder.find("twaver.idc.wall.top");
		if (wallList.size() === 0) {
			return;
		}
		var pos = wallList.get(0).getLocation();
		wallList.forEach(function (wall) {
			var tempPos = wall.getLocation();
			if (pos.x > tempPos.x) {
				pos.x = tempPos.x;
			}
			if (pos.y > tempPos.y) {
				pos.y = tempPos.y;
			}
		});

		quickFinder.dispose();

		return pos;
	},

	show: function () {
		// if (!this.box._dataList.size()) {
		// 	this.init();
		// } else {
		// 	this.network.setElementBox(this.box);
		// }
		this.networkView.css('zIndex',999);
		$('#main').css('visibility' , 'visible');

		
		
		$('#main').css('zIndex',20);
	
		this.isShow = true;
	},

	hide: function () {
		this.networkView.css('zIndex',1);
		$('#main').css('visibility' , 'hidden');

		$('#main').css('zIndex',1);
		this.isShow = false;
	},

	destory: function () {
		$(this.element).remove();
		this.network.setElementBox(this.emptyBox);
		this.bottomPanel.hide();
		this.firstRootPanel.hide();
	},

	getReferencesData: function (tableHeader, type) {
		var referencesData = {};
		var count = 0;

		for (var i = 0; i < tableHeader.length; i++) {
			var item = tableHeader[i];
			if (item && item["type"] === type && item["showInFirst"]) {
				if (!referencesData["index"]) {
					referencesData["index"] = [item.id];
				} else {
					referencesData["index"].push(item.id);
				}
				count++;
				referencesData[item.id] = item;
			}

			if (count >= 4) {
				break;
			}
		}

		return referencesData;
	}
})