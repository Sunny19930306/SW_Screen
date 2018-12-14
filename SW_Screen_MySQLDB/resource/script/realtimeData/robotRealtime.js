const eventBus = require('../EventBus');
const ModelManager = require('../orm/ModelManager').ModelManager;

module.exports = function () {
    var robot = [];

    function initData(callback) {
        ModelManager['data']['batchGet']({ modelId: 'agv' }).then(function (result) {
            robot = result;
            callback && callback();
        })
    };

    var getRandom = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    }

    function generateRandomPropertyValue(asset) {
        return {
            'power': getRandom(0, 100),
        };
    }

    function generateData() {
        var data = {};
        robot && robot.forEach(function (asset) {
            var assetId = asset.id
            var assetObj = generateRandomPropertyValue(asset);
            data[assetId] = assetObj;

        });
        return {
            module: "PEMS",
            type: "robotRealtime",
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

