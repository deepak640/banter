export interface Message {
  text: string;
  // sender: "user" | "bot";
  userId?: string;
  conversationId?: string;
  hashId: string;
}
