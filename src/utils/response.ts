import { Response } from 'express';

// Success response handler
export const sendSuccessResponse = <T>(res: Response, data: T, message: string, statusCode = 200): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
  return;
};

// Error response handler
export const sendErrorResponse = (res: Response, error: any, message = "An error occurred", statusCode = 400): void => {
  if (error) {
    console.error(error); // Log the error details for debugging
  }
  res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
  });
  return;
};
