export interface SearchboxProps {
  setInput: (input: string) => void;
  value: string;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
