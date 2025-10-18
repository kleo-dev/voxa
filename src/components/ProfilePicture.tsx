import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfilePicture({
  name,
  url,
  className,
}: {
  name: string;
  url: string | undefined;
  className?: string;
}) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src={url} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}
