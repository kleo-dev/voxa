"use client";

import ProfilePicture from "@/components/ProfilePicture";
import SettingsDialog from "@/components/settings/SettingsDialog";
import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useApp from "@/hooks/use-app";
import { ProfileSettings } from "@/types/settings";
import { Server } from "@/types/types";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  MessageCircle,
  Users,
  PlusCircle,
  Settings,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ChatHub() {
  const app = useApp();

  const recentDMs = app.dms?.slice(0, 5) || [];
  // const activeServers = app.servers?.slice(0, 5) || [];
  const activeServers: Server[] = [];

  return (
    <AppLayout app={app}>
      <div className="h-svh w-full max-h-svh flex flex-col py-5 px-5 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <div onClick={() => app.setSidebarOpen(true)}>
            <h1 className="text-3xl font-bold flex cursor-pointer gap-2">
              <ChevronLeft className="my-auto w-5 md:hidden" />
              Hey {app.profile?.display_name || "there"}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening in your network today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent DMs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent DMs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentDMs.length ? (
                  recentDMs.map((dm) => (
                    <Link
                      href={`/chat/${dm.id}`}
                      key={dm.id}
                      className="flex justify-between items-center hover:bg-accent hover:text-accent-foreground rounded p-1"
                    >
                      <span className="flex gap-2">
                        <ProfilePicture
                          name={dm.display_name}
                          url={dm.avatar_url}
                        />
                        <span className="truncate my-auto">
                          {dm.display_name || dm.id}
                        </span>
                      </span>
                      <ChevronRight />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent DMs yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Active Servers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Servers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeServers.length ? (
                  activeServers.map((srv) => (
                    <Link
                      href={`/server/${srv.id}`}
                      key={srv.id}
                      className="flex justify-between items-center hover:bg-accent hover:text-accent-foreground rounded p-1"
                    >
                      <span className="flex gap-2">
                        <ProfilePicture name={srv.name} url="" />
                        <span className="truncate my-auto">{srv.name}</span>
                      </span>
                      <ChevronRight />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No servers joined yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Start New DM
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Create Server
              </Button>
              <SettingsDialog profile={app.profile as ProfileSettings}>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </SettingsDialog>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
