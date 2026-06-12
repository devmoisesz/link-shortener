import usersPaths  from "./users.docs"
import shortUrlPaths from "./short-url.docs"
import { schemas } from "./components/schemas.docs"

const paths = {...usersPaths, ...shortUrlPaths}

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Link Shortener API',
        version: '1.0.0'
    },

    paths: paths,

    components: {
        schemas
    }
}

export default swaggerDocument