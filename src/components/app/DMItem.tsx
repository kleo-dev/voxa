"use client";

import Link from "next/link";
import ProfilePicture from "../ProfilePicture";
import SettingsDialog from "../settings/SettingsDialog";
import App from "@/types/app";
import { ProfileSettings } from "@/types/settings";

export default function DMItem({
  name,
  id,
  avatar,
  status,
  settings,
  app,
}: {
  name: string;
  id: string;
  avatar: string;
  status: string;
  settings?: boolean;
  app: App;
}) {
  return (
    <Link
      href={settings ? "" : `/chat/${id}`}
      className="p-2 flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md"
    >
      <ProfilePicture name={name} url={avatar} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
      {settings && (
        <SettingsDialog
          className="ml-auto w-7 h-7 p-0 flex items-center justify-center"
          tab="profile"
          profile={app.profile as ProfileSettings}
        />
      )}
    </Link>
  );
}
