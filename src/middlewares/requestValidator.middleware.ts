import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { sendErrorResponse } from "../utils/response";

export const validateRequest = (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req[property], { abortEarly: false });
  
      if (error) {
        const errors = error.details.map(detail => detail.message);
        return sendErrorResponse(res, error, errors[0], 400);
      }
  
      next();
    };
};
  