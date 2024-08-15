import { Schema, Document, Model, model } from "mongoose";
import { AppsBuild,IAppsBuild } from "../apps.schema";

// Interface for Fake Call User
export interface IFakeCallUser {
    icon: string;
    username: string;
    phoneNumber: string;
}

// Interface for Fake Call App Document
export interface IFakeCallApp extends IAppsBuild {
    users: IFakeCallUser[];
}

// Schema for Fake Call User
const FakeCallUserSchema = new Schema<IFakeCallUser>({
    icon: { type: String, required: true },
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true }
}, { _id: false });

// Schema for Fake Call App
const FakeCallAppsSchema = new Schema<IFakeCallApp>({
    users: { type: [FakeCallUserSchema], required: true }
});

// Model for Fake Call App using discriminator
export const FakeCallApps = AppsBuild.discriminator<IFakeCallApp & Document>(
    "FakeCallApps",
    FakeCallAppsSchema
);
