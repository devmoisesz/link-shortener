import express from 'express';
import { userSchema, loginSchema } from '../schemas/schema';
import { validate } from '../validators/short-url.validator';
import controller from '../controllers/users.controller'


const router = express.Router()

router.post(
    '/register', 
    validate(userSchema),
    controller.registerUser
)

router.post(
    '/login',
    validate(loginSchema),
    controller.login
)


export default router