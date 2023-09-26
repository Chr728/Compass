const pino = require('pino');

module.exports = pinoLogger({
  //default log level set to info
  level: process.env.PINO_LOG_LEVEL || 'info',
});
