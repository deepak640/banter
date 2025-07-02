import { Schema, Types, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  status: boolean;
  photo: string;
  hashId: string;
  createdAt: Date;
  updateAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    status: Boolean,
    password: String,
    photo: String,
    hashId: String,
    // And `Schema.Types.ObjectId` in the schema definition.
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
