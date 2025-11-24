import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { APIs_V1 } from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { corsOptions } from './configs/cors.js'
import { env } from './configs/environment.js'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()

// Connect database
mongoose.connect(env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully.')
  })
  .catch((error) => {
    console.error('MongoDB connection error')
  })

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Static

app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')))

// Routes
app.use('/v1', APIs_V1)

// Middlewares
app.use(errorHandlingMiddleware)

app.listen(8017, () => {
  console.log('Server is running...')
})
