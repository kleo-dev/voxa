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
import { useState } from "react";

export default function SettingsDialog({
  className,
  tab,
  profile,
}: {
  className?: string;
  tab?: string;
  profile: ProfileSettings;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "bg-transparent text-accent-foreground hover:text-accent",
            className
          )}
        >
          <SettingsIcon />
        </Button>
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
