import { Button } from "./ui/button";
import { Input } from "./ui/input";

function Message() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-400" />
        <div className="flex flex-col">
          <span className="font-bold">User</span>
          <span className="text-sm text-gray-500">
            Hello, this is a message!
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MessageBox() {
  return (
    <div className="h-screen w-full flex flex-col p-5">
      <div className="w-full flex-1 overflow-y-scroll flex flex-col gap-2">
        {Array.from({ length: 50 }).map((_, i) => (
          <Message key={i} />
        ))}
      </div>
      <div className="w-full flex gap-3">
        <Input className="" placeholder="Type a message..." />
        <Button>Send</Button>
      </div>
    </div>
  );
}
