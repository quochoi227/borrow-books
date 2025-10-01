import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  unitPrice: {
    type: String
  },
  stock: {
    type: Number
  },
  remaining: {
    type: Number
  },
  publishedYear: {
    type: String
  },
  publisherId: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
})

export const Book = mongoose.model('Book', bookSchema, 'Sach')
