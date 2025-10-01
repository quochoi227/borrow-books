import { Request } from '~/models/requestModel'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGRjMDliOTJhNzNjYTZlNDVjODZhMDMiLCJtYURvY0dpYSI6IjY4ZGMwOWI5MmE3M2NhNmU0NWM4NmEwNCIsImRpZW5UaG9haSI6IjA4ODg4ODg4ODkiLCJpYXQiOjE3NTkyNTA4ODUsImV4cCI6MTc1OTI1NDQ4NX0.VD_Hpdh2LV8ZnCVY27YjZjX0_nS5VPTatPVv92N8_tw
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGRjMDliOTJhNzNjYTZlNDVjODZhMDMiLCJtYURvY0dpYSI6IjY4ZGMwOWI5MmE3M2NhNmU0NWM4NmEwNCIsImRpZW5UaG9haSI6IjA4ODg4ODg4ODkiLCJpYXQiOjE3NTkyNTA4ODUsImV4cCI6MTc1OTI1NDQ4NX0.VD_Hpdh2LV8ZnCVY27YjZjX0_nS5VPTatPVv92N8_tw

export const requestController = {
  addRequest: async (req, res, next) => {
    try {
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
      const requests = await Request.aggregate([
        { $match: {} },
        { $lookup: {
          from: 'DocGia',
          localField: 'maDocGia',
          foreignField: 'maDocGia',
          as: 'docGia'
        } },
        { $lookup: {
          from: 'Sach',
          localField: 'maSach',
          foreignField: 'bookId',
          as: 'sach'
        } }
      ])
      res.status(StatusCodes.OK).json(requests)
    } catch (error) {
      next(error)
    }
  },
  updateRequest: async (req, res, next) => {
    try {
      const updatedRequest = await Request.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      res.status(StatusCodes.OK).json(updatedRequest)
    } catch (error) {
      next(error)
    }
  }
}
