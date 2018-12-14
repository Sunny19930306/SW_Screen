const redis = require("redis"), //召唤redis  
    eventBus = require('../EventBus'),
    config = require("../config"),
    client = require('./simulator').client;
var allDatas = {};

exports.startRedisServer = function () {
    let redisConfig = config.redis;
    if (!redisConfig) return;
    /* 
        连接redis数据库，createClient(port,host,options); 
        如果REDIS在本机，端口又是默认，直接写createClient()即可 
        redis.createClient() = redis.createClient(6379, '127.0.0.1', {}) 
    */
    let client = redis.createClient(redisConfig.port, redisConfig.host, {});

    //错误监听？ 
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    // 订阅
    client.psubscribe('SW:VehicleStatus:*', 'SW:DeviceStatus:*')

    // 监听消息
    console.log('------添加监听 on message--------------');
    client.on('pmessage', function (pattern, channel, msg) {
        var channelArr = channel.split(":");
        var type = channelArr[channelArr.length - 2];
        var id = channelArr[channelArr.length - 1];
        // if (msg) {
        //     client.get('data', function (err, val) {
        //         if (err) throw err;
        //         console.log(val);
                let data;
                if (type === 'VehicleStatus') {
                    data = {
                        module: "PEMS",
                        type: "VehicleStatus",
                        data: {
                            id: id,
                            data: msg
                        }
                    }
                    eventBus.emit('monitorData', data);
                    allDatas['robotRealtime'] = data;
                }
                if (type === 'DeviceStatus') {
                    data = {
                        module: "PEMS",
                        type: "DeviceStatus",
                        data: {
                            id: id,
                            data: msg
                        }
                    }
                    eventBus.emit('monitorData', data);
                    allDatas['certificationData'] = data;
                }
        //     })
        // }
    })

    // eventBus.on('getData', function (msg) {
    //     if (msg) {
    //         client.get('data', function (err, val) {
    //             if (err) throw err;
    //             // console.log(val);
    //             let data;
    //             let obj = JSON.parse(val);
    //             // console.log('---')
    //             if (obj['robot']) {
    //                 data = {
    //                     module: "PEMS",
    //                     type: "robotRealtime",
    //                     data: obj['robot']
    //                 }
    //                 eventBus.emit('monitorData', data);
    //                 allDatas['robotRealtime'] = data;
    //             }
    //             if (obj['client']) {
    //                 data = {
    //                     module: "PEMS",
    //                     type: "equipmentRealtime",
    //                     data: obj['client']
    //                 }
    //                 eventBus.emit('monitorData', data);
    //                 allDatas['equipmentRealtime'] = data;
    //             }
    //         })
    //     }
    // })

    // getAllData()
}

// function getAllData() {
//     eventBus.on('defaultData', function (socket) {
//                  for (let i in socket) {
//                     socket.emit('realtime', socket[i])
//                 }
//     })
// }

exports.getAllDatas = function(){
    return JSON.stringify(allDatas);
}