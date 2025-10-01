import mongoose from 'mongoose'

const publisherSchema = new mongoose.Schema({
  publisherId: {
    type: String
  },
  name: {
    type: String
  },
  address: {
    type: String
  }
})

export const Publisher = mongoose.model('Publisher', publisherSchema, 'NhaXuatBan')
