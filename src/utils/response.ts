import { Response } from 'express';
import { Pagination } from './pagination';
// Pagination interface

// Success response handler
export const sendSuccessResponse = <T>(res: Response, data: T, message: string, statusCode = 200,pagination?:Pagination): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: pagination || undefined, // Include pagination if it exists
  });
  return;
};

// Error response handler
export const sendErrorResponse = (res: Response, error: any, message = "An error occurred", statusCode = 400): void => {
  //TODO: Log the error details for debugging
  // if (error) {
  //   console.error(error); // Log the error details for debugging
  // }
  res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
  });
  return;
};
