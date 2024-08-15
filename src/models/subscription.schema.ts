import { Schema, model, Document, Types, Model } from "mongoose";

export interface ISubscription extends Document {
  _id: string;
  userId: Types.ObjectId;
  customerId: string;
  email?: string;
  plan?: string;
  schedulerId?: string;
  schedulerEndsAt?: Date;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  created_at: Date;
  updated_at: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  _id: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  customerId: { type: String, required: true },
  email: { type: String },
  plan: { type: String },
  schedulerId: { type: String },
  schedulerEndsAt: { type: Date },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ customerId: 1 });
subscriptionSchema.index({ email: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ startDate: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ schedulerEndsAt: 1 });

export const Subscriptions:Model<ISubscription> = model<ISubscription>('Subscription', subscriptionSchema);
