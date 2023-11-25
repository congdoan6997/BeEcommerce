'use strict';
const ProductService = require('../services/product.service');
const { OkSuccessResponse, CreatedSuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

class ProductController {
  async createProduct(req, res, next) {
    new CreatedSuccessResponse({
      message: 'Create product successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_user: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
