import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            return res.status(400).json({
                errors: result.error.issues.map(issue => ({
                    field: String(issue.path[0]),
                    message: issue.message
                }))
            });

        }

        req.body = result.data;

        next();

    }

}