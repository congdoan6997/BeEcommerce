'use strict';

const User = require('../models/user.model');

const findUserByMail = async (
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  }
) => {
  return await User.findOne({ email }).select(select).lean();
};
const findUserById = async (userId, select = {}) => {
  return await User.findById(userId).select(select).lean();
};

module.exports = {
  findUserById,
  findUserByMail,
};
