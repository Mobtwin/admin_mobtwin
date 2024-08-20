import request from 'supertest';
import express, { Request } from 'express';
import bodyParser from 'body-parser';

// Import your controller and services
import { getAllAdminsController } from '../../controllers/admin.controller';
import { ADMIN_PERMISSIONS } from '../../constant/admin.constant';
import * as service from '../../services/admin.service';

// Create an Express app instance for testing
const app = express();
app.use(bodyParser.json());

// Set up route for testing
app.get('/api/v1/admins',(req,res,next)=>{
  if(req.query.userId){
    req.user = {id:"user1",permissions:[ADMIN_PERMISSIONS.READ_OWN],role:"admin",userName:"admin",email:"test@example.com"};
  }
  next()
}, getAllAdminsController);

describe('GET /api/v1/admins', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should return 401 if unauthorized', async () => {
    const response = await request(app).get('/api/v1/admins');
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


    // Mock the getAllAdmins function
    jest.spyOn(service,"getAllAdmins").mockResolvedValue([
      { id: 'user1', name: 'John Doe' } as any
    ]);

    const response = await request(app).get('/api/v1/admins?userId="azeer"');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Admins retrieved successfully!');
    expect(response.body.data).toEqual([{ id: 'user1', name: 'John Doe' }]);
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

    // Mock the getAllAdmins function to throw an error
    jest.spyOn(service,"getAllAdmins").mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/v1/admins?userId="azeer"');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error: Database error');
  });
});
