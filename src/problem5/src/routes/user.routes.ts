import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (active/inactive)
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: number
 *         description: Minimum age filter
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: number
 *         description: Maximum age filter
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *         description: Include soft-deleted users
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, email, age, role, created_at, updated_at]
 *         description: Sort by field (default is id)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (default is DESC)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (requires limit parameter)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page (requires page parameter)
 *     responses:
 *       200:
 *         description: List of users (paginated if page/limit provided)
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', UserController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               age:
 *                 type: integer
 *                 example: 28
 *               role:
 *                 type: string
 *                 example: Developer
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */
router.post('/', UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (full update)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 */
router.put('/:id', UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Partially update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 */
router.patch('/:id', UserController.partialUpdate);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', UserController.delete);

/**
 * @swagger
 * /users/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User restored successfully
 *       404:
 *         description: User not found or not deleted
 */
router.post('/:id/restore', UserController.restore);

export default router;
