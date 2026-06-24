import express from 'express';
import { validate } from '../validators/validator';
import { urlSchema } from '../schemas/schema';
import authentication from '../auth/auth';
import { shortenUrl } from '../controllers/short-url/shortenUrl.controller';
import { redirectLink } from '../controllers/short-url/redirect-link.controller';
import { getUserUrls } from '../controllers/short-url/get-user-urls.controller';
import { deleteUrl } from '../controllers/short-url/delete-url.controller';

const router = express.Router();

router.post(
    '/api/shorten', 
    authentication,
    validate(urlSchema),
    shortenUrl
);

router.get(
    '/:shortCode',
    redirectLink
)

router.get(
    '/api/urls',
    authentication,
    getUserUrls
)

router.delete(
    `/api/:shortCode`,
    authentication,
    deleteUrl
)

export default router;