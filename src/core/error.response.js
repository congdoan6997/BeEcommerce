'use strict';
const StatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
  OK: 'OK',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCode.BAD_REQUEST);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCode.NOT_FOUND);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCode.UNAUTHORIZED);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCode.FORBIDDEN);
  }
}
class InternalServerError extends ErrorResponse {
  constructor(message) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR);
  }
}
module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
