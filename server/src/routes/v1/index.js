import express from 'express'
import { bookRoute } from './bookRoute'
import { authorRoute } from './authorRoute'
import { userRoute } from './userRoute'
import { publisherRoute } from './publisherRoute'
import { requestRoute } from './requestRoute'

const Router = express.Router()

Router.use('/books', bookRoute)
Router.use('/authors', authorRoute)
Router.use('/users', userRoute)
Router.use('/sources', publisherRoute)
Router.use('/requests', requestRoute)

export const APIs_V1 = Router
