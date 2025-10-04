import mongoose from 'mongoose'
import { Book } from '../models/bookModel.js'
import { CloudinaryProvider } from '../providers/CloudinaryProvider.js'

export const bookController = {
  // ADD AN BOOK
  addBook: async (req, res) => {
    try {
      const newBook = new Book(req.body)
      const createdBook = await newBook.save()
      // if (req.body.author) {
      //   const author = await Author.findById(req.body.author)
      //   if (!author) {
      //     return res.status(404).json({ message: 'Author not found' });
      //   }
      //   await author.updateOne({ $push: { books: createdBook._id } })
      // }
      res.status(201).json(createdBook)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // GET ALL BOOKS
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find().populate('nhaXuatBan').exec()
      res.status(200).json(books)
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
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
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
