import express from 'express';
import { imageUpload } from '../config/storage.config';
import { uploadImageController } from '../controllers/upload.controller';
export const uploadRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API to manage images
 */
/**
 * @swagger
 * /images/upload-images:
 *   post:
 *     summary: Upload images
 *     description: Allows authenticated users to upload up to 20 images.
 *     tags:
 *       - Images
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files to upload (max 20).
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://your-spaces-url/admin/images/image123.jpg"
 *       400:
 *         description: Bad request - Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error! File size limit exceeded
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Unauthorized!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error! Something went wrong.
 */

uploadRouter.post('/upload-images', imageUpload.array('images',20), uploadImageController);