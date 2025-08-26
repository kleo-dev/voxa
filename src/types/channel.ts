export default interface Channel {
  id: string;
  name: string;
  kind: "text" | "voice";
}