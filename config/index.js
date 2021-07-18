const log4js = require('./logger')
const GLOBAL = require('./env')

module.exports = {
    LoggerMiddle : log4js.connectLogger(log4js.getLogger("api"), { level: 'auto' }),
    Logger : log4js.getLogger("api"),
    GLOBAL
}