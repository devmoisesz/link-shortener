import express from 'express';
import {validate} from '../validators/short-url.validator.ts'
import { urlSchema } from '../schemas/short-url.schema.ts'
import { shortenUrl } from '../controllers/short-url.controller.ts'

const router = express.Router();

router.post(
    '/shortener', 
    validate(urlSchema)
    shortenUrl
);