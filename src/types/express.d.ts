
// Import the existing Express types
import * as express from 'express';
import { ROLES } from '../models/admin.schema';
import { Request } from 'express';
import { ResponseType } from '../utils/response';

// Extend the Express User interface
declare global {
  namespace Express {
    interface User { id: string, userName: string, email: string,token?:string,role: string,permissions: string[]; }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User; // You can replace `any` with a specific type if you know the structure of `user`.
  }
  interface Response {
    locals:{
      responseData:ResponseType<any>;
      [key: string]: any;
    }
  }
}