"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAccount from "./CreateAccount";
import Login from "./Login";
import { useSearchParams } from "next/navigation";

export default function Auth() {
  const params = useSearchParams();
  const pt = params.get("t");
  const tab = pt === "create" || pt === "login" ? pt : "create";

  return (
    <div className="h-svh w-svw flex items-center">
      <Tabs defaultValue={tab} className="mx-auto">
        <TabsList className="mx-auto">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="w-svw p-5 md:p-0 md:w-max">
          <Card className="w-full md:w-md">
            <Login />
          </Card>
        </TabsContent>
        <TabsContent value="create" className="w-svw p-5 md:p-0 md:w-max">
          <Card className="w-full md:w-md">
            <CreateAccount />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
