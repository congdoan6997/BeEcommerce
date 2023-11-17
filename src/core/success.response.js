'use strict';

const StatusCode = {
  CREATED: 201,
  OK: 200,
};

const ReasonStatusCode = {
  CREATED: 'CREATED',
  OK: 'OK',
};

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
    super(message, StatusCode.CREATED, ReasonStatusCode.CREATED, metadata);
  }
}

class OkSuccessResponse extends SuccessResponse {
  constructor(message, metadata) {
    super(message, StatusCode.OK, ReasonStatusCode.OK, metadata);
  }
}

module.exports = {
  CreatedSuccessResponse,
  OkSuccessResponse,
};
