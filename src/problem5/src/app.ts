import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import userRoutes from './routes/user.routes';
import { UserService } from './services/user.service';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Welcome endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the CRUD API Server',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      'GET /users': 'Get all users (supports filters: role, status, minAge, maxAge)',
      'GET /users/:id': 'Get a single user by ID',
      'POST /users': 'Create a new user',
      'PUT /users/:id': 'Update a user',
      'PATCH /users/:id': 'Partially update a user',
      'DELETE /users/:id': 'Delete a user',
      'GET /stats': 'Get database statistics',
    },
  });
});

// Routes
app.use('/users', userRoutes);

// Statistics endpoint
app.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await UserService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

export default app;
