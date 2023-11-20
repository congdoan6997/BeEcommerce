'use strict';
const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');

class ErrorResponse extends Error {
  constructor(message, status, reasonStatusCode) {
    super(!message ? reasonStatusCode : message);
    this.status = status;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
}
class InternalServerError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}
module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
