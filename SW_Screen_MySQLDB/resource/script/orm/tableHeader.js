const Sequelize = require('sequelize');
const Model = require('./Model');

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
    primaryKey: true,
    searchable: true,
    selectBox: ['robot', 'certification', 'quality', 'produce'],
  },
  datatype: {
    type: Sequelize.STRING,
    primaryKey: true,
    selectBox: ['String', 'Number', 'Boolean'],
  },
  unit: {
    type: Sequelize.STRING,
  },
  showInFirst: {
    type: Sequelize.BOOLEAN,
    required: true
  },
  showInSecond: {
    type: Sequelize.BOOLEAN,
    required: true
  },
  isChart: {
    type: Sequelize.BOOLEAN,
    required: true
  }
}

obj.option = {
  tableName: 'tableHeader',
}


module.exports = new Model(obj);