import { Schema, model, Document } from "mongoose";
import { AppsBuild, IAppsBuild } from "../apps.schema";

// TypeScript interfaces for the schemas
export interface IAnswer {
    answer?: string;
    isCorrect?: boolean;
}

export interface IQuiz {
    icon?: string;
    question?: string;
    answers?: IAnswer[];
}

export interface IQuizApps extends IAppsBuild {
    quizes?: IQuiz[];
}

// Mongoose schemas
const AnswerSchema = new Schema<IAnswer>({
    answer: { type: String },
    isCorrect: { type: Boolean }
}, { _id: false });

const QuizSchema = new Schema<IQuiz>({
    icon: { type: String },
    question: { type: String },
    answers: { type: [AnswerSchema] }
}, { _id: false });

const QuizAppsSchema = new Schema<IQuizApps>({
    quizes: { type: [QuizSchema] }
});

// Discriminator model
export const QuizApps = AppsBuild.discriminator<IQuizApps & Document>("QuizApps", QuizAppsSchema);
