var Editor = function (box, network) {
    this.box = box;
    this.network = network;
    this.interactions = network.getInteractions();
    this.init();
    this.copyFilter = function (item) {
        return item;
    }

    this.pasteFilter = function (item) {
        return item;
    }
    this.undoManager = this.box.getUndoManager();
    this.undoManager.setEnabled(true);
    this.isMove = false;
}

it.Utils.ext(Editor, Object, {
    init: function () {
        var self = this;
        var ruler = this.ruler = new Ruler(this.network);
        ruler.getView().setAttribute('class', 'room-ruler');
        ruler.setShowGuides(false);
        ruler.setShowRuler(true);
        $('.networkBox').append(ruler.getView());
        this.networkDimension = new NetworkDimension();
        this.networkDimension.bind(this.network);
        this.editScene = new EditScene(this.box, this.network);
        this.defaultInteraction = new twaver.vector.interaction.DefaultInteraction(this.network);
        this.editInteraction = new EditInteraction(this.network);
        // this.editInteraction = new twaver.vector.interaction.EditInteraction(this.network),

        this.interactions2d = [
            this.editScene,
            this.defaultInteraction,
            this.editInteraction,
        ]

        this.network.setInteractions(this.interactions2d);
        this.initLayer();


        // this.installNetwork2dFunctions(this.network);
        this.installNetwork2dListeners(this.network);
        this.keyDown();
        var view = this.network.getView();
        this.setDropTarget(view);
        this.propertySheet(view);
    },

    initLayer: function () {
        var layerBox = this.box.getLayerBox();
        for (var i = 100; i <= 900; i += 100) {
            var layer = new twaver.Layer(i);
            layerBox.add(layer);
        }
    },

    setDropTarget: function (view) {
        var self = this;
        it.DragAndDrop.setDropTarget(view, {
            dropEffect: 'copyMove',
            ondrop: function (e, data) {
                self.ondrop && self.ondrop(e, data);
            },
        });
    },

    ondrop: function (e, data) {
        var data = JSON.parse(data);
        // this.editScene.init(e, data);
    },

    keyDown: function () {
        var self = this;
        $(window).keydown(function (event) {
            if (it.Utils.isCtrlDown(event)) {
                //ctrl+c
                if (event.keyCode === 67) {
                    self.copySelection();
                }
                //ctrl+v
                if (event.keyCode === 86) {
                    self.pasteSelection();
                }
                //ctrl+z
                if (event.keyCode === 90) {
                    self.undoManager.canUndo(true);
                    self.undoManager.undo();
                }
                // ctrl + y
                if (event.keyCode === 89) {
                    self.undoManager.canRedo(true);
                    self.undoManager.redo();
                }

            } else if (it.Utils.isAltDown(event)) {
                self.isMove = !self.isMove;
                if (self.isMove) {
                    it.Utils.show("开启拖拽");
                    it.Utils.hide(1000);
                } else {
                    it.Utils.show("关闭拖拽");
                    it.Utils.hide(1000);
                }
                network.isMovable = function (element) {
                    if (element instanceof make.Default.WallShapeNode) {
                        return self.isMove;
                    }
                    return true;
                };
            } else {
                if (event.keyCode == 32) { //空格 旋转
                    var node = self.box.getSelectionModel().getLastData();
                    if (!node) {
                        return;
                    }
                    var angle = node.getAngle();
                    node.setAngle(angle + 90);
                } else if (event.keyCode == 27) {
                    self.network.setInteractions(self.interactions2d);
                } else if (event.keyCode == 46) {
                    var selectionModel = self.box.getSelectionModel();
                    var selectedList = selectionModel.getSelection().toArray();
                    selectedList.forEach(function (item) {
                        if (!item && !item.getClient) return;
                        // if (item.getClient('category') == 'equipment') return;
                        if (item.getClient('category') == 'certification' || item.getClient('category') == 'quality' || item.getClient('category') == 'charge') {
                            item.setClient('category', 'equipment');
                            item.setSize(80, 80);
                        } else {
                            self.box.remove(item);
                        }
                    })
                }
            }
        });
    },

    showInfo: function (str) {
        var div = $('<div></div>').appendTo($(document.body));
        div.html(str);
    },

    /**
     * 复制编辑器数据
     * @returns {Array}
     */
    copySelection: function (filter) {
        //console.warn('this method[{}] is not supported'.format('copySelection'))
        filter = filter || this.copyFilter;
        var selectData = this.getSelectedData();
        this._clearPasteOffset();
        if (filter) {
            selectData = filter(selectData);
        }
        this._copyAnchor = selectData;
        return this._copyAnchor;
    },

    getSelectedData: function () {
        var nodes = this.box.getSelectionModel().getSelection();
        if (!nodes || nodes.size() == 0) {
            return [];
        }
        var copyDatas = [];
        for (var i = 0; i < nodes.size(); i++) {
            var node = nodes.get(i);
            var jsonObject = this.box.getDataById(node.getId());
            if (jsonObject) {
                copyDatas.push(jsonObject);
            } else {
                console.warn('jsonObject is null, node.id=' + node.getId());
            }
        }
        return copyDatas;
    },

    /**
     * 清除粘帖的偏移
     * @private
     */
    _clearPasteOffset: function () {
        this.pasteOffsetX = 0;
        this.pasteOffsetY = 0;
    },

    /**
     * 粘帖编辑器数据
     * @param offset  {{x,y,z}} 位置的偏移量
     * @param filter
     * @returns  {Array|null}
     */
    pasteSelection: function (offset, filter) {
        //console.warn('this method[{}] is not supported'.format('pasteSelection'))

        filter = filter || this.pasteFilter;
        var self = this;
        if (!this._copyAnchor || this._copyAnchor.length == 0) {
            return null;
        }
        var sm = this.network.getSelectionModel();

        offset = offset || this._getPasteOffset();
        var items = [];
        this._copyAnchor.forEach(function (node) {
            var data = it.Utils.getNodeData(node);
            var item = it.Utils.clone(data);
            var id = self.createNewId(node.getClient('id'));
            item.setClient('id', id);
            item.setClient('name', id);
            item.setName(id);
            item.setStyle('label.color', 'rgba(0,0,0,0)');
            items.push(item);
            if (item._location) {
                var location = item._location;
                item._location.x += offset.x;
                item._location.y += offset.y;
            }
            if (item.x) {
                item.x += offset.x;
            }
            if (item.y) {
                item.y += offset.z;
            }
            if (filter) {
                item = filter(item);
            }
            if (item) {
                self.box.add(item);
            }
        })
        setTimeout(function () {
            sm.clearSelection();
            items.forEach(function (item) {
                var node = self.network.getElementBox().getDataById(item.objectId);
                sm.appendSelection(node);
            })

        }, 100)
    },

    createNewId: function (id, i) {
        var i = i || 0;
        var newId = id.split('-')[0] + "-" + i;
        if (!this.getNodeByClientId(newId)) {
            return newId;
        } else {
            i++;
            return this.createNewId(newId, i);
        }
    },

    getNodeByClientId: function (id) {
        var quickFinder = new twaver.QuickFinder(this.box, "id", "client");
        var list = quickFinder.find(id);

        var node = list.size() ? list.get(0) : null;

        return node;
    },

    /**
     * 取的粘帖的偏移
     * @returns {{x: (number|*), y: (number|*), z: (number|*)}}
     * @private
     */
    _getPasteOffset: function () {

        this.pasteOffsetX += 10;
        this.pasteOffsetY += 10;
        return {
            x: this.pasteOffsetX,
            y: this.pasteOffsetY
        }
    },

    installNetwork2dListeners: function (network) {
        var self = this;
        //network.getElementBox().getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this);

        network.addElementByInteraction = function (element) {
            twaver.vector.Network.prototype.addElementByInteraction.call(this, element);
            setTimeout(function () {
                self.network.setInteractions(self.interactions2d);
            }, 100);
        };

    },

    propertySheet: function (view) {
        view.addEventListener('click', function (e) {
            // console.log(network.getElementAt(e));
            if (network.getElementAt(e)) {
                it.propertySheet.show();
            } else {
                it.propertySheet.hide();
            }
        })
    }
})