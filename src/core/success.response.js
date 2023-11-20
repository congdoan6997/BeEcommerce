'use strict';

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');

class SuccessResponse {
  constructor(message, status, reasonStatusCode, metadata) {
    this.message = !message ? reasonStatusCode : message;
    this.status = status;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class CreatedSuccessResponse extends SuccessResponse {
  constructor(message, metadata) {
    super(message, StatusCodes.CREATED, ReasonPhrases.CREATED, metadata);
  }
}

class OkSuccessResponse extends SuccessResponse {
  constructor(message, metadata) {
    super(message, StatusCodes.OK, ReasonPhrases.OK, metadata);
  }
}

module.exports = {
  CreatedSuccessResponse,
  OkSuccessResponse,
};
