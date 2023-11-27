'use strict';
const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic, furniture } = require('../models/product.model');
const {
  findAllDraftsProduct,
  findAllPublishProduct,
  publishProductByUser,
  unPublishProductByUser,
  findProductBySearch,
  findAllProducts,
  findOneProduct,
} = require('../models/repositories/product.repo');

class ProductFactory {
  static productRegister = {};

  static registerProduct(type, product) {
    this.productRegister[type] = product;
  }
  static async createProduct(type, payload) {
    //level xxx  Factory and Strategy Pattern
    if (!this.productRegister[type]) {
      throw new BadRequestError('Invalid product type');
    }
    const Product = this.productRegister[type];
    return new Product(payload).createProduct();

    //level 0
    // switch (type) {
    //   case 'Clothing':
    //     return await new Clothing(payload).createProduct();
    //   case 'Electronics':
    //     return await new Electronic(payload).createProduct();
    //   case 'Furniture':
    //     return await new Furniture(payload).createProduct();
    //   default:
    //     throw new BadRequestError('Invalid product type');
    // }
  }

  // find all drafts product for a user
  static async findAllDraftsProduct({ product_user, limit = 50, skip = 0 }) {
    const query = {
      product_user,
      isDaft: true,
    };
    return await findAllDraftsProduct({ query, limit, skip });
  }

  static async findAllPublishProduct({ product_user, limit = 50, skip = 0 }) {
    const query = {
      product_user,
      isPublished: true,
    };
    // console.log('query::', query)
    return await findAllPublishProduct({ query, limit, skip });
  }

  static async publishProductByUser({ product_user, product_id }) {
    return await publishProductByUser({ product_user, product_id });
  }
  static async unPublishProductByUser({ product_user, product_id }) {
    return await unPublishProductByUser({ product_user, product_id });
  }
  static async findProductBySearch({ keySearch }) {
    return await findProductBySearch({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
    select = ['product_name', 'product_price', 'product_thumb'],
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: select,
    });
  }
  static async findOneProduct({ product_id }) {
    console.log('product_id::', product_id);
    // console.log('unSelect::', unSelect)
    return await findOneProduct({ product_id, unSelect: ['__v'] });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_user,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_user = product_user;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_user: this.product_user,
    });
    if (!newClothing) {
      throw new BadRequestError('Create clothing failed');
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError('Create product failed');
    }
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_user: this.product_user,
    });
    if (!newElectronic) {
      throw new BadRequestError('Create electronic failed');
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('Create product failed');
    }
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_user: this.product_user,
    });
    if (!newFurniture) {
      throw new BadRequestError('Create furniture failed');
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError('Create product failed');
    }
    return newProduct;
  }
}

// register factory pattern
ProductFactory.registerProduct('Clothing', Clothing);
ProductFactory.registerProduct('Electronics', Electronic);
ProductFactory.registerProduct('Furniture', Furniture);

module.exports = ProductFactory;
