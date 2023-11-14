// const pino = require('pino');
import { pino, destination } from "pino";

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

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
//     target: './transport_config.mjs',
//     options: {
//       destination: `./logs/app.log`,
//       append: true,
//     }
// });

// pino(transporter);

module.exports = pino(
  {
    customLevels: levels, 
    useOnlyCustomLevels: true,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true, 
        levelFirst: true,
        translateTime: 'yyyy-dd-mm, h:MM:ss TT',
      },
    },
  },
);
