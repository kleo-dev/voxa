"use client";

import { useClientSettings } from "@/hooks/use-settings";
import { setClientSettings } from "@/lib/clientSettings";
import SettingSchema from "./SettingSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import {
  PROFILE_SCHEMA,
  CLIENT_SCHEMA,
  ProfileSettings,
} from "@/types/settings";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function Settings({
  tab,
  profileSettings,
  setProfileSettings,
}: {
  tab?: string;
  profileSettings: ProfileSettings;
  setProfileSettings: React.Dispatch<React.SetStateAction<ProfileSettings>>;
}) {
  const [settings, setSettings] = useClientSettings();
  const router = useRouter();

  return (
    <Tabs className="mx-auto mt-3" defaultValue={tab || "client"}>
      <TabsList className="mx-auto">
        <TabsTrigger value="client">Client Settings</TabsTrigger>
        <TabsTrigger value="profile">Profile Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="client">
        <Card className="mx-auto">
          <CardContent className="flex flex-col gap-3">
            <SettingSchema
              settings={settings}
              setSettings={setSettings}
              schema={CLIENT_SCHEMA}
              onSave={() => {
                setClientSettings(settings);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="profile">
        <Card className="mx-auto">
          <CardContent className="flex flex-col gap-3">
            <SettingSchema
              settings={profileSettings}
              setSettings={setProfileSettings}
              schema={PROFILE_SCHEMA}
              onSave={async () => {
                await axios.post("/api/profile", profileSettings);
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
