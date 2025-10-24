import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
  maDocGia: {
    type: mongoose.Schema.Types.ObjectId
  },
  maSach: {
    type: String
  },
  ngayYeuCau: {
    type: Date,
    default: () => Date.now()
  },
  ngayMuon: {
    type: Date,
    default: null
  },
  ngayTra: {
    type: Date,
    default: null
  },
  hanTra: {
    type: Date,
    // default: () => Date.now() + 7 * 24 * 60 * 60 * 1000
    default: null
  },
  trangThai: {
    type: String,
    default: 'chờ duyệt'
  }
})

requestSchema.set('toObject', { virtuals: true })
requestSchema.set('toJSON', { virtuals: true })

requestSchema.virtual('docGia', {
  ref: 'User',
  localField: 'maDocGia',
  foreignField: 'maDocGia',
  justOne: true
})

requestSchema.virtual('sach', {
  ref: 'Book',
  localField: 'maSach',
  foreignField: 'maSach',
  justOne: true
})

const Request = mongoose.model('Request', requestSchema, 'TheoDoiMuonSach')

export default Request
