export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
}

export interface credentials {
  email: string;
  password: string;
  name?: string;
}
