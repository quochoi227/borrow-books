import { StatusCodes } from 'http-status-codes'

export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCodes: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
  }
  res.status(responseError.statusCodes).json(responseError)
}
