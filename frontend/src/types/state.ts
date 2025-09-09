export interface Message {
  text: string;
  userId?: string;
  conversationId?: string;
  hashId: string;
  imageUrl?: string;
  type?: string;
}
