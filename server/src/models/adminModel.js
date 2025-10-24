import mongoose from 'mongoose'
// import { getNextSequence } from '../utils/formatters.js'

const adminSchema = new mongoose.Schema({
  maNhanVien: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  hoTenNV: {
    type: String
  },
  chucVu: {
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

// userSchema.pre('save', async function (next) {
//   if (!this.maDocGia) {
//     const nextId = await getNextSequence('docGia')
//     this.maDocGia = `DG${String(nextId).padStart(4, '0')}`
//   }
//   next()
// })

const Admin = mongoose.model('Admin', adminSchema, 'NhanVien')

export default Admin
