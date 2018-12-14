/**
 * accordion pane
 * 组件栏 - 使用了jquery-ui中的Accordion组件
 * @constructor
 */
var AccordionPane = function () {

    this.init();
    this._categories = [];
    this._visible = true;
    this._reset = true;
    this.defaultPath = './models/images/'
}
AccordionPane.prototype = {

    init: function () {
        this.paneBox = $('<div id="accordion-resizer" class="ui-widget-content"></div>');
        this.mainPane = $('<div id="accordion"></div>').appendTo(this.paneBox);
        this.mainPane.accordion({
            heightStyle: "fill"
        });
        this.paneBox.appendTo($('.accordionPaneBox'));
    },

    /**
     * set categories data
     * @param categories {Object[]}
     * @returns {Object[]}
     */
    setCategories: function (categories) {

        var old = this._categories;
        this._categories = categories;
        this.mainPane.accordion('destroy');
        this.mainPane.empty();
        var self = this;
        if (categories) {
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];

                var categoryTitleDom = $('.' + category.title);
                if (categoryTitleDom.length == 0) {
                    categoryTitleDom = $('<h3 class="' + category.title + '">' + category.title + '</h3>').appendTo(this.mainPane)
                    $('<ul class="mn-accordion"></ul>').appendTo(this.mainPane);
                    // $('<ul class="mn-accordion"></ul>').appendTo(this.mainPane);
                }
                var categoryContentDom = categoryTitleDom.next('.mn-accordion');
                category.contents.forEach(function (data) {
                var icon = self.defaultPath + data.imageName;
                var itemDiv = $('<li class="item-li"></li>').appendTo(categoryContentDom);
                var img = $('<img src=' + icon + ' title=' + (data.description || data.label) + '></img>')
                var label = $('<div class="item-label">' + (data.description || data.label) + '</div>');
                itemDiv.append(img);
                itemDiv.append(label);
                self.setImageDraggable(img[0], data);
                })
            }
        }
        this.mainPane.accordion({
            heightStyle: "fill"
        });
        this.mainPane.accordion("refresh");
        this.refresh();
        return old;
    },

    /**
     * get categories data
     * @returns {Object[]}
     */
    getCategories: function () {

        return this._categories;
    },

    /**
     * set accordion visible
     * @param v {boolean}
     */
    setVisible: function (v) {
        if (this._visible != v) {
            this._visible = v;
            if (this._visible) {

                this.paneBox.show();
            } else {
                this.paneBox.hide();
            }
        }
    },

    /**
     * get accordion visible
     * @returns {boolean}
     */
    isVisible: function () {
        return this._visible;
    },

    /**
     * refresh accordion widget
     */
    refresh: function () {
        var self = this;
        setTimeout(function () {
            self.mainPane.accordion("refresh");
        }, 100)
    },

    /**
     * accordion widget box
     * @returns {HTMLDIVElement}
     */
    getView: function () {
        return this.paneBox[0];
    },

    /**
     * set image draggable
     * @param image {Image}
     * @param item {Object}
     */
    setImageDraggable: function (image, item) {
        var self = this;
        it.DragAndDrop.setDragTarget(image, item, {
            effectAllowed: 'copyMove',

            dragImage: item.dragImage || item.icon,
            ondrag: function (e) {
                self.ondrag && self.ondrag(e, item);
                // console.log(item,'>>>>>>');
            },
        });
    },

    /**
     * drag handler
     * @param e {DragEvent}
     * @param item {Object}
     */
    ondrag: function (e, item) {
        // console.log(e);
        // console.log(item);
    },

}

it.Utils.ext(AccordionPane, Object);