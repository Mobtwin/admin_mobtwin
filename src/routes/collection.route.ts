import { Router } from "express";
import { checkPermission } from "../middlewares/rbac.middleware";
import { COLLECTION_PERMISSIONS, COLLECTION_TABLE } from "../constant/collection.constant";
import { validateRequest } from "../middlewares/requestValidator.middleware";
import { updatePermissionByIdSchema } from "../validators/permission.validator";
import { createCollectionController, deleteCollectionController, getAllCollectionsController, updateCollectionController } from "../controllers/collection.controller";
import { createCollectionSchema, deleteCollectionByIdSchema } from "../validators/collection.validator";
import cacheMiddleware from "../middlewares/cache.middleware";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { paginationQuerySchema } from "../validators/pagination.validator";
import paginationMiddleware from "../middlewares/pagination.middleware";

export const collectionRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: API to manage collections
 */

collectionRouter.get(
  "/",
  checkPermission([COLLECTION_PERMISSIONS.READ, COLLECTION_PERMISSIONS.READ_OWN]),
  validateRequest(paginationQuerySchema,"query"),
  cacheMiddleware(COLLECTION_TABLE),
  paginationMiddleware,
  getAllCollectionsController
);

/**
 * @swagger
 * /collection:
 *   post:
 *     summary: Create a new collection
 *     description: Allows authorized users to create a new collection. Requires the CREATE permission.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           example: "web"
 *         description: Platform for which the collection is being created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCollection'
 *     responses:
 *       201:
 *         description: Collection created successfully.
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
 *                   example: Collection created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Bad request due to validation errors or invalid query parameters.
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
 *                   example: Invalid platform query parameter
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *       403:
 *         description: Forbidden. User lacks sufficient permissions
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
 *                   example: Forbidden. Insufficient permissions!
 *       500:
 *         description: Internal server error.
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
 *                   example: Error! Unable to create collection
 */

collectionRouter.post(
  "/",
  checkPermission([COLLECTION_PERMISSIONS.CREATE], {
    table: COLLECTION_TABLE,
    action: PERMISSIONS_ACTIONS.CREATE,
  }),
  validateRequest(createCollectionSchema),
  createCollectionController
);

/**
 * @swagger
 * /collection/{id}:
 *   put:
 *     summary: Update an existing collection
 *     description: Allows authorized users to update a collection by its ID. Requires the UPDATE permission.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The ID of the collection to be updated.
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           example: "web"
 *         description: Platform for which the collection is being updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCollection'
 *     responses:
 *       200:
 *         description: Collection updated successfully.
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
 *                   example: Collection updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Bad request due to validation errors or invalid input.
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
 *                   example: Invalid platform query parameter
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *       403:
 *         description: Forbidden. User lacks sufficient permissions
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
 *                   example: Forbidden. Insufficient permissions!
 *       500:
 *         description: Internal server error.
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
 *                   example: Error! Unable to update collection
 */


collectionRouter.put(
  "/:id",
  checkPermission([COLLECTION_PERMISSIONS.UPDATE], {
    table: COLLECTION_TABLE,
    action: PERMISSIONS_ACTIONS.UPDATE,
  }),
  validateRequest(updatePermissionByIdSchema),
  updateCollectionController
);

/**
 * @swagger
 * /collection/{id}:
 *   delete:
 *     summary: Delete a collection by ID
 *     description: Allows authorized users to delete a collection by its ID. Requires the DELETE permission.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The ID of the collection to be deleted.
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           example: "gp" or "as"
 *         description: Platform for which the collection is being deleted.
 *     responses:
 *       200:
 *         description: Collection deleted successfully.
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
 *                   example: Collection deleted successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Bad request due to validation errors or invalid input.
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
 *                   example: Missing collection ID
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
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
 *       403:
 *         description: Forbidden. User lacks sufficient permissions
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
 *                   example: Forbidden. Insufficient permissions!
 *       500:
 *         description: Internal server error.
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
 *                   example: Error! Unable to delete collection
 */

collectionRouter.delete(
  "/:id",
  checkPermission([COLLECTION_PERMISSIONS.DELETE], {
    table: COLLECTION_TABLE,
    action: PERMISSIONS_ACTIONS.DELETE,
  }),
  validateRequest(deleteCollectionByIdSchema),
  deleteCollectionController
);