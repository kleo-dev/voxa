export interface Channel {
  id: string;
  name: string;
  kind: "text" | "voice";
}

export interface Message {
  id: number;
  channel_id: string | number;
  from: number;
  contents: string;
  timestamp: number;
}

export interface Server {
  id: string;
  name: string;
  channels: Channel[];
}
