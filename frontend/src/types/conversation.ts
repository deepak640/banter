export interface IConversation {
  _id: string;
  participants: string[];
  isGroup: boolean;
  lastMessage: string;
  createdAt: Date;
  updateAt: Date;
}

export type PartialConversation = Partial<IConversation>;


export interface IUserSummary {
  _id: string;
  name: string;
  photo: string;
  lastActive: string;
}
