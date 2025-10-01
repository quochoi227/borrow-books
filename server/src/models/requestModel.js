import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
  maDocGia: {
    type: mongoose.Schema.Types.ObjectId
  },
  maSach: {
    // type: mongoose.Schema.Types.ObjectId
    type: String
  },
  ngayMuon: {
    type: Date,
    default: () => Date.now()
  },
  ngayTra: {
    type: Date,
    default: null
  },
  hanTra: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000
  },
  status: {
    type: String,
    default: 'đang mượn'
  }
})

export const Request = mongoose.model('Request', requestSchema, 'TheoDoiMuonSach')
