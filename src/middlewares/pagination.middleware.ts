import { Request, Response, NextFunction } from 'express';


const paginationMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;

    // Ensure page and limit are valid
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    // Set pagination parameters on request object
    req.query.page = page.toString();
    req.query.limit = limit.toString();

    // Set skip and limit for MongoDB or other database queries
    res.locals.skip = (page - 1) * limit;
    res.locals.limit = limit;

    next();
  };
};

export default paginationMiddleware;
