'use strict';
const inventory = require('../inventory.model');
const { Types } = require('mongoose');
const insertInventory = async ({ product_id, userId, stock, location = 'unknown' }) => {
  return await inventory.create({
    inven_product: new Types.ObjectId(product_id),
    inven_user: new Types.ObjectId(userId),
    inven_stock: stock,
    inven_location: location,
  });
};

module.exports = {
  insertInventory,
};
