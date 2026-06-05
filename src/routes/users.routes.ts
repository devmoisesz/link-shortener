import express from 'express';
import { userSchema } from '../schemas/schema';
import { validate } from '../validators/short-url.validator';
import controller from '../controllers/users.controller'


const router = express.Router()

router.post(
    '/register', 
    validate(userSchema),
    controller.registerUser
)


export default router