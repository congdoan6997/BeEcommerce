'use strict';
const ProductService = require('../services/product.service');
const { OkSuccessResponse, CreatedSuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

class ProductController {
  /**
   * Creates a new product.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {Promise} A Promise that resolves to the created product.
   */
  async createProduct(req, res, next) {
    new CreatedSuccessResponse({
      message: 'Create product successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_user: req.user.userId,
      }),
    }).send(res);
  }

  /**
   * Asynchronously finds all drafts products.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @param {Function} next - the next middleware function
   * @return {void}
   */
  async findAllDraftsProduct(req, res, next) {
    new OkSuccessResponse({
      message: 'Find all drafts product successfully',
      metadata: await ProductService.findAllDraftsProduct({
        ...req.query,
        product_user: req.user.userId,
      }),
    }).send(res);
  }
  async findAllPublishProduct(req, res, next) {
    new OkSuccessResponse({
      message: 'Find all published product successfully',
      metadata: await ProductService.findAllPublishProduct({
        ...req.query,
        product_user: req.user.userId,
      }),
    }).send(res);
  }

  async publishProductByUser(req, res, next) {
    new OkSuccessResponse({
      message: 'Published product successfully',
      metadata: await ProductService.publishProductByUser({
        product_user: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  }
  async unPublishProductByUser(req, res, next) {
    new OkSuccessResponse({
      message: 'UnPublished product successfully',
      metadata: await ProductService.unPublishProductByUser({
        product_user: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  }

  async findProductBySearch(req, res, next) {
    new OkSuccessResponse({
      message: 'Search done',
      metadata: await ProductService.findProductBySearch({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  }

  async findAllProducts(req, res, next) {
    new OkSuccessResponse({
      message: 'Find all products successfully',
      metadata: await ProductService.findAllProducts({
        ...req.query,
      }),
    }).send(res);
  }
  async findOneProduct(req, res, next) {
    new OkSuccessResponse({
      message: 'Find one product successfully',
      metadata: await ProductService.findOneProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
