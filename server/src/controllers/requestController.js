import { Request } from '../models/requestModel.js'
import { Book } from '../models/bookModel.js'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { maximumBorrowingDays } from '../utils/constants.js'

const REQUEST_STATUS = {
  PENDING: 'chờ duyệt',
  ACCEPTED: 'đang mượn',
  REJECTED: 'đã từ chối',
  RETURNED: 'đã trả',
  LATE: 'quá hạn',
  LOSTED: 'bị mất'
}

export const requestController = {
  addRequest: async (req, res, next) => {
    try {
      const { maDocGia } = req.body
      const allRequests = await Request.find({ maDocGia })
      const borrowing =  allRequests.filter((request) => {
        return request.trangThai === REQUEST_STATUS.PENDING || request.trangThai === REQUEST_STATUS.ACCEPTED
      })
      if (borrowing.length >= 3) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Không thể mượn thêm! Vui lòng kiểm tra lại số lượng yêu cầu mượn sách và số lượng sách đang mượn!')
      }
      const newRequest = new Request(req.body)
      const createdRequest = await newRequest.save()
      res.status(StatusCodes.CREATED).json(createdRequest)
    } catch (error) {
      next(error)
    }
  },
  getAllRequests: async (req, res, next) => {
    try {
      // const matchCondition = req.jwtDecoded.maDocGia ? {
      //   maDocGia: new mongoose.Types.ObjectId(req.jwtDecoded.maDocGia)
      // } : {}
      const requests = await Request.find().populate('docGia').populate('sach')
      res.status(StatusCodes.OK).json(requests)
    } catch (error) {
      next(error)
    }
  },
  getRequestsById: async (req, res, next) => {
    try {
      const userId = req.params.id
      const requests = await Request.find({
        maDocGia: new mongoose.Types.ObjectId(userId)
      }).populate('docGia').populate('sach')
      res.status(StatusCodes.OK).json(requests)
    } catch (error) {
      next(error)
    }
  },
  updateRequest: async (req, res, next) => {
    try {
      const { trangThai, maSach } = req.body
      const targetBook = await Book.findOne({
        maSach
      })
      let reqBody = {
        ...req.body
      }
      if (trangThai === REQUEST_STATUS.ACCEPTED) {
        if (targetBook) {
          await Book.findOneAndUpdate(
            { maSach }, {
              $set: {
                soQuyenConLai: targetBook.soQuyenConLai - 1,
                luotMuon: targetBook.luotMuon + 1
              }
            })
        }
        reqBody = {
          ...req.body,
          ngayMuon: Date.now(),
          hanTra: Date.now() + maximumBorrowingDays * 24 * 60 * 60 * 1000
        }
      } else if (trangThai === REQUEST_STATUS.RETURNED) {
        if (targetBook) {
          await Book.findOneAndUpdate(
            { maSach }, {
              $set: {
                soQuyenConLai: targetBook.soQuyenConLai + 1
              }
            }
          )
        }
        const request = await Request.findById(req.params.id)
        let newTrangThai
        const now = new Date(Date.now())
        if (now > request.hanTra) {
          newTrangThai = REQUEST_STATUS.LATE
        } else {
          newTrangThai = trangThai
        }
        reqBody = {
          ...req.body,
          trangThai: newTrangThai,
          ngayTra: Date.now()
        }
      }
      const updatedRequest = await Request.findByIdAndUpdate(req.params.id, { $set: reqBody }, { new: true })
      res.status(StatusCodes.OK).json(updatedRequest)
    } catch (error) {
      next(error)
    }
  },
  deleteRequest: async (req, res, next) => {
    try {
      const deletedRequest = await Request.findOneAndDelete({
        _id: req.params.id
      })
      res.status(StatusCodes.OK).json(deletedRequest)
    } catch (error) {
      next(error)
    }
  }
}
