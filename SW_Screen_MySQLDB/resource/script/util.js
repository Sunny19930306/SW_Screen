const config = require('./config');

/**
 * 用于打印调试语句
 *
 * @param {*} value
 * @param {String} flag
 */
exports.myLog = (value, flag) => {
    if (config.debug) {
        flag = flag ? flag : '';
        console.log('----------' + flag + ' start ----------');
        console.log(value);
        console.log('----------' + flag + ' end ----------');
    }
};


/**
 * 针对传入对象的所有属性，将为对象或数组的数据转换成字符串
 *
 * @param {Object} obj
 */
exports.conversionFormat = (obj) => {
    let i, one, newObj = {};
    for (i in obj) {
        one = obj[i];
        if (_.isObject(one) || _.isArray(one)) {
            newObj[i] = JSON.stringify(one);
        } else {
            newObj[i] = one;
        }
    }
    return newObj;
};


/**
 * 针对orm返回的数据整理格式，针对对象的每一个属性，将字符串转为数组和对象
 * @param {Object} result
 */
exports.processDataFormat = (result) => {
    let dataValue, key, oneSrc, line;
    dataValue = result.dataValues;
    for (key in dataValue) {
        oneSrc = dataValue[key];
        if (_.isString(oneSrc)) {
            try {
                line = JSON.parse(oneSrc);
                if (_.isObject(line) || _.isArray(line)) {
                    dataValue[key] = line;
                }
            } catch (error) {
                // console.log('error');
            }
        }
    }
    return result;
};