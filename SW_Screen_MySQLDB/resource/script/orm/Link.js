const Sequelize = require('sequelize');
const Model = require('./Model');

const obj = {};
obj.tableStructure = {
    id: {
        type: Sequelize.STRING,
        searchable: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        searchable: true
    },
    fromId: {
        type: Sequelize.STRING,
        searchable: true,
        primaryKey: true
    },
    toId: {
        type: Sequelize.STRING,
        searchable: true,
        primaryKey: true
    },
    direction: {
        type: Sequelize.STRING,
    },
    length: {
        type: Sequelize.INTEGER,
    }
}

obj.option = {
    tableName: 'link',
}

module.exports = new Model(obj);