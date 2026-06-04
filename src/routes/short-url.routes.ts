import express from 'express';
import { validate } from '../validators/short-url.validator';
import { urlSchema } from '../schemas/short-url.schema';
import controller from "../controllers/short-url.controller";

const router = express.Router();

router.post(
    '/api/shorten', 
    validate(urlSchema),
    controller.shortenUrl
);

router.get(
    '/:shortCode',
    controller.redirectLink
)

export default router;