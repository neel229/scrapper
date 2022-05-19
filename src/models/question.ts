import { Document, model, Schema } from "mongoose";

export interface IQuestion extends Document {
	title: string;
	queId: number;
	upvotes: string;
	answerCount: string;
	url: string;
	referenceCount: number;
	createdAt: Date;
}

const questionSchema = new Schema({
	title: {
		type: String
	},
	queId: {
		type: Number
	},
	upvotes: {
		type: String
	},
	answerCount: {
		type: String
	},
	url: {
		type: String
	},
	referenceCount: {
		type: Number
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

export const Question = model<IQuestion>("Question", questionSchema);
