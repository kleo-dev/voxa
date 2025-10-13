"use client";

import { useProfileSettings, useClientSettings } from "@/hooks/use-settings";
import { setClientSettings } from "@/lib/clientSettings";
import Settings from "./settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { PROFILE_SCHEMA, CLIENT_SCHEMA } from "@/types/settings";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftCircle } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useClientSettings();
  const [profileSettings, setProfileSettings] = useProfileSettings();
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div>
      <Button
        variant="outline"
        className="ml-2 mt-2"
        onClick={() => router.back()}
      >
        <ChevronLeftCircle />
      </Button>
      <Tabs
        className="mx-auto mt-3"
        defaultValue={params.get("tab") || "client"}
      >
        <TabsList className="mx-auto">
          <TabsTrigger value="client">Client Settings</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="client">
          <Card className="w-xl mx-auto">
            <CardContent className="flex flex-col gap-3">
              <Settings
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
          <Card className="w-xl mx-auto">
            <CardContent className="flex flex-col gap-3">
              <Settings
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
    </div>
  );
}
