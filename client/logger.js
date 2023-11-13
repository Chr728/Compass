// import { default as Pino } from 'pino';
// import Pino from 'pino';
const pino = require('pino');

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

// const fileTransport = pino.transport({
//   target: 'pino/file',
//   options: { destination: `${__dirname}/app.log`, append: true },
// });
// pino(transport);

// module.exports = Pino(
//   {
//     customLevels: levels, 
//     useOnlyCustomLevels: true,
//     level: 'info',
//     prettyPrint: {
//       colorize: true, 
//       levelFirst: true,
//       translateTime: 'yyyy-dd-mm, h:MM:ss TT',
//     },
//   },
//   fileTransport
// );

module.exports = pino(
  {
    customLevels: levels, 
    useOnlyCustomLevels: true,
    prettyPrint: {
      colorize: true, 
      levelFirst: true,
      translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    },
  }
);

// const logger = pino( {
//     customLevels: levels, 
//     useOnlyCustomLevels: true,
//     level: 'info',
//     prettyPrint: {
//       colorize: true, 
//       levelFirst: true,
//       translateTime: 'yyyy-dd-mm, h:MM:ss TT',
//     },
//   },
//   // fileTransport
// );

// export default logger;