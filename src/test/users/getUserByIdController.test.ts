import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Import your controller and services
import { getUserByIdController } from '../../controllers/user.controller';
import { USER_PERMISSIONS } from '../../constant/user.constant';
import * as service from '../../services/user.service';

// Create an Express app instance for testing
const app = express();
app.use(bodyParser.json());

// Set up route for testing
app.get('/api/v1/users/:id',(req,res,next)=>{
  if(req.query.userId){
    req.user = {id:"user1",permissions:[USER_PERMISSIONS.READ_OWN],role:"admin",userName:"admin",email:"test@example.com"};
  }
  next()
}, getUserByIdController);

describe('GET /api/v1/users/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should return 401 if unauthorized', async () => {
    const response = await request(app).get('/api/v1/users/123');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized!');
  });


  it('should return 200 and user data if authorized', async () => {
    const mockUser = {
      id: 'user1',
      role:"admin",
      userName:"admin",
      email:"admin@example.com",
      permissions: [USER_PERMISSIONS.READ]
    };


    // Mock the getUserById function
    jest.spyOn(service,"getUserById").mockResolvedValue(
      { id: 'user1', name: 'John Doe' } as any
    );

    const response = await request(app).get('/api/v1/users/120?userId="azeer"');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User fetched successfully!');
    expect(response.body.data).toEqual({ id: 'user1', name: 'John Doe' });
  });

  it('should return 400 if there is an error fetching users', async () => {
    const mockUser = {
      id: 'user1',
      permissions: ['READ_OWN']
    };

    // Mock authorization middleware
    app.use((req, res, next) => {
      (req as any).user = mockUser;
      next();
    });

    // Mock the getUserById function to throw an error
    jest.spyOn(service,"getUserById").mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/v1/users/120?userId="azeer"');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error: Database error');
  });
});
