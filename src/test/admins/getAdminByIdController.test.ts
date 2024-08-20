import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Import your controller and services
import { getAdminByIdController } from '../../controllers/admin.controller';
import { ADMIN_PERMISSIONS } from '../../constant/admin.constant';
import * as service from '../../services/admin.service';

// Create an Express app instance for testing
const app = express();
app.use(bodyParser.json());

// Set up route for testing
app.get('/api/v1/admins/:id',(req,res,next)=>{
  if(req.query.userId){
    req.user = {id:"user1",permissions:[ADMIN_PERMISSIONS.READ_OWN],role:"admin",userName:"admin",email:"test@example.com"};
  }
  next()
}, getAdminByIdController);

describe('GET /api/v1/admins/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should return 401 if unauthorized', async () => {
    const response = await request(app).get('/api/v1/admins/123');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized!');
  });


  it('should return 200 and user data if authorized', async () => {
    const mockUser = {
      id: 'user1',
      role:"admin",
      userName:"admin",
      email:"admin@example.com",
      permissions: [ADMIN_PERMISSIONS.READ]
    };


    // Mock the getAdminById function
    jest.spyOn(service,"getAdminById").mockResolvedValue(
      { id: 'user1', name: 'John Doe' } as any
    );

    const response = await request(app).get('/api/v1/admins/120?userId="azeer"');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Admin retrieved successfully!');
    expect(response.body.data).toEqual({ id: 'user1', name: 'John Doe' });
  });

  it('should return 400 if there is an error fetching admins', async () => {
    const mockUser = {
      id: 'user1',
      permissions: ['READ_OWN']
    };

    // Mock authorization middleware
    app.use((req, res, next) => {
      (req as any).user = mockUser;
      next();
    });

    // Mock the getAdminById function to throw an error
    jest.spyOn(service,"getAdminById").mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/v1/admins/120?userId="azeer"');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error: Database error');
  });
});
