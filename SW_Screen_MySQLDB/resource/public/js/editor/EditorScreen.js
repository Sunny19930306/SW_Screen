
var box = new twaver.ElementBox();
var network = new twaver.vector.Network(box);
var toolbar = document.createElement('div');


network.setScrollBarVisible(false);
network.isMovable = function (n) {
    return false;
}

network.setDragToPan(true);
window.onload = function () {
    twaver.Styles.setStyle('select.style', 'none');
    var pane = new twaver.controls.BorderPane(network, toolbar);
    var view = pane.getView();
    view.style.left = '0px';
    view.style.top = '0px';
    view.style.right = '0px';
    view.style.bottom = '0px';
    document.body.appendChild(view);
    window.onresize = function () {
        pane.invalidate();
    };
    network.getSizeZoom = function (ui) {
        return this.getZoom();
    };
    loadData();
    initBox();
}
function loadData(){
    this.editorWall = editorWall;  //外墙数据
    this.editorPartitionWall = editorPartitionWall; //内部隔断数据
    this.editorDoor = editorDoor; //门数据
    this.editorPillar = editorPillar; //墙柱数据
    
}
function initBox() {
    //路径绘制方法(host,外部墙体)    path:路径    lineColor:边框线条颜色   lineWidth:边框宽度  location:定位位置是一个对象{x,y}  w,h 宽高 
    function wallPathImages(path){
        var pathnew = path.concat(path[0]);
        var wallPathNode = new twaver.Node();
        wallPathNode.setImage('wallpath');
        wallPathNode.setClient("path",pathnew);
        box.add(wallPathNode);
    }
    //绘制墙面
    var editorWall = this.editorWall[0];
    wallPathImages(editorWall.path);
    //路径(内部隔断)绘制方法    path:路径    lineColor:边框线条颜色   lineWidth:边框宽度  location:定位位置是一个对象{x,y}  w,h宽高  host跟随者对象
    function pathImages(path){ 
        var pathImage = new twaver.Node();
        pathImage.setImage('partitionWallPath');
        pathImage.setClient("path",path);
        box.add(pathImage);
    }
    //绘制隔断
    var editorPartitionWall = this.editorPartitionWall;
    var len = editorPartitionWall.length;
    for(var i=0;i<len;i++){
        pathImages(editorPartitionWall[i].path);
    }
     //门  location:定位位置是一个对象{x,y}  rotate:旋转角度
     function doorImages(location,rotate){
        var door = new twaver.Node();
        door.setImage('door');
        door.setClient('rotate',rotate);
        door.setLocation(location.x,location.y);
        box.add(door);
    }
    var editorDoor = this.editorDoor;
    var len = editorDoor.length;
    for(var i=0;i<len;i++){
        doorImages(editorDoor[i].location,editorDoor[i].rotate);
    }
    

    

    //柱子  location:定位位置是一个对象{x,y}
    function pillarImages(location){
        var pillar = new twaver.Node();
        pillar.setImage("pillar");
        pillar.setLocation(location.x,location.y);
        box.add(pillar);
    }

    var editorPillar = this.editorPillar;
    var len = editorPillar.length;
    for(var i=0;i<len;i++){
        pillarImages(editorPillar[i].location);
    }
}