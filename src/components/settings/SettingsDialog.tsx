import { SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import Settings from "./Settings";
import { ProfileSettings } from "@/types/settings";
import { ReactNode, useState } from "react";

export default function SettingsDialog({
  className,
  tab,
  profile,
  children,
}: {
  className?: string;
  tab?: string;
  profile: ProfileSettings;
  children?: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            className={cn(
              "bg-transparent text-accent-foreground hover:text-accent",
              className
            )}
          >
            <SettingsIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <Settings tab={tab} profileSettings={profile} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
