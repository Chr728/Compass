const pino = require('pino');

//working config
module.exports = pino(
  {
    browser: {
      serialize: true,
      asObject: true,
    },
  },
);
  
// module.exports = pino ( 
//   {
//     transport: {
//       target: "pino-pretty",
//       options: {
//         translateTime: "yyyy-dd-mm, h:MM:ss TT",
//         ignore: "pid, hostname",
//         destination: "./pino-logger.log",
//       }
//     }
//   }
// )

// breaks numerous tests
// module.exports = pino ( 
//   {
//     transport: {
//       targets: [
//         {
//           target: "pino-pretty",
//           options: {
//             translateTime: "yyyy-dd-mm, h:MM:ss TT",
//             ignore: "pid, hostname",
//           }
//         },
//         {
//           target: "pino/file",
//           options: {
//             translateTime: "yyyy-dd-mm, h:MM:ss TT",
//             ignore: "pid, hostname",
//             destination: "./pino-logger.log",
//           }
//         }
//       ]
//     }
//   }
// )

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