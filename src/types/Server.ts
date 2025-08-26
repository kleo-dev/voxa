import Channel from "./channel";

export default interface Server {
  id: string;
  name: string;
  channels: Channel[];
}
