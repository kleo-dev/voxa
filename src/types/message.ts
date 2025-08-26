export default interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: Date;
}
