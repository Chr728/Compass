const pino = require('pino');

module.exports = pino(
  {
    browser: {
      serialize: true,
      asObject: true,
    },
  },
);
  
  //code below is deprecated for the time being
  //pino destination and pino transport is not working

  // import { pino, destination } from "pino";
  // import pino, { default as Pino } from 'pino';
  
  // const logger = pino(
  //   {
  //     customLevels: levels, 
  //     useOnlyCustomLevels: true,
  //     prettyPrint: {
  //       colorize: true,
  //       levelFirst: true,
  //       translateTime: "yyyy-dd-mm, h:MM:ss TT",
  //     },
  //   },
  //   destination("./pino-logger.log")
  // );
  
  // export default logger;
  
  // const transporter = pino.transport({
  //     target: 'pino/file',
  //     options: {
  //       destination: `./logs/app.log`,
  //       append: true,
  //       mkdir: true,
  //     },
  // });
  
  // pino(transporter);