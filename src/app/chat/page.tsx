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
  ChevronRight,
  MessageCircle,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import StartNewDM from "./StartNewDM";
import AsyncValue from "@/components/AsyncValue";

export default function ChatHub() {
  const app = useApp();

  const recentDMs = app.dms?.slice(0, 5) || [];
  const activeServers: Server[] = Object.values(app.servers).slice(0, 5) || [];
  const suggestedServers: Server[] = [
    { id: "1", name: "Frontend Devs", icon_url: "", channels: [] },
    { id: "2", name: "Gamers Lounge", icon_url: "", channels: [] },
    { id: "3", name: "Music Hub", icon_url: "", channels: [] },
  ];
  const recentActivity = app.messages.slice(0, 5);

  const stats = {
    dms: app.dms?.length || 0,
    servers: app.servers?.length || 0,
    // friends: app.friends?.length || 0,
  };

  return (
    <AppLayout app={app}>
      <div className="h-svh w-full max-h-svh flex flex-col py-6 px-5 md:px-10 gap-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-10"
        >
          {/* Greeting */}
          <div onClick={() => app.setSidebarOpen(true)}>
            <h1 className="text-3xl font-bold flex cursor-pointer gap-2">
              <ChevronLeft className="my-auto w-5 md:hidden" />
              Hey {app.profile?.display_name || "there"}!
            </h1>
            <p className="text-muted-foreground">
              Here’s what’s happening in your network today.
            </p>
          </div>

          {/* Recent DMs + Active Servers */}
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
                      className="flex justify-between items-center hover:bg-accent hover:text-accent-foreground rounded p-2 transition"
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
                      className="flex justify-between items-center hover:bg-accent hover:text-accent-foreground rounded p-2 transition"
                    >
                      <span className="flex gap-2">
                        <ProfilePicture
                          name={srv.name}
                          url={srv.icon_url || ""}
                        />
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

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length ? (
                recentActivity.map((msg) => (
                  <AsyncValue
                    key={msg.id + msg.channel_id}
                    func={() => app.getUserById(msg.from)}
                    render={({ value: user }) => (
                      <Link
                        href={`/chat/${msg.from}`}
                        className="flex items-center justify-between hover:bg-accent rounded p-2 transition"
                      >
                        <div className="flex items-center gap-3">
                          <ProfilePicture
                            name={user?.display_name || ""}
                            url={user?.avatar_url || ""}
                          />
                          <div>
                            <p className="font-medium">
                              {user?.display_name || ""}
                            </p>
                            <p className="text-sm text-muted-foreground truncate w-[200px]">
                              {msg.contents}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="opacity-70 w-4 h-4" />
                      </Link>
                    )}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent messages yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Server Discovery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Discover Servers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedServers.map((srv) => (
                  <motion.div
                    key={srv.id}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="hover:bg-accent transition">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                        <ProfilePicture name={srv.name} url={srv.icon_url} />
                        <h3 className="font-medium truncate">{srv.name}</h3>
                        <Button size="sm" className="gap-2">
                          <PlusCircle className="w-4 h-4" />
                          Join
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Quick Actions */}
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-wrap gap-3">
              <StartNewDM />
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
