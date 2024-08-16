
// Import the existing Express types
import * as express from 'express';
import { ROLES } from '../models/admin.schema';
import { Request } from 'express';

// Extend the Express User interface
declare global {
  namespace Express {
    interface User { id: string, userName: string, email: string,token?:string,role: "admin"| "maintainer" }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User; // You can replace `any` with a specific type if you know the structure of `user`.
  }
}