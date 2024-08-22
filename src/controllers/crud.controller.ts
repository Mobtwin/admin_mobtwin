import { Request, Response } from "express";
import { Model, Document } from "mongoose";
import { sendErrorResponse } from "../utils/response";
import { getPermissionName } from "../services/permission.service";
import { IAction } from "../services/itemSpecificPermissions.service";
import { IRolePopulated, Roles } from "../models/role.schema";
import { ItemSpecificPermissions } from "../models/itemSpecificPermission.schema";

export abstract class CrudController<T extends Document> {
  protected abstract model: Model<T>;
  protected abstract tableName: string;
  protected restricted: string[] = [
    "create",
    "read",
    "read_own",
    "update",
    "delete",
    "assign",
    "unassign",
  ];

  protected async createOne(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return sendErrorResponse(res, null, "Unauthorized!", 401);
      if (
        this.restricted.includes("create") &&
        !this.hasPermission(user, "create")
      ) {
        return sendErrorResponse(res, null, "Permission denied!", 403);
      }

      const data = req.body;
      const newItem = await this.model.create(data);

      if (this.afterCreateOne) {
        await this.afterCreateOne(newItem, req);
      }

      return res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  protected async readOne(req: Request, res: Response) {
    try {
      const user = req.user;
      const id = req.params.id;
      if (!user) return sendErrorResponse(res, null, "Unauthorized!", 401);

      if (
        this.restricted.includes("read_one") &&
        !this.hasPermission(user, "read", id)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Permission denied." });
      }

      const item = await this.model.findById(id);

      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: `${this.tableName} not found.` });
      }

      if (this.afterReadOne) {
        await this.afterReadOne(item, req);
      }

      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  protected async readAll(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return sendErrorResponse(res, null, "Unauthorized!", 401);

      if (
        this.restricted.includes("read_all") &&
        !this.hasPermission(user, "read")
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Permission denied." });
      }

      const items = await this.model.find({});

      if (this.afterReadAll) {
        await this.afterReadAll(items, req);
      }

      return res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  protected async updateOne(req: Request, res: Response) {
    try {
      const user = req.user;
      const id = req.params.id;
      if (!user) return sendErrorResponse(res, null, "Unauthorized!", 401);

      if (
        this.restricted.includes("update") &&
        !this.hasPermission(user, "update", id)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Permission denied." });
      }

      const data = req.body;
      const updatedItem = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updatedItem) {
        return res
          .status(404)
          .json({ success: false, message: `${this.tableName} not found.` });
      }

      if (this.afterUpdateOne) {
        await this.afterUpdateOne(updatedItem, req);
      }

      return res.status(200).json({ success: true, data: updatedItem });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  protected async deleteOne(req: Request, res: Response) {
    try {
      const user = req.user;
      const id = req.params.id;
      if (!user) return sendErrorResponse(res, null, "Unauthorized!", 401);

      if (
        this.restricted.includes("delete") &&
        !this.hasPermission(user, "delete", id)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Permission denied." });
      }

      const deletedItem = await this.model.findByIdAndDelete(id);

      if (!deletedItem) {
        return res
          .status(404)
          .json({ success: false, message: `${this.tableName} not found.` });
      }

      if (this.afterDeleteOne) {
        await this.afterDeleteOne(deletedItem, req);
      }

      return res
        .status(200)
        .json({ success: true, message: `${this.tableName} deleted.` });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  protected async hasPermission(
    user: Express.User,
    action: IAction,
    id?: string
  ): Promise<boolean> {
    const permissionName = getPermissionName(action, this.tableName);
    const role = (await Roles.findById(user.role).populate(
      "permissions"
    )) as IRolePopulated | null;
    if (
      role &&
      role.permissions.some((permission) => permission.name === permissionName)
    ) {
      return true; // Role-based permission found, proceed
    }
    // check for item specific permissions
    if (id) {
      const item = await ItemSpecificPermissions.findOne({userId:user.id,action,table:this.tableName,items:{ $in: [id] }});
      if (item) {
        return true; // Item-specific permission found, proceed
      }
    }
    return false;
  }

  protected async afterCreateOne?(item: T, req: Request): Promise<void>;
  protected async afterReadOne?(item: T, req: Request): Promise<void>;
  protected async afterReadAll?(items: T[], req: Request): Promise<void>;
  protected async afterUpdateOne?(item: T, req: Request): Promise<void>;
  protected async afterDeleteOne?(item: T, req: Request): Promise<void>;
}
