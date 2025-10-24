import express from 'express'
import userController from '../../controllers/userController.js'

const Router = express.Router()

Router.get('/', userController.getAllUsers)
Router.post('/register', userController.register)
Router.post('/login', userController.login)
Router.delete('/logout', userController.logOut)

export const userRoute = Router
