"use client";

import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CreateAccount from "./CreateAccount";
import Login from "./Login";

export default function Auth({ kind }: { kind: "login" | "create" }) {
  return (
    <div className="h-screen flex items-center">
      <Tabs defaultValue={kind} className="mx-auto">
        <TabsList className="mx-auto">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="w-md">
            <Login />
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card className="w-md">
            <CreateAccount />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
