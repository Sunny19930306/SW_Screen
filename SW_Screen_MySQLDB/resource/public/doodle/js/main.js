$(function () {
    it.accordionPane = new AccordionPane();
    it.accordionPane.setCategories(models);


    document.body.style.background = it.doodleStyle.background.color;
    if(it.doodleStyle.background.src){
        document.body.style.background = it.doodleStyle.background.src
    }
    window.network = new GridNetwork();
    network.setToolTipEnabled(false);
    network.setMinZoom(0.01);        
    network.setMaxZoom(5);
    
    window.box = network.getElementBox();
    var propertySheet = new twaver.controls.PropertySheet(box);

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
      

    network.setDragToPan(true);
    $('.networkBox').append(network.getView());

    var f = function (e) {
        if (e.kind === 'validateEnd') {
            network.zoomOverview();
            if (network._box._dataList.size() !== 0) {
                network.removeViewListener(f);
            }
        }
    }
    network.addViewListener(f);
    // network.setDragToPan(false);
    // 修改编辑控制点的大小
    network.setResizePointSize(2);
    network.setResizePointOutlineWidth(10);
    network.setResizePointOutlineColor("rgba(255,222,222,0.01)")

    network.isMovable = function (element) {
        if (element && element.getClient('deleteable') == 'noDelete') {
            network.setKeyboardRemoveEnabled(false);
        } else {
            network.setKeyboardRemoveEnabled(true);
        }

        if (element instanceof make.Default.WallShapeNode) {
            network.setKeyboardRemoveEnabled(true);
            return false;
        }
        if (element && element.getClient('movable') == 'noMove') {
            return false;
        }
        return true;
    };

    network.isEditable = function (element) {
        if (element && element.getClient('editable') == 'noEdit') {
            return false;
        }
        return true;
    };

    // network.setMovableFunction(function (element) {
    //     return true;

    //     if (element && element.getClient('nodeType') == 'location') {
    //         return true;
    //     }
    // });

    // network.setEditableFunction(function(element){
    //     if (element && element.getClient('editable') == 'noEdit') {
    //         return false;
    //     } 
    //     return true;
    // })

    // var location = new twaver.Layer('location');
    // var point = new twaver.Layer('point');
    // var path = new twaver.Layer('path');
    // var layerBox = box.getLayerBox();
    // layerBox.add(path);
    // layerBox.add(point);
    // layerBox.add(location);

    it.editor = new Editor(box, network);
    it.propertySheet = new PropertySheet(box, network, propertySheet);

    window.onresize = function (e) {
        it.accordionPane && it.accordionPane.refresh();
        network.adjustBounds({
            x: 0,
            y: 0,
            width: $('.networkBox').width(e.target.innerWidth),
            height: $('.networkBox').height(e.target.innerHeight)
        });
    }

    it.rootPane = new RootPane();
    it.toolbarManager = new it.ToolbarManager();


    it.nodeDatas = [];
})