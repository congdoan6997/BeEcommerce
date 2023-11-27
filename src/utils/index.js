'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const getSelectData = ({ select = [] }) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};
const getUnSelectData = ({ unSelect = [] }) => {
  // console.log('select in util::', unSelect)
  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined || object[key] === null) {
      delete object[key];
    }
  });
  return object;
};

const updateNestedObjectParser = (object) => {
  // console.log('object::', object)
  const final = {};
  object = removeUndefinedObject(object);
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      const res = updateNestedObjectParser(object[key]);
      Object.keys(res).forEach((k) => {
        final[`${key}.${k}`] = res[k];
      });
    } else {
      final[key] = object[key];
    }
  });
  // console.log('final::', final)
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
