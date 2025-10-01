import { Author } from '~/models/authorModel.js'
import { Book } from '~/models/bookModel.js'

export const authorController = {
  // ADD AN AUTHOR
  addAuthor: async (req, res) => {
    try {
      const newAuthor = new Author(req.body)
      const createdAuthor = await newAuthor.save()
      res.status(201).json(createdAuthor)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // GET ALL AUTHORS
  getAllAuthors: async (req, res) => {
    try {
      const authors = await Author.find()
      res.status(200).json(authors)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // GET AN AUTHOR IN DETAIL
  getAnAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id).populate('books')
      res.status(200).json(author)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // UPDATE AN AUTHOR
  updateAnAuthor: async (req, res) => {
    try {
      await Author.findByIdAndUpdate(req.params.id, { $set: req.body })
      res.status(200).json({ message: 'Updated successfully!' })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // DELETE AN AUTHOR
  deleteAnAuthor: async (req, res) => {
    try {
      const author = await Author.findByIdAndDelete(req.params.id)
      await Book.deleteMany({
        _id: author.books
      })
      res.status(200).json({ message: 'Author deleted successfully!' })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
