'use strict';

const { product, clothing, electronic, furniture } = require('../product.model');
const { Types } = require('mongoose');

/**
 * Retrieves all draft products based on the provided query, limit, and skip parameters.
 *
 * @param {Object} query - The query object used to filter the draft products.
 * @param {number} limit - The maximum number of draft products to retrieve.
 * @param {number} skip - The number of draft products to skip before retrieving.
 * @return {Promise<Array>} A promise that resolves to an array of draft products.
 */
const findAllDraftsProduct = async ({ query, limit, skip }) => {
  return await findAllOneFieldProduct({ query, limit, skip });
};

const findAllPublishProduct = async ({ query, limit, skip }) => {
  return await findAllOneFieldProduct({ query, limit, skip });
};

const findAllOneFieldProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    // .populate('product_user', 'name email -_id')
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

const publishProductByUser = async ({ product_user, product_id }) => {
  const foundProduct = await product.findById({
    _id: new Types.ObjectId(product_id),
    product_user: new Types.ObjectId(product_user),
  });

  if (!foundProduct) return null;

  foundProduct.isPublished = true;
  foundProduct.isDaft = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unPublishProductByUser = async ({ product_user, product_id }) => {
  const foundProduct = await product.findById({
    _id: new Types.ObjectId(product_id),
    product_user: new Types.ObjectId(product_user),
  });

  if (!foundProduct) return null;

  foundProduct.isPublished = false;
  foundProduct.isDaft = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const findProductBySearch = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        $text: {
          $search: regexSearch,
        },
        isPublished: true,
      },
      {
        score: {
          $meta: 'textScore',
        },
      }
    )
    .sort({
      score: {
        $meta: 'textScore',
      },
    })
    .lean()
    .exec();

  return results;
};

module.exports = {
  findAllDraftsProduct,
  findAllPublishProduct,
  publishProductByUser,
  unPublishProductByUser,
  findProductBySearch,
};
