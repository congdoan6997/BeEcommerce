const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init db
require('./dbs/init.mongodb');

// init routes

app.use('', require('./routes'));

// init error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    error: {
      status: 'error',
      code: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;
