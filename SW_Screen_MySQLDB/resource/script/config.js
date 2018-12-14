module.exports = {
    port: 8080,
    logLevel: "INFO",
    
    // 实时数据
    realtime: {
        robot: false,
        equipment: false,
    },
    
    // redis 服务器相关配置
    redis: {
        state: true,
        port: 6379,
        host: '127.0.0.1',
        simulationInterval: 20*1000,
        closeSimulate: false
    },
    
    debug: true,
    
    // mysql 数据库相关配置
    db_config: {
        // db_host: '10.8.195.3',      //主机名
        db_host: '127.0.0.1',      //主机名
        db_port: 3333,             //数据库端口号
        database: 'xianzhi',     //数据库名称
        username: 'root',       //用户名
        password: "root",     //密码
        timezone: '+08:00',     //时区
        logging: true,          //是否打印记录
    }
}
