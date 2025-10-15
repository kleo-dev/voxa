"use client";

import AppSidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useApp from "@/hooks/use-app";

export default function Chat() {
  const app = useApp();

  return (
    <AppSidebar app={app}>
      <Card className="bg-background w-full">
        <CardHeader>
          <CardTitle>Direct Messages</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </AppSidebar>
  );
}
