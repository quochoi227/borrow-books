import mongoose from 'mongoose'

const publisherSchema = new mongoose.Schema({
  maNXB: {
    type: String
  },
  tenNXB: {
    type: String
  },
  diaChi: {
    type: String
  }
})

const Publisher = mongoose.model('Publisher', publisherSchema, 'NhaXuatBan')

export default Publisher
