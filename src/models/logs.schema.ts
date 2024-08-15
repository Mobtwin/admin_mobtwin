import { Schema, model, Document, Model } from "mongoose";

// Define an interface representing a snapshot in the email logs
export interface ISnapshot {
  userName: string;
  firstName: string;
  lastName: string;
  plan: string;
  is2faActive: boolean;
}

// Define an interface representing an email log document in MongoDB
export interface IEmailLog extends Document {
  timestamp: Date;
  userId: Schema.Types.ObjectId;
  snapshot: ISnapshot;
  oldEmail: string;
  newEmail: string;
}

// Define the schema corresponding to the document interface
const emailLogsSchema = new Schema<IEmailLog>({
  timestamp: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  snapshot: {
    type: {
      userName: String,
      firstName: String,
      lastName: String,
      plan: String,
      is2faActive: Boolean,
      
    },

    required: true
  },
  oldEmail: { type: String, required: true },
  newEmail: { type: String, required: true }
});

// Create a model
export const EmailLogs: Model<IEmailLog> = model<IEmailLog>('EmailLogs', emailLogsSchema);