let redis = require("redis"),//召唤redis
    config = require("../config"),
    eventBus = require("../EventBus");
const ModelManager = require('../orm/ModelManager').ModelManager;

let redisConfig = config.redis;
if (!redisConfig) {
    console.log('没有参数');
    return;
}

if (redisConfig.closeSimulate) {
    console.log('不开启模拟数据');
    return;
}

let client = redis.createClient(redisConfig.port, redisConfig.host, {});

client.on("error", function (err) {
    console.log("Error " + err);
});

function Simulator() {
    this.init();
};

Simulator.prototype = {
    init: function () {
        this.robotNum = 5;
        this.clientNum = 4;
    },

    getRandom: function (min, max) {
        return ((max - min) * Math.random() + min).toFixed(0);
    },

    getRandomBoolean: function () {
        return Math.random() > 0.5;
    },

    getStatus: function () {
        var status = ["working", "pause", "trouble"];
        return status[this.getRandom(0, 2)];
    },

    getMode: function () {
        var status = ["Mode1", "Mode2", "Mode3", "Mode4"];
        return status[this.getRandom(0, 3)];
    },

    getRealPos: function (id) {

        if (id === "robot2") {
            return;
        }

        var pos = {
            "robot1": ['LM610', 'LM65', 'LM63'],
            "robot3": ['LM324', 'LM74', 'LM314'],
            "robot4": ['LM623', 'LM173', 'LM174'],
            "robot5": ['LM61', 'LM135', 'LM133'],
        }
        var key = this.getRandom(0, 2);

        var value = pos[id][key]
        return value;
    },

    getCurrentSite: function (id) {
        //待修改，通过已有的站点设置位置
        // var status = {
        //     "robot1":["Station11", "Station12", "Station13", "Station14"],
        //     "robot2":["Station21", "Station22", "Station23", "Station24"],
        //     "robot3":["Station31", "Station32", "Station33", "Station34"],
        //     "robot4":["Station41", "Station42", "Station43", "Station44"],
        //     "robot5":["Station51", "Station52", "Station53", "Station54"],
        // };

        // return status[id][this.getRandom(0, 3)];


        var status = {
            "robot1": ['TL108', 'LM5'],
            "robot2": ["WL109", "LM1"],
            "robot3": ['LM2', 'LM4'],
        }
        var key = this.getRandom(0, 1);

        var value = status[id][key]
        return value;

    },

    publishData: function (callback) {
        var ids = [{
            id: 'robot1',
            type: 'VehicleStatus'
        }, {
            id: 'robot2',
            type: 'VehicleStatus'
        }, {
            id: 'robot3',
            type: 'VehicleStatus'
        }, {
            id: 'Location TL108',
            type: 'DeviceStatus'
        }];
        ModelManager['data'].batchGet({
            type: 'certification'
        }).then(function (datas) {
            datas.forEach(function (data) {
                var id = data.id;
                ids.push({
                    id: id,
                    type: 'DeviceStatus'
                })
            })
            callback && callback(ids)
        })
    },

    getRobotData: function (id) {
        let robotData = {};
        robotData['operationMode'] = this.getMode();
        robotData['totalMileage'] = this.getRandom(100, 120);
        robotData['cumulativeRunningTime'] = this.getRandom(40, 60);
        robotData['runningTime'] = this.getRandom(10, 20);
        robotData['battery'] = this.getRandom(40, 80);
        robotData['actualSpeed'] = this.getRandom(3, 8);
        robotData['scram'] = this.getRandomBoolean();
        robotData['confidenceCoefficient'] = this.getRandom(50, 60);
        robotData['resist'] = this.getRandomBoolean();
        robotData['bandTypeBrake'] = this.getRandomBoolean();
        robotData['currentSite'] = this.getCurrentSite(id);
        robotData['robotModel'] = 'Seer-2017';
        robotData['mapVersion'] = 'v1.0.0';
        robotData['modelVersion'] = 'v2.0.0';
        robotData['currentlyLoadedMap'] = '20170908b';
        return robotData;
    },

    getEquipmentData: function () {
        let certificationData = {};
        certificationData['deviceState'] = this.getStatus();
        certificationData['accreditationSpeed'] = this.getRandom(10, 30);
        certificationData['closedBookNum'] = this.getRandom(100, 120);
        certificationData['playBookNum'] = this.getRandom(40, 60);
        certificationData['waitingAccreditationNum'] = this.getRandom(10, 20);
        certificationData['completedNum'] = this.getRandom(40, 80);
        certificationData['rejected'] = this.getRandom(0, 2);
        return certificationData;
    },
}

let simulator = new Simulator();

let intervalId;

function start() {
    if (intervalId) {
        end();
    }
    function doSimulator() {
        // console.log('redis开启订阅doSimulator');
        function createData(ids) {
            ids.forEach(function (obj) {
                var id = obj.id;
                var type = obj.type;
                var data = null;
                if (type === 'VehicleStatus') {
                    data = simulator.getRobotData(id);
                } else {
                    data = simulator.getEquipmentData();
                }
                client.publish("SW:" + type + ':' + id, JSON.stringify(data));
            })
        }
        simulator.publishData(createData);
        // client.set('data', JSON.stringify(obj));
        // eventBus.emit('getData', true);
        // client.publish('VehicleStatus:id', JSON.stringify(obj));
        // client.publish('VehicleStatus:12308', JSON.stringify(obj));
    }

    doSimulator();
    intervalId = setInterval(doSimulator, redisConfig.simulationInterval);
    // console.log('redis开启订阅');
}

function end() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}


exports.start = start;
exports.end = end;
exports.client = client;
