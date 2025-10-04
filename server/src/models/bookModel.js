import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  maSach: {
    type: String,
    unique: true
  },
  tenSach: {
    type: String
  },
  donGia: {
    type: Number
  },
  soQuyen: {
    type: Number
  },
  namXuatBan: {
    type: Number
  },
  maNXB: {
    type: String
  },
  moTa: {
    type: String
  },
  anhBia: {
    type: String
  },
  anhChiTiet: {
    type: [String]
  }
})

bookSchema.set('toObject', { virtuals: true })
bookSchema.set('toJSON', { virtuals: true })

bookSchema.virtual('nhaXuatBan', {
  ref: 'Publisher',
  localField: 'maNXB',
  foreignField: 'maNXB',
  justOne: true
})

export const Book = mongoose.model('Book', bookSchema, 'Sach')
