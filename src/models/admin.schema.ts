import { Document, model, Model, Schema } from "mongoose";


export interface IAdmin extends Document {
    userName: string;
    email: string;
    role: "admin" | "maintainer";
    password: string;
    removed_at?: Date;
    created_at: Date;
    updated_at: Date;
}

const AdminSchema = new Schema<IAdmin>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "maintainer"], default: "maintainer" },
    removed_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const Admins:Model<IAdmin> = model<IAdmin>('Admin', AdminSchema);