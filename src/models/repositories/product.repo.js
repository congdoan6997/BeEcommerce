'use strict';

const { product, clothing, electronic, furniture } = require('../product.model');
const { Types } = require('mongoose');
const { getSelectData, getUnSelectData } = require('../../utils/index');

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

/**
 * Publishes a product by the given user.
 *
 * @param {Object} product_user - The user who is publishing the product.
 * @param {string} product_id - The ID of the product to be published.
 * @return {Promise<number|null>} The number of modified documents or null if the product was not found.
 */
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

/**
 * Un publishes a product by a user.
 *
 * @param {object} product_user - The ID of the user who owns the product.
 * @param {string} product_id - The ID of the product to unpublish.
 * @return {number} The number of products modified (should be 1 if successful).
 */
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

/**
 * Finds products by search using a key search.
 *
 * @param {Object} options - The options for the search.
 * @param {string} options.keySearch - The key search to use.
 * @return {Promise<Array>} - A promise that resolves to an array of products matching the search.
 */
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
/**
 * Finds all products based on given parameters.
 *
 * @param {Object} options - An object containing the following parameters:
 *   @param {number} limit - The maximum number of products to return.
 *   @param {string} sort - The sorting criteria for the products.
 *   @param {number} page - The page number for pagination.
 *   @param {Object} filter - The filter criteria for the products.
 *   @param {string[]} select - The fields to select from the products.
 * @return {Promise<Object[]>} - A promise that resolves to an array of products.
 */
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const results = await product
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(getSelectData({ select }))
    .lean()
    .exec();
  return results;
};
/**
 * Finds a product with the specified ID and returns the result.
 *
 * @param {Object} options - An object containing the following properties:
 *   - product_id {string} - The ID of the product to find.
 *   - unSelect {string[]} - An array of fields to exclude from the query result.
 * @return {Promise<Object>} - A promise that resolves to the found product.
 */
const findOneProduct = async ({ product_id, unSelect }) => {
  // console.log('unSelect::', unSelect)
  // console.log('unSelectObject::', getUnSelectData({ unSelect}))
  const results = await product
    .findById(product_id)
    .select(getUnSelectData({ unSelect }))
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
  findAllProducts,
  findOneProduct,
};
