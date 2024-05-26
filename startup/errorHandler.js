require("express-async-errors")
const winston = require("winston")
require('winston-mongodb');

const fileTransport = new winston.transports.File({ filename: 'logger.log' });

const mongoDBTransport = new winston.transports.MongoDB({
    db: 'mongodb://localhost:27017/vidleyapp', // Your MongoDB connection string
    collection: 'log', // Collection to store logs
    level: 'error', // Log level
    options: { useUnifiedTopology: true }, // MongoDB connection options
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [fileTransport, mongoDBTransport] ,
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' }),
        mongoDBTransport
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' }),
        mongoDBTransport
    ]
});



module.exports = logger