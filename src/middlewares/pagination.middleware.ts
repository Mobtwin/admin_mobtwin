import { Request, Response, NextFunction } from 'express';


const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  // Set skip and limit for MongoDB or other database queries
  res.locals.skip = (page - 1) * limit;
  res.locals.limit = limit;

  next(); // Continue to the next middleware or route handler
};


export default paginationMiddleware;
