// 外部组件
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const http = require('http');


const baseRouter = require('./router/base');
const config = require('./config');
const realtime = require('./realtime');
const ModelManager = require('./orm/ModelManager').ModelManager;
const util = require('./util');

// 通过 redis 模拟数据
const myRedis = require('./redis/myRedis');


myRedis.startRedisServer();

// 创建服务器
const app = express();
const server = http.createServer(app);

app.use(cors());
// app.use(express.static(__dirname + '\\..\\public\\doodle'));
app.use(express.static(__dirname + '\\..\\public'));

app.use(bodyParser());  
//handle request entity too large
app.use(bodyParser({ limit: '1000mb', extended: true }));
app.use(bodyParser.json({ limit: '1000mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

server.listen(config.port, () => {
    util.myLog('Example app listening at http://localhost:' + config.port, 'app');
});

const io = require('socket.io')(server);

realtime(io);
baseRouter(io, app);