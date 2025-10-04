import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema({
  tenTacGia: {
    type: String,
    required: true
  },
  namSinh: {
    type: String,
    required: true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
})

export const Author = mongoose.model('Author', authorSchema, 'TacGia')
