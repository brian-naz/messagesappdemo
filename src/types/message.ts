export type Message = {
  id: string;
  text: string;
  sender: "me" | "bot";
  timestamp: number;
};
