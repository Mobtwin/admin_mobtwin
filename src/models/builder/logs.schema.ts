import { model, Schema, Document, Model } from "mongoose";

export const BUILD_INFO_TYPES = ["Prebuilding", "Building", "Configuration", "Signing", "Generation", "Failed"];
export const LOG_MESSAGE_STATUS = ["Warning", "Info"];

export interface logMessage {
    status: "Warning" | "Info" | "Error" | "Failed" ;
    message: string;
}

export interface BuildInfo {
  type:
    | "Prebuilding"
    | "Building"
    | "Configuration"
    | "Signing"
    | "Generation"
    | "Failed"
    | "Error";
  progress?: number;
  loading?: boolean;
  completed?: boolean;
  logs: logMessage[];
  message?: string;
}

// Define TypeScript interfaces for the schemas
export interface IAppLogs extends Document {
    userId: Schema.Types.ObjectId;
    appId: Schema.Types.ObjectId;
    logs: BuildInfo[];
    created_at: Date;
}

const LogMessageSchema = new Schema<logMessage>({
    status: { type: String, required: true, enum: LOG_MESSAGE_STATUS },
    message: String
},{_id: false});

const BuildInfoSchema = new Schema<BuildInfo>({
    type: { type: String, required: true, enum: BUILD_INFO_TYPES },
    progress: { type: Number, required: true ,max:100,min:0 },
    loading: { type: Boolean },
    completed: { type: Boolean },
    logs: [LogMessageSchema],
    message: {type:String}
},{_id: false});

const AppLogsSchema = new Schema<IAppLogs>({
    userId: { type: Schema.Types.ObjectId, required: true },
    appId: { type: Schema.Types.ObjectId, required: true },
    logs: [BuildInfoSchema],
    created_at: { type: Date, default: Date.now }
});

// Create an index on the userId and appId field.
AppLogsSchema.index({ userId: 1});
AppLogsSchema.index({ appId: 1 });

// Create the model

export const AppLogs: Model<IAppLogs> = model<IAppLogs>("AppLogs", AppLogsSchema);

