import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  maDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  hoLot: {
    type: String
  },
  ten: {
    type: String
  },
  ngaySinh: {
    type: String
  },
  phai: {
    type: String
  },
  diaChi: {
    type: String
  },
  dienThoai: {
    type: String
  },
  matKhau: {
    type: String
  }
})

export const User = mongoose.model('User', userSchema, 'DocGia')
