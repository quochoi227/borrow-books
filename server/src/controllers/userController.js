import { User } from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../configs/environment.js'
import ms from 'ms'
import { pickUser } from '../utils/formatters.js'

export const userController = {
  register: async (req, res, next) => {
    try {
      const existUser = await User.findOne({ dienThoai: req.body.dienThoai })
      if (existUser) {
        throw new ApiError(StatusCodes.CONFLICT, 'Người dùng đã tồn tại')
      }
      const userInfo = {
        ...req.body,
        matKhau: bcryptjs.hashSync(req.body.matKhau, 8)
      }
      const newUser = new User(userInfo)
      const createdUser = await newUser.save()
      res.status(201).json(pickUser(createdUser))
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const existUser = await User.findOne({
        dienThoai: req.body.dienThoai
      })
      if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tài khoản')
      if (!bcryptjs.compareSync(req.body.matKhau, existUser.matKhau)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Số điện thoại hoặc mật khẩu không đúng')
      }
      const userInfo = {
        _id: existUser._id,
        maDocGia: existUser.maDocGia,
        dienThoai: existUser.dienThoai
      }
      const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
      const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      })

      res.status(200).json({
        ...pickUser(existUser.toObject()),
        accessToken,
        refreshToken
      })
    } catch (error) {
      next(error)
    }
  },
  logOut: async (req, res, next) => {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(StatusCodes.OK).json({ loggedOut: true })
    } catch (error) {
      next(error)
    }
  }
}
