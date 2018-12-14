var log4js = require('log4js');
var config = require('./config');
log4js.configure({
    appenders: [
        {type: 'console'}, //控制台输出
        {
            type: "dateFile", //文件输出
            filename: __dirname + '/../log/log',
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
        },
        {
            type: "dateFile", //文件输出
            filename: __dirname + '/../log/http-log',
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: 'http'
        },
        {
            type: "dateFile", //文件输出
            filename: __dirname + '/../upgradeLog/log',
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: 'upgrade'
        },
    ],
    levels: {
        "[all]": config.logLevel,
        //"upgrade": 'INFO',
        //"http": "info"
    }
});
var logger = log4js.getLogger('normal');
var loggerMap = {};
exports.logger = logger;
exports.log4js = log4js;



exports.connectionApp = function (app) {
    app.use(log4js.connectLogger(this.getLogger("http"), {level: log4js.levels.DEBUG}));
};

exports.info = function (msg,name) {
    logger.info(msg);
};

exports.warn = function (msg,name) {
    logger.warn(msg);
};
exports.error = function (msg,name) {
    logger.error(msg);
};
exports.fatal = function (msg,name) {
    logger.fatal(msg);
};

exports.getLogger = function (name) {
    return log4js.getLogger(name);
}