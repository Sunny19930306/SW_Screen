const sequelize = require('../mySequelize').sequelize;

const Promise = require('bluebird');

class Model {
    constructor(obj) {
        this.tableStructure = obj.tableStructure;
        this.initModel(obj);
    }

    // 初始化 Model 
    initModel(obj) {
        let tableName, tableStructure, option;

        tableStructure = obj.tableStructure;
        option = obj.option;
        tableName = option.tableName;

        this.orm = sequelize.define(tableName, tableStructure, option);

        sequelize.sync().then((result) => {
            // 同步了模型
            // console.log(result);
        })
    }

    // 单个查询
    get(data) {
        return this.orm.findOne({
            "where": {
                id: data.id
            }
        })
    }

    // 批量查询
    batchGet(obj) {
        return this.orm.findAll({
            "where": obj
        })
    }

    // 全部查询
    findAll() {
        return this.orm.findAll();
    }

    // 单个增加
    add(data) {
        console.log("\n\ntest---begin\n");
        console.log(data);
        console.log("\n\ntest---end\n");
        return this.orm.create(data);
    }

    // 单个移出 传null表示删除全部
    remove(data) {
        if (Object.keys(data).length > 0) {
            return this.orm.destroy({
                where: {
                    id: data.id
                }
            }).then((result) => {
                return new Promise((resolve, reject) => {
                    resolve('ok');
                })
            });
        } else {
            return this.orm.destroy({
                truncate: true,
                cascade: false
            }).then((result) => {
                return new Promise((resolve, reject) => {
                    resolve('ok');
                })
            })
        }

    }

    /**
     * 批量删除，传入要删除的数据的要求什么的。
     * obj 格式示例 obj = {
     *                  id: idsArray,
     *              }
     */
    batchRemove(obj) {
        return this.orm.destroy({
            where: obj
        }).then(() => {
            return new Promise(resolve => {
                resolve('ok');
            })
        });
    }

    // 单个更新
    update(obj) {
        return this.orm.update(obj, {
            where: {
                id: obj.id
            },
        }).then(() => {
            return new Promise(resolve => {
                resolve('ok');
            })
        });
    }

    addOrUpdate(data) {
        var self = this;
        return this.get({
            id: data.id
        }).then((result) => {
            if (!!result) {
                return self.update(data)
            } else {
                return self.add(data)
            }
        })
    }

    batchAddOrUpdate(data) {
        var self = this;
        return Promise.each(data, function (d) {
            return self.addOrUpdate(d);
        })
    }
}

module.exports = Model;