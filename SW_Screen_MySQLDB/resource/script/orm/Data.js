const Sequelize = require('sequelize');
const Model = require('./Model');
const util = require('../util');

const obj = {};
obj.tableStructure = {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        searchable: true,
    },
    name: {
        type: Sequelize.STRING,
        searchable: true,
    },
    type: {
        type: Sequelize.STRING,
        searchable: true,
        primaryKey: true
    },
    pos: {
        type: Sequelize.STRING,
    },
    rotate: {
        type: Sequelize.INTEGER,
    },
    path: {
        type: Sequelize.STRING,
    },
    linkPoint: {
        type: Sequelize.STRING,
    }
}

obj.option = {
    tableName: 'data',
}

module.exports = new Model(obj);