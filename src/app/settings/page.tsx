"use client";

import { useAccountSettings, useClientSettings } from "@/hooks/use-settings";
import { setClientSettings } from "@/lib/clientSettings";
import Settings from "./settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { ACCOUNT_SCHEMA, CLIENT_SCHEMA } from "@/types/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useClientSettings();
  const [accountSettings, setAccountSettings] = useAccountSettings();

  return (
    <Tabs className="mx-auto" defaultValue="client">
      <TabsList className="mx-auto">
        <TabsTrigger value="client">Client Settings</TabsTrigger>
        <TabsTrigger value="account">Account Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="client">
        <Card className="w-xl mx-auto">
          <CardContent className="flex flex-col gap-3">
            <Settings
              settings={settings}
              setSettings={setSettings}
              schema={CLIENT_SCHEMA}
              onSave={() => setClientSettings(settings)}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="account">
        <Card className="w-xl mx-auto">
          <CardContent className="flex flex-col gap-3">
            <Settings
              settings={accountSettings}
              setSettings={setAccountSettings}
              schema={ACCOUNT_SCHEMA}
              onSave={() => {}}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
