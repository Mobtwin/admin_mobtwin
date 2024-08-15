import { Schema, model, Document, Model } from "mongoose";

// Define an interface representing a line item in the invoice
export interface ILineItem {
  description: string;
  amount: number;
}

// Define an interface representing an invoice document in MongoDB
export interface IInvoice extends Document {
  invoiceId: string;
  paymentIntentId: string;
  subscriptionId: Schema.Types.ObjectId;
  amount: number;
  periodStart: Date;
  periodEnd: Date;
  lines: ILineItem[];
  status: string;
  created_at: Date;
}

// Define the schema corresponding to the document interface
const invoiceSchema = new Schema<IInvoice>({
  invoiceId: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  subscriptionId: { type: Schema.Types.ObjectId, required: true, ref: 'Subscription' },
  amount: { type: Number, required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  lines: [{
    description: String,
    amount: Number,
  }],
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Create an index on multiple fields for better query performance
invoiceSchema.index({ invoiceId: 1, subscriptionId: 1, amount: 1, periodStart: 1, periodEnd: 1, status: 1 });

// Create a model
export const Invoices: Model<IInvoice> = model<IInvoice>('Invoices', invoiceSchema);
