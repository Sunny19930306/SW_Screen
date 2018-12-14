const config = require('./config');
const eventBus = require('./EventBus');
const RobotServer = require('./realtimeData/robotRealtime');
const EquipmentServer = require('./realtimeData/equipmentRealtime');
const RedisSimulator = require('./redis/simulator');
const sockets = {};
const myredis = require('./redis/myRedis');

module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log('----------connection--------------')
        socket.on('startRealtime', function () {
            sockets[socket.id] = socket;
            // eventBus.emit('defaultData', socket);
            let realtimeData = myredis.getAllDatas();
            // console.log(realtimeData);
            if (realtimeData) {
                for (let i in realtimeData) {
                    socket.emit('realtime', realtimeData[i])
                }
            }
            console.log('-------------2222 '+socket.id);
            // console.log('-------------');
            // console.log(sockets);
            console.log('sockets');
        })
        console.log('-------------0000 '+socket.id);

        socket.on('disconnect', function() {
            delete sockets[socket.id];
            console.log('-------------111 '+socket.id);
            // console.log('-------------');
            // console.log(sockets);
            console.log('delete sockets');
        });
        console.log('create:',socket.id)
    })

    sentData();

    setTimeout(function(){
        if(config.redis&&config.redis.state){
            RedisSimulator.start();
        }
    }, 1000)
}

function sentData() {
    eventBus.on('monitorData', data => {
        // realtimeData[data.type] = data;
        let socket;
        // console.log('-------------');
        // console.log(sockets);
        // console.log('sentData');
        for(let id in sockets) {
           socket = sockets[id];
           socket.emit('realtime', data)
        }
    })
}
 
if (config.realtime.robot) {
    var robotServer = new RobotServer();
    robotServer.initData(() => {
        robotServer.runServer();
    })
}

if (config.realtime.equipment) {
    var equipmentServer = new EquipmentServer();
    equipmentServer.initData(() => {
        equipmentServer.runServer();
    })
}
