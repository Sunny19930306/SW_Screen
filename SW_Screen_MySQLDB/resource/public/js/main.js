var xianzhi = {};
var it = it || {};




function disabledMouseWheel() {
	if (document.addEventListener) {
	  document.addEventListener('DOMMouseScroll', scrollFunc, false);
	}//W3C
	window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome
  }
  function scrollFunc(evt) {
	evt = evt || window.event;
	  if(evt.preventDefault) {
	  // Firefox
		evt.preventDefault();
		evt.stopPropagation();
	  } else {
		// IE
		evt.cancelBubble=true;
		evt.returnValue = false;
	}
	return false;
  }
  window.onload=disabledMouseWheel;


// document.onmousewheel = function (evt) {
// 	var e = evt || window.event;
// 	if(e.preventDefault && e.ctrlKey) e.preventDefault();
// 	if(e.ctrlKey) e.returnValue = false;
// };
// if (window.addEventListener) {
// 	window.addEventListener('DOMMouseScroll', document.onmousewheel, false);
// }



it.api = function (module, method, data, success, error) {
	var url = '/api/' + module + '/' + method;
	return $.ajax({
		type: 'post',
		contentType: 'application/json; charset=UTF-8',
		url: url,
		data: JSON.stringify(data),
		success: function (result) {
			if (result.error) {
				if (error) {
					error(result.error);
				} else {
					console.log(result, url);
				}
			} else {
				success && success(result, module);
			}
		},
		error: function (a, b, c) {
			if (error) {
				error(a, b, c);
			} else {
				console.log(a, b, c);
			}
		}
	});
};

var box = new twaver.ElementBox();
var network = new twaver.vector.Network(box);
document.body.style.background = it.firstStyle.background.color;
if(it.firstStyle.background.src){
	document.body.style.background = 'url(./images/background.png)';
}
window.network = network;


xianzhi.realTimeData = {};


it.event = new EventEmitter();

var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

network.adjustBounds({ x: w * 0.15, y: h * 0.1, width: w * 0.8, height: h * 0.7 });


network.setToolTipEnabled(false);  //不显示tooptip
var f = function (e) {
	if (e.kind === 'validateEnd') {
		if (network._box._dataList.size() !== 0) {
			network.removeViewListener(f);
		}
	}
};
network.addViewListener(f);


// network.setZoom(0.2);
network.setMinZoom(0.01);        
network.setMaxZoom(5);
network.setScrollBarVisible(false);
network.isMovable = function (n) {
	return false;
};

network.setDragToPan(true);

// 会产生一个选中样式
network.isSelected = function () {
	return false;
};

window.onresize = function (e) {

	var newW = document.documentElement.clientWidth;
	var newH = document.documentElement.clientHeight;
	network.adjustBounds({ x: newW * 0.15, y: newH * 0.1, width: newW * 0.8, height: newH * 0.7 });

	
	var quickFinder = new twaver.QuickFinder(this.box, "factory", "client");
	var list = quickFinder.find("true");
	quickFinder.dispose();
	var factory = list.get(0);
	 if (!factory) {
	 	network.zoomOverview();
	 	return
	 }
	
	var viewWidth = network.getViewRect().width - 50;	
	var zoomVal = viewWidth / factory.getWidth()	
	network.setZoom(zoomVal);	

	var w = document.documentElement.clientWidth;	
	var h = document.documentElement.clientHeight;	
	var viewX = factory.getCenterLocation().x*zoomVal - w * 0.8 /2;	
	var viewY = factory.getCenterLocation().y*zoomVal - h*0.7/2;	
		
	network.setViewRect(viewX, viewY,w * 0.8 ,h*0.7);	
};

function loadData() {
	var psArray = [];
	var models = ['data', 'modelUrl', 'link', 'tableHeader'];
	var allDatas = {};
	var dataComplete = 0;
	for (var i = 0; i < models.length; i++) {
		var model = models[i];
		it.api(model, 'findAll', {}, function (e, module) {
			allDatas[module] = e;
			dataComplete++;
			if (dataComplete === models.length) {
				it.allDatas = allDatas;
				start();
			}
		});

	}

	it.rootPanel = new RootPanel();
}

function start() {

	it.firstScreen = new $FirstScreen(box, network);

	it.agv = new $SecondScreen('agv');
	it.equipment = new $SecondScreen('equipment');
	it.quality = new $SecondScreen('quality');
	it.produce = new $SecondScreen('produce');

	it.firstScreen.show();	
	// it.agv.show();


	var loop = [];
	for( var key in theme) {
		if(key === 'firstScreen'){
			theme[key]["duration"] =  theme[key]["duration"] || 10;
		}
		loop.push({
			data: key,
			time: theme[key]["duration"]
		})
	}

	if(customer.carousel.enable){
		loopView(loop);	
	}

	socket = io('http://192.168.0.91:8080');

	setTimeout(function () {
		socket.on('realtime', function (data) {
			it.event.emit(data.type, data.data);
			// console.log('----emit-----');


			// socket.emit('my other event', { my: 'data' });
		});
		socket.emit('startRealtime', 'test');
		// console.log('----startRealtime-----');
	}, 2000);
}

function loopView (loop, index) {
	if(!index || index > 4) {
		index = 0;
	}
	var nextIndex = [  1 , 2 , 3 , 4 , 0];
	var time = loop[index]["time"];
	var now = loop[index]["data"];
	var next = loop[nextIndex[index]]["data"];
	if(!time){
		showView(next);
		loopView(loop, index + 1);
		return;
	}
	xianzhi.timeout = setTimeout(function() {
		clearTimeout(xianzhi.timeout);
		showView(next);
		loopView(loop, ++index);
	}, time * 1000)
		
}

function showView ( view ) {
	if(it.firstScreen.isShow){
		it.firstScreen.hide();
	}else if(it.agv.isShow) {
		it.agv.hide();
	}else if(it.equipment.isShow) {
		it.equipment.hide();
	}else if(it.quality.isShow) {
		it.quality.hide();
	}else if(it.produce.isShow) {
		it.produce.hide();
	}
	it[view].show();
}


loadData();
