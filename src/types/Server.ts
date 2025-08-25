export interface Channel {
  id: string;
  name: string;
  kind: "text" | "voice";
}

export default interface Server {
  id: string;
  name: string;
  channels: Channel[];
}