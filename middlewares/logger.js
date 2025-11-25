// What are logs?
// Logs contain information about events that occur on the server. In the simplest cases,
// it is a record of requests to the server and the server’s response to those requests.
// If anything unusual happens, we can write down the requests and the responses
// in order to investigate what went wrong. Logs will help you better understand
// what is happening on the server.

// Logging library, winston.
const winston = require("winston");
// express middleware to make it easier to work with winston
const expressWinston = require("express-winston");

// Log two types of information: requests to the server and the errors that occur on it.

// The winston.format function allows us to customize how our logs
// are formatted. In this case, we are using a built-in timestamp
// format, as well as Winston's generic printf method.
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, meta, timestamp }) => {
    `${timestamp} ${level}: ${meta.error?.stack || message}`;
  })
);

// The request logger, with two different "transports". One transport
// logs to a file, the other logs to the console.
const requestLogger = expressWinston.logger({
  transports: [
    // For console logs we use our relatively concise messageFormat
    new winston.transports.Console({ format: messageFormat }),
    new winston.transports.File({
      filename: "request.log",
      // For file logs we use the more verbose json format
      format: winston.format.json(),
    }),
  ],
});

// error logger
// When making a request to the server, the request.log file will be created,
// and some of the data from the request and response will be written to it in
// JSON format. If an error occurs on the server, the error.log file will be created.
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
