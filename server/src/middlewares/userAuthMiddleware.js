import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../configs/environment.js'
import ApiError from '../utils/ApiError.js'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.userAccessToken
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found) hahaha'))
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    req.userDecoded = accessTokenDecoded
    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}
