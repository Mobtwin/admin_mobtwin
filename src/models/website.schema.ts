import { Model, Schema, model } from "mongoose";


export interface IWebsiteApp{
    name: string;
    icon:string;
    link: string;
}

export interface IWebsite extends Document {
    userId: string;
    devName: string;
    devIcon: string;
    apps: IWebsiteApp[];
    created_at: Date;
    updated_at: Date;
    removed_at?: Date;
}

const websiteAppSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    link: { type: String, required: true }
},{_id:false});

const websiteSchema = new Schema({
    userId: { type: String, required: true },
    devName: { type: String, required: true },
    devIcon: { type: String, required: true },
    apps: [websiteAppSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    removed_at: { type: Date, default: null }
});

export const Website:Model<IWebsite> = model<IWebsite>('Website', websiteSchema);


