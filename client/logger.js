const pino = require('pino');

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

// const transport = pino.transport({
//   targets: [{
//     target: '#pino/file',
//     options: {
//       destination: `${__dirname}/app.log`
//     }
//   }]
// });

// const logger = pino(transport);

module.exports = pino(
  {
    customLevels: levels, 
    useOnlyCustomLevels: true,
    prettyPrint: {
      colorize: true, 
      levelFirst: true,
      translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    },
  },
);
