import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfilePicture({
  name,
  url,
}: {
  name: string;
  url: string | undefined;
}) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={url} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}
