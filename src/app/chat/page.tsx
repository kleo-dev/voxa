"use client";

import AppSidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/is-mobile";
import useApp from "@/hooks/use-app";

export default function Chat() {
  const app = useApp();
  const isMobile = useIsMobile();

  return (
    <AppSidebar app={app}>
      <Card className="bg-background w-full">
        <CardHeader>
          <CardTitle onClick={() => isMobile && app.setSidebarOpen(true)}>
            Direct Messages
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </AppSidebar>
  );
}
