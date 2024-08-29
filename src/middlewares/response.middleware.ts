import { NextFunction, Request, Response } from "express";
import { ResponseType } from "../utils/response";


export const transformResponseJson = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        return next();
    }
    const originalJson = res.json;
    res.json = function (data:ResponseType<any>) {
        res.locals.responseData = data;
        return originalJson.call(this, data);
    };
    next();

}
