it.ImportXml = function (id) {
    this.$input = $('#' + id);
    this.init();
}

it.ImportXml.prototype = {

    init: function () {
        this.handleChange = this.handleChange.bind(this);

        this.$input.change(this.handleChange);
    },

    handleChange: function (e) {
        var self = this;
        var file = e.target.files[0];

        if (!file) return;
        if (file.type != 'text/xml') {
            console.error('需要传入xml格式文件');
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            self.doParse(reader.result);
        }
    },

    doParse: function (url) {

        var parseXml = new it.ParseXml(url);

        var allValue = {};

        var allParams = this.allParams;

        for (var i in allParams) {
            var params = allParams[i];
            var value = parseXml.getValueByParams(params);
            allValue[i] = value;
        }

        // console.log(allValue);
        this.allValue = allValue;
        it.editor.editScene.createAllNode(allValue);
        this.$input[0].value = '';
    },

    allParams: {
        'point': {
            tagName: 'point',
            attributes: ['name', 'xPosition', 'yPosition'],
            key: 'name',
        },
        'location': {
            tagName: 'location',
            key: 'name',
            attributes: ['name', 'xPosition', 'yPosition'],
            childNodes: [{
                tagName: 'link',
                key: 'point',
                attributes: ['point'],
            }]
        },
        // 'block': {
        //     tagName: 'block',
        //     key: 'name',
        //     attributes: ['name'],
        //     childNodes: [{
        //         tagName: 'member',
        //         key: 'name',
        //         attributes: ['name'],
        //     }]
        // },
        'path': {
            tagName: 'path',
            attributes: ['name', 'sourcePoint', 'destinationPoint', 'length'],
            key: 'name',
        },
    }

}

it.ParseXml = function (url) {
    this.createXml(url);
}

it.ParseXml.prototype = {

    createXml: function (url) {
        var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        var xmlDoc = xmlhttp.responseXML.documentElement;
        xmlDoc.async = false;

        this.xmlDoc = xmlDoc;
        // console.log(xmlDoc);
    },

    getElementsByTagName: function (tagName) {
        return this.xmlDoc.getElementsByTagName(tagName);
    },

    getValueByParams: function (params) {
        var tagName = params.tagName;
        if (!tagName) {
            console.log('没有tagName，参数错误');
            return;
        }
        var attributes = params.attributes || [];
        var key = params.key;
        var childNodes = params.childNodes;
        var names = params.names;

        if (!names) {
            names = this.getElementsByTagName(tagName);
        }
        var value = {};
        for (var i = 0; i < names.length; i++) {
            var obj = {}
            var name = names[i];
            var itKey;
            for (var j = 0; j < attributes.length; j++) {
                var attributeKey = attributes[j];
                var attributeValue = name.getAttribute(attributeKey);
                obj[attributeKey] = attributeValue;
                if (!itKey && key == attributeKey) {
                    itKey = attributeValue;
                }
            }
            if (!itKey) {
                itKey = i;
            }
            if (childNodes) {
                obj['childNodes'] = {};
                for (var k = 0; k < childNodes.length; k++) {
                    var childNode = childNodes[k];
                    childNode['names'] = name.children;
                    var childValue = this.getValueByParams(childNode);
                    obj['childNodes'][childNode.tagName] = childValue;
                }
            }
            value[itKey] = obj;
            itKey = null;
        }
        return value;
    },

}