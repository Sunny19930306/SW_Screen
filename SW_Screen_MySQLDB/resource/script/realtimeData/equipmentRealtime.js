const eventBus = require('../EventBus');
const ModelManager = require('../orm/ModelManager').ModelManager;

module.exports = function () {
    var equipment = [];

    function initData(callback) {
        ModelManager['data']['batchGet']({ modelId: 'equipment' }).then(function (result) {
            equipment = result;
            callback && callback();
        })
    };

    var getRandom = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    }

    function generateRandomPropertyValue(asset) {
        return {
            'status': getRandom(1, 4),

        };
    }

    function generateData() {
        var data = {};
        equipment && equipment.forEach(function (asset) {
            var assetId = asset.id
            var assetObj = generateRandomPropertyValue(asset);
            data[assetId] = assetObj;

        });
        return {
            module: "PEMS",
            type: "equipmentRealtime",
            data: data
        };
    }

    function runServer() {
        setInterval(function () {
            var data = generateData();
            eventBus.emit('monitorData', data);
        }, 1000 * 5);
    }

    this.runServer = runServer;
    this.initData = initData;

}