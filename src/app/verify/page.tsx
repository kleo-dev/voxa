"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";

export default function Verify() {
  const [email, setEmail] = useState<string>();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const email = Cookies.get("verify_temp_email");
    setEmail(email);
    const password = Cookies.get("verify_temp_password");

    const i = setInterval(async () => {
      const { data } = await axios.get("/api/verify", {
        params: { email, password },
      });
      const response = data as {
        verified: boolean;
        user_id: string;
        access_token?: string;
        refresh_token?: string;
      };
      if (response.verified) {
        clearInterval(i);
        if (response.access_token && response.refresh_token) {
          setVerified(true);
          toast.info("Email verified, redirecting...");
          Cookies.set("token", response.access_token);
          Cookies.set("refresh_token", response.refresh_token);
          Cookies.remove("verify_temp_email");
          Cookies.remove("verify_temp_password");
          setTimeout(() => router.push("/chat"), 500);
        } else {
          console.log(response);
        }
      }
    }, 8000);
  }, []);

  return (
    <div className="h-screen flex items-center">
      <Card className="w-md m-auto">
        <CardHeader>
          <CardTitle className="text-3xl mx-auto">Verify Email</CardTitle>
          <CardDescription>
            {verified ? (
              "Successfully verified"
            ) : (
              <>
                We sent you a verification email at {email}. Please verify to
                continue.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-3 flex flex-col">
          Current status: {verified ? "Verified" : "Unverified"}
        </CardContent>
      </Card>
    </div>
  );
}
