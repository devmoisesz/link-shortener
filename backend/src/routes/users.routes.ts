import express from 'express';
import { userSchema, loginSchema } from '../schemas/schema';
import { validate } from '../validators/validator';
import { registerUser } from '../controllers/users/register-user.controller';
import { login } from '../controllers/users/login.controller';
import { refresh } from '../controllers/users/refresh.controller';

const router = express.Router()

router.post(
    '/register', 
    validate(userSchema),
    registerUser
)

router.post(
    '/login',
    validate(loginSchema),
    login
)

router.patch(
    '/refresh',
    refresh
)

export default router