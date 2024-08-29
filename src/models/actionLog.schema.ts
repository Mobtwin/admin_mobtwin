import { Schema, model, Document } from 'mongoose';


export enum PerformedBy {
    USER = 'User',
    ADMIN = 'Admin',
}

export interface IActionLog {
    actionType: string;
    performedBy: PerformedBy;
    userId?: Schema.Types.ObjectId;
    adminId?: Schema.Types.ObjectId;
    table: string;
    itemId?: Schema.Types.ObjectId;
    description: string;
}

export interface IActionLogDocument extends Document,IActionLog {};

const ActionLogSchema = new Schema<IActionLogDocument>({
    actionType: {
        type: String,
        required: true,
    },
    performedBy: {
        type: String,
        enum: Object.values(PerformedBy),
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: function (this: IActionLogDocument) {
            return this.performedBy === PerformedBy.USER;
        },
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin', // Assuming your admin model is named 'Admin'
        required: function (this: IActionLogDocument) {
            return this.performedBy === PerformedBy.ADMIN;
        },
    },
    table: {
        type: String,
        required: true,
    },
    itemId: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    description: {
        type: String,
        default: null,
    }
},{timestamps: true});

const ActionLog = model<IActionLogDocument>('Action', ActionLogSchema);

export default ActionLog;
