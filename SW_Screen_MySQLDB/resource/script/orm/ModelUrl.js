const Sequelize = require('sequelize');
const Model = require('./Model');

const obj = {};
obj.tableStructure = {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        searchable: true,
    },
    type: {
        type: Sequelize.STRING,
        searchable: true,
        primaryKey: true,
        selectBox: ['robot', 'certification', 'quality', 'charge', 'charged_state'],
    },
    url: {
        type: Sequelize.STRING,
        primaryKey: true,
    }
}

obj.option = {
    tableName: 'modelUrl',
}


module.exports = new Model(obj);