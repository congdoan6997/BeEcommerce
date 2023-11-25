'use strict';
const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic, furniture } = require('../models/product.model');

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
