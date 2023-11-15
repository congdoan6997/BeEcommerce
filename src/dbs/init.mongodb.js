'use strict';

const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/beecommerce';
const { countConnect, checkOverflowConnections } = require('../helpers/check.connect');

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log('Database connection successful');
        countConnect();
        checkOverflowConnections();
      })
      .catch((err) => {
        console.error('Database connection error');
        console.error(err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db = Database.getInstance();

module.exports = db;
