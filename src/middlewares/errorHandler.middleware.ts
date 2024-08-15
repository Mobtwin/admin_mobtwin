import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/response';
import { logEvents } from './logger';

// Centralized error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog.log');
  console.error(err); // Log the error details for debugging
  sendErrorResponse(res, err, err?.message || 'Internal Server Error', 500);
};