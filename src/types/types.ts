export interface Channel {
  id: string;
  name: string;
  kind: "text" | "voice";
}

export interface Message {
  id: number;
  channel_id: string;
  from: string;
  contents: string;
  timestamp: number;
}

export interface Server {
  id: string;
  name: string;
  icon_url: string;
  channels: Channel[];
}
