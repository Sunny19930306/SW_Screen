const Sequelize = require('sequelize');
const db_config = require('./config').db_config;

const sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, {
  host: db_config.db_host,
  port: db_config.db_port,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    }
  },
  timezone: db_config.timezone,
  // 请参考 Querying - 查询 操作符 章节
  operatorsAliases: false,
  logging: db_config.logging,
});


exports.sequelize = sequelize;