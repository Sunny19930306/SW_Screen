// const Sequelize = require('sequelize');
const Mongoose = require('mongoose');
const config = require('./config');

// const sequelize = new Sequelize(config.database, config.username, config.password, {
//   host: 'localhost',
//   dialect: 'mysql',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   timezone: config.timezone,
//   // 请参考 Querying - 查询 操作符 章节
//   operatorsAliases: false
// });
const uri = "mongodb://127.0.0.1:27017/" + config.database;

Mongoose.connect(uri, {
    server: { poolSize: 5 },
    user: config.username,
    pass: config.password
})

var db = Mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('连接成功');
});

// var Schema = Mongoose.Schema
// var schema = new Schema({
//     id: {
//         type: String,
//         default: null
//         // searchable: true,
//     },
//     pos: {
//         type: String,
//         default: null
//     },
//     modelId: {
//         type: String,
//         default: null
//         // searchable: true,
//     },
//     info: {
//         type: String,
//         default: null
//     },
// });
// Mongoose.model("data", schema);

module.exports = Mongoose;