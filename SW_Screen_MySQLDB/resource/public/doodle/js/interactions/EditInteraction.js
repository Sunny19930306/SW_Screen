var EditInteraction = function (network) {
    EditInteraction.superClass.constructor.call(this, network);
    this.network = network;
    this.isStart = false;
}

twaver.Util.ext(EditInteraction, twaver.vector.interaction.EditInteraction, {


    // handle_mousedown: function (e) {
    //     var element = this.network.getElementAt(e);
    //     if(element){
    //         if (element.getClient('editable') == 'noEdit') {
    //             return false;
    //         } else if(element.getClient('editable') == 'onlyRotate'){
    //             this.isStartRotate = true;
    //             this.node = element;
    //             // this.isStart = true;
    //             this.resizeDirection = false;
    //             this._handle_mousedown(e);
    //             this.network.setResizePointSize(0);
    //         } else{
    //             this.network.setResizePointSize(3);
    //             EditInteraction.superClass.handle_mousedown.apply(this, arguments);
    //         }
    //         if (element.getClient('type') === "door") {
    //             this.isStart = true
    //         }
    //     }
    // },

    // _handleResizing: function(e){
    //     var element = this.network.getElementAt(e);
    //         if(element){
    //             if (element.getClient('editable') == 'noEdit'||element.getClient('editable') == 'onlyRotate') {
    //                 return false;
    //             } else{
    //                 EditInteraction.superClass._handleResizing.apply(this, arguments);
    //             }
    //         }
    // },

    // 会出现8个小图标，先不管了
    _isResizingNode: function (e) {
        var element = this.network.getElementAt(e);
        if (element) {
            if (element.getClient('editable') == 'noEdit' || element.getClient('editable') == 'onlyRotate') {
                return false;
            } else {
                return EditInteraction.superClass._isResizingNode.apply(this, arguments);
            }
        }
    },

    // handle_mousemove: function(e) {
    //     EditInteraction.superClass.handle_mousemove.apply(this, arguments);
    //     var element = this.network.getElementAt(e);
    //     if (element && this.isStart) {

    //     }
    // },

    // handle_mouseup: function (e) {
    //     // if(this.isStartRotate){
    //     //     this.network.setResizePointSize(3);
    //     //     // var element = this.network.getElementAt(e);
    //     // }
    //     this.isStart = false;
    //     EditInteraction.superClass.handle_mouseup.apply(this, arguments);
    //     var element = this.network.getElementAt(e);
    //     if(element !== null && element.getClient("type") !== "wall"){
    //         if(element.getCenterLocation){
    //             element.setClient("location",element.getCenterLocation());
    //         }
    //         if(element.setAngle){
    //             element.setAngle(element._angle);
    //         }
    //         // console.log(element._angle)
    //     }
    // },

})