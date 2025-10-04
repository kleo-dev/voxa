export default interface Message {
  id: number;
  channel_id: string | number;
  from: number;
  contents: string;
  timestamp: number;
}
