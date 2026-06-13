import express from 'express';
import { validate } from '../validators/validator';
import { urlSchema } from '../schemas/schema';
import controller from "../controllers/short-url.controller";
import authentication from '../auth/auth';

const router = express.Router();

router.post(
    '/api/shorten', 
    authentication,
    validate(urlSchema),
    controller.shortenUrl
);

router.get(
    '/:shortCode',
    controller.redirectLink
)

router.get(
    '/api/urls',
    authentication,
    controller.getUserUrls
)

router.delete(
    `/api/:shortCode`,
    authentication,
    controller.DeleteUrl
)

export default router;