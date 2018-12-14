// http://www.runoob.com/html/html5-draganddrop.html 
// http://www.runoob.com/jsref/event-ondragend.html
// http://www.zhangxinxu.com/wordpress/2011/02/html5-drag-drop-%E6%8B%96%E6%8B%BD%E4%B8%8E%E6%8B%96%E6%94%BE%E7%AE%80%E4%BB%8B/
// http://www.w3cmm.com/html/drag.html
// http://man.ddvip.com/web/dhtml/properties/effectallowed.html
var DragAndDrop = it.DragAndDrop = {};
DragAndDrop.setDragImage = function(dragImage,event){
	if(dragImage){
		var temp = dragImage;
		if(typeof dragImage === 'string'){
	        dragImage = document.createElement('img');
	        dragImage.setAttribute('src',temp);
		}
		if(event.dataTransfer.setDragImage){
			event.dataTransfer.setDragImage(dragImage, dragImage.width/2, dragImage.height/2);
		}
	}
};

DragAndDrop.setDragTarget = function(view,data,params){
	   params = params || {};
	   view.setAttribute('dragable',true);
	   var dragData = data;
	   if(data != null && typeof dragData !== 'string'){
	   	  	dragData = JSON.stringify(dragData);
	   	}
	   	var dragImage = params.dragImage;
	   	view.ondragstart = function(event){
	   		if(dragData){
	   		   event.dataTransfer.setData("Text", dragData);	
	   		}
	   		if(params.effectAllowed){
	   			event.dataTransfer.effectAllowed = params.effectAllowed; 
	   		}
            DragAndDrop.setDragImage(dragImage,event);
	   		params.ondragstart && params.ondragstart(event);	        
	   	};
	   if(params.ondragend){
	      view.ondragend = params.ondragend;
	   }
	   if(params.ondrag){
	      view.ondrag = params.ondrag;
	   }
};

DragAndDrop.allowDrop = function(event){
    event.preventDefault();
};

DragAndDrop.setDropTarget = function(view,params){
     params = params || {};
     if(params.ondragenter){
    	view.ondragenter = params.ondragenter;
     }
     view.ondragover = function(event){
     	DragAndDrop.allowDrop(event);
     	if(params.dropEffect){
     		event.dataTransfer.dropEffect = params.dropEffect;
     	}
     	var data = event.dataTransfer.getData("Text");
    	params.ondragover && params.ondragover(event,data);
     };
     view.ondragleave = params.ondragleave;
     view.ondrop = function(event){
         event.preventDefault();
         var data = event.dataTransfer.getData("Text");
         params.ondrop && params.ondrop(event,data);
     };
};
