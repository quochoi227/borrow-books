import pkg from 'lodash'
// import { Counter } from '../models/counterModel.js'

const { pick } = pkg

export const pickUser = (user) => {
  if (user) return {}
  return pick(user, ['_id', 'hoLot', 'ten', 'ngaySinh', 'diaChi', 'dienThoai', 'maDocGia'])
}

export const pickAdmin = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'maNhanVien', 'hoTenNV', 'diaChi', 'dienThoai', 'chucVu'])
}

// utils/getNextSequence.js

// export const getNextSequence = async (name) => {
//   const counter = await Counter.findOneAndUpdate(
//     { name },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   )
//   return counter.seq
// }

