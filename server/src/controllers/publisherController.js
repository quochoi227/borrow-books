import Publisher from "../models/publisherModel.js";

const publisherController = {
  getAllPublishers: async (req, res, next) => {
    try {
      const publisher = await Publisher.find();
      res.status(200).json(publisher);
    } catch (error) {
      next(error);
    }
  },
  addPublisher: async (req, res, next) => {
    try {
      const newPublisher = new Publisher(req.body);
      const createdPublisher = await newPublisher.save();
      res.status(201).json(createdPublisher);
    } catch (error) {
      next(error);
    }
  },
  updatePublisher: async (req, res, next) => {
    try {
      const updatedPublisher = await Publisher.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedPublisher);
    } catch (error) {
      next(error);
    }
  },
  deletePublisher: async (req, res, next) => {
    try {
      await Publisher.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};

export default publisherController;
