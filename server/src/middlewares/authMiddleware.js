import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/configs/environment'
import ApiError from '~/utils/ApiError'

// Middleware này sẽ đảm nhiệm việc quan trọng: Xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken
  // Nếu như clientAccessToken không tồn tại thì trả ra lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found) hahaha'))
    return
  }

  try {
    // Bước 1: Thực hiện giải mã token xem nó có hợp lệ hay là không
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    // console.log('accessTokenDecoded:', accessTokenDecoded);
    // Bước 2: Quan trọng, nếu như token là hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req.jwtDecoded, để sử dụng cho các tầng xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded
    // Bước 3: Cho phép cái request đi tiếp
    next()
  } catch (error) {
    // console.log('authMiddleware:', error);
    // Nếu như cái accessToken đó bị hết hạn (expired) thì mình cần trả về một cái mã lỗi 410 - GONE cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }
    // Nếu như cái accessToken nó không hợp lệ do bất kì điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã lỗi 401 cho phía FE gọi api sign_out luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}
