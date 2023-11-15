const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const countConnect = () => {
  const count = mongoose.connections.length;
  console.log(`Mongoose has ${count} connections.`);
};

const checkOverflowConnections = () => {
  const memoryUsage = process.memoryUsage().rss;
  console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
  if (mongoose.connections.length >= os.cpus().length) {
    console.log('Overflow connections');
  }
};

module.exports = {
  countConnect,
  checkOverflowConnections,
};
