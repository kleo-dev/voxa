export default interface Message {
  id: number;
  channel_id: string;
  from: number;
  contents: string;
  timestamp: number;
}
