import { Publisher } from '../models/publisherModel.js'

export const publisherController = {
  getAllPublishers: async (req, res) => {
    try {
      const publisher = await Publisher.find()
      res.status(200).json(publisher)
    } catch (error) {
      next(error)
    }
  },
  addPublisher: async (req, res) => {
    try {
      const newPublisher = new Publisher(req.body)
      const createdPublisher = await newPublisher.save()
      res.status(201).json(createdPublisher)
    } catch (error) {
      next(error)
    }
  }
}
