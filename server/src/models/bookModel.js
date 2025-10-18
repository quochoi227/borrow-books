import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  maSach: {
    type: String,
    unique: true
  },
  tenSach: String,
  donGia: Number,
  soQuyen: Number,
  soQuyenConLai: Number,
  namXuatBan: Number,
  maNXB: String,
  moTa: String,
  anhBia: String,
  anhChiTiet: [String],
  theLoai: [String],
  luotMuon: {
    type: Number,
    default: 0
  }
})

// danhGia: {
//     type: {
//       motSao: { type: Number, default: 0 },
//       haiSao: { type: Number, default: 0 },
//       baSao: { type: Number, default: 0 },
//       bonSao: { type: Number, default: 0 },
//       namSao: { type: Number, default: 0 }
//     },
//     default: () => ({ motSao: 0, haiSao: 0, baSao: 0, bonSao: 0, namSao: 0 })
//   },
//   comments: {
//     type: [
//       {
//         noiDung: { type: String },
//         hoTen: { type: String },
//         commentedAt: { type: Date, default: Date.now() }
//       }
//     ],
//     default: []
//   }

bookSchema.set('toObject', { virtuals: true })
bookSchema.set('toJSON', { virtuals: true })

bookSchema.virtual('nhaXuatBan', {
  ref: 'Publisher',
  localField: 'maNXB',
  foreignField: 'maNXB',
  justOne: true
})

export const Book = mongoose.model('Book', bookSchema, 'Sach')
