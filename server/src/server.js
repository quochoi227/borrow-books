import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { corsOptions } from './configs/cors'
import { env } from './configs/environment'
import cookieParser from 'cookie-parser'

const app = express()

// Connect database
mongoose.connect(env.MONGODB_URI)

app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(morgan('common'))

// Routes
app.use('/v1', APIs_V1)

// Middlewares
app.use(errorHandlingMiddleware)

app.listen(8017, () => {
  console.log('Server is running...')
})
