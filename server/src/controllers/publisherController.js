import { Publisher } from '~/models/publisherModel'

export const publisherController = {
  getAllSources: async (req, res) => {
    try {
      const publisher = await Publisher.find()
      res.status(200).json(publisher)
    } catch (error) {
      next(error)
    }
  },
  addSource: async (req, res) => {
    try {
      const newPublisher = new Publisher(req.body)
      const createdPublisher = await newPublisher.save()
      res.status(201).json(createdPublisher)
    } catch (error) {
      next(error)
    }
  }
}
