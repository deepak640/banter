export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  hashId: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo: string;
  lastActive: string;
}

export type PartialUser = Partial<IUser>;
