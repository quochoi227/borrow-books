import mongoose from 'mongoose'
import Book from '../models/bookModel.js'
import { CloudinaryProvider } from '../providers/CloudinaryProvider.js'

const bookController = {
  // ADD AN BOOK
  addBook: async (req, res) => {
    try {
      const bookImgs = req.files.bookImgs?.map((file) => file.filename) || []
      const genres = JSON.parse(req.body.theLoai || '[]')
      const data = {
        ...req.body,
        anhBia: req.files.bookImg[0].filename,
        anhChiTiet: bookImgs,
        theLoai: genres
      }
      const newBook = new Book(data)
      const createdBook = await newBook.save()
      res.status(201).json(createdBook)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // GET ALL BOOKS
  getAllBooks: async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const tenSach = req.query.search ? { $regex: req.query.search, $options: 'i' } : { $exists: true }
    const maNXB = req.query.publisher ? req.query.publisher : { $exists: true }
    const soQuyenConLai = req.query.stockState === 'available' ? { $gt: 0 } : req.query.stockState === 'unavailable' ? 0 : { $exists: true }
    const theLoai = req.query.genres !== '[]' ? { $in: JSON.parse(req.query.genres) } : { $exists: true }
    const sortBy = req.query.sortBy || 'maSach'
    try {
      const [books, count] = await Promise.all([
        Book.find({
          tenSach,
          maNXB,
          soQuyenConLai,
          theLoai
        })
        .sort({ [sortBy]: sortBy !== 'luotMuon' ? 1 : -1 })
        .populate('nhaXuatBan')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec(),
        Book.countDocuments({
          tenSach,
          maNXB,
          soQuyenConLai,
          theLoai
        })
      ])
      res.status(200).json({ books, totalPages: Math.ceil(count / limit), count })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // GET A BOOK IN DETAIL
  getABook: async (req, res) => {
    try {
      // const book = await Book.findById(req.params.id)
      const result = await Book.findById(req.params.id).populate('nhaXuatBan').exec()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // UPDATE A BOOK
  updateABook: async (req, res) => {
    try {
      const bookImg = req.files?.bookImg?.[0] || null
      const bookImgs = req.files?.bookImgs?.map((file) => file.filename) || []
      const genres = JSON.parse(req.body.theLoai || '[]')
      const data = {
        ...req.body,
        anhBia: bookImg?.filename || req.body.bookImgOld,
        anhChiTiet: req.body.bookImgsOld ? [...req.body.bookImgsOld, ...bookImgs] : bookImgs,
        theLoai: genres
      }
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, { $set: data }, { new: true })
      res.status(200).json(updatedBook)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // DELETE A BOOK
  deleteABook: async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.id)
      // await Author.findByIdAndUpdate(book.author, { $pull: { books: book._id } })
      res.status(200).json({ message: 'Book deleted successfully!' })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // uploadImage: async (req, res) => {
  //   try {
  //     const updateResult = []
  //     let result = {}
  //     for (let i = 0; i < req.files.length; i++) {
  //       result = await CloudinaryProvider.streamUpload(req.files[i].buffer, 'book_images')
  //       updateResult.push(result)
  //     }
  //     res.status(200).json(updateResult)
  //   } catch (error) {
  //     res.status(500).json(error)
  //   }
  // }
  uploadImage: async (req, res) => {
    try {
      // const result = await CloudinaryProvider.streamUpload(req.file.buffer, 'book_test')
      res.status(200).json({
        img: req.file.filename
      })
      // res.status(200).json('ok')
    } catch (error) {
      res.status(500).json(error)
    }
  },
  uploadImages: async (req, res) => {
    try {
      const imgs = req.files.map((file) => file.filename)
      res.status(200).json(imgs)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default bookController
