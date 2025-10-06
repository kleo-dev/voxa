import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfilePicture({ name }: { name: string }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/kleo-dev.png" alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}
