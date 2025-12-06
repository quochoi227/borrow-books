import mongoose from "mongoose";
// import { getNextSequence } from '../utils/formatters.js'

const userSchema = new mongoose.Schema({
  maDocGia: {
    // type: String
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  hoLot: {
    type: String,
  },
  ten: {
    type: String,
  },
  ngaySinh: {
    type: String,
  },
  phai: {
    type: String,
  },
  diaChi: {
    type: String,
  },
  dienThoai: {
    type: String,
  },
  matKhau: {
    type: String,
  },
  canThanhToan: {
    type: Number,
    default: 0,
  },
});

// userSchema.pre('save', async function (next) {
//   if (!this.maDocGia) {
//     const nextId = await getNextSequence('docGia')
//     this.maDocGia = `DG${String(nextId).padStart(4, '0')}`
//   }
//   next()
// })

const User = mongoose.model("User", userSchema, "DocGia");

export default User;
