/**
 * 使用get发送请求时，前端发参数使用?key=value的形式，后端接收参数时，直接使用req.query
 * 
 * 使用post发送请求时，有3种传递参数的形式，就是contentType的三种形式，
 * 针对每一种形式，要设定好前端contentType的值，将数据写成对应的形式，
 * 后端这边，body-parser也需要存在对相应的类型的解析，即在index.js中的三个解析，使用req.body获取参数
 * 注意，解析需要放在路由之前
 * 
 */

const ModelManager = require('../orm/ModelManager').ModelManager;
const Table = require('../orm/ModelManager').Table;
const _ = require('lodash');
const path = require('path');
const eventBus = require('../EventBus');


// 路由
module.exports = (io, app) => {
    app.get('/', (req, res) => {
        res.send('Hello Get!');
    });

    app.post('/api/test', (req, res) => {
        let obj = 'test';
        res.send(JSON.stringify(obj));
    });

    app.post('/api/getAllTables', (req, res) => {
        res.send(JSON.stringify({
            models: ModelManager,
            table: Table,
        }));
    });

    app.post('/api/:module/:method', (req, res) => {
        handlePostRequest(req, res);
    });

    app.post('/realtime/monitorData', (req, res) => {
        eventBus.on('monitorData', req.body);
        res.json({err: null, success: 'ok'});
    })
}

function handlePostRequest(req, res) {
    let module, method, postParams, model;

    module = req.params.module;
    method = req.params.method;
    postParams = req.body;
    model = ModelManager[module];

    model[method](postParams).then(result => {
        // 返回值为单个的时候，则为对象；返回值为多个的时候，result为数组
        if (_.isArray(result)) {
            let allDataArray = [];
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    allDataArray.push(result[i]);
                }
            }
            res.send(allDataArray);
        } else if (_.isObject(result)) {
            if (result) {
                res.send(result);
            } else {
                res.send('出错啦');
            }
        } else if (result == null) {
            res.send({});
        } else if (result == 'ok') {
            res.send('ok');
        }
    }, error => {
        res.send({'errorCode': error.code});
    })
}