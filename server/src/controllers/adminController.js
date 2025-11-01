import Admin from '../models/adminModel.js'
import bcryptjs from 'bcryptjs'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../configs/environment.js'
import ms from 'ms'
import { pickAdmin } from '../utils/formatters.js'

const adminController = {
  register: async (req, res, next) => {
    try {
      const existAdmin = await Admin.findOne({ dienThoai: req.body.dienThoai })
      if (existAdmin) {
        throw new ApiError(StatusCodes.CONFLICT, 'Người dùng đã tồn tại')
      }
      const adminInfo = {
        ...req.body,
        matKhau: bcryptjs.hashSync(req.body.matKhau, 8)
      }
      const newAdmin = new Admin(adminInfo)
      const createdAdmin = await newAdmin.save()
      res.status(201).json(pickAdmin(createdAdmin))
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const existAdmin = await Admin.findOne({
        dienThoai: req.body.dienThoai
      })
      if (!existAdmin) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tài khoản')
      if (!bcryptjs.compareSync(req.body.matKhau, existAdmin.matKhau)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Số điện thoại hoặc mật khẩu không đúng')
      }
      const adminInfo = {
        _id: existAdmin._id,
        maNhanVien: existAdmin.maNhanVien,
        dienThoai: existAdmin.dienThoai,
        chucVu: existAdmin.chucVu
      }
      const accessToken = await JwtProvider.generateToken(adminInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
      const refreshToken = await JwtProvider.generateToken(adminInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)

      res.cookie(env.ACCESS_TOKEN_ADMIN_NAME, accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      })

      res.cookie(env.REFRESH_TOKEN_ADMIN_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      })

      res.status(200).json(pickAdmin(existAdmin))
    } catch (error) {
      next(error)
    }
  },
  logOut: async (req, res, next) => {
    try {
      res.clearCookie(env.ACCESS_TOKEN_ADMIN_NAME)
      res.clearCookie(env.REFRESH_TOKEN_ADMIN_NAME)
      res.status(StatusCodes.OK).json({ loggedOut: true })
    } catch (error) {
      next(error)
    }
  }
}

export default adminController
