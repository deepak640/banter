export interface IMessage {
  _id: string;
  conversationId: string;
  type: string;
  userId: string;
  createdAt: string;
  text: string;
  imageUrl?: string;
  hashId: string;
}


export type PartialMessage = Partial<IMessage>;
