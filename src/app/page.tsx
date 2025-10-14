"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <motion.img
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
          src="/voxa.svg"
        />
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button onClick={() => router.push("/signup")}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
        >
          Chat. Connect. Collaborate.
        </motion.h2>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          A modern chat app for teams and friends. Stay connected with real-time
          messaging, secure channels, and seamless collaboration.
        </p>
        <div className="flex gap-3">
          <Button size="lg" onClick={() => router.push("/signup")}>
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/docs/introduction")}
          >
            Learn More
          </Button>
        </div>
      </main>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-16 max-w-6xl mx-auto">
        <FeatureCard
          icon={<MessageCircle className="h-10 w-10 text-primary" />}
          title="Real-Time Chat"
          description="Experience instant messaging with typing indicators, read receipts, and more with our self-hostable node system."
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-primary" />}
          title="Group Channels"
          description="Organize conversations into channels for projects, teams, or friends by hosting your own server."
        />
        <FeatureCard
          icon={<Shield className="h-10 w-10 text-primary" />}
          title="Secure & Private"
          description="Your data is encrypted and protected, ensuring safe communication."
        />
      </section>

      {/* Call to Action */}
      {/* <section className="bg-muted py-20 px-6 text-center">
        <h3 className="text-3xl font-semibold mb-4">
          Ready to start chatting?
        </h3>
        <p className="text-muted-foreground mb-6">
          Create your free account today and bring your conversations together.
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <Input placeholder="Enter your email" />
          <Button>Sign Up</Button>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="px-6 py-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Voxa. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex flex-col items-center text-center">
        {icon}
        <h4 className="mt-4 font-semibold text-xl">{title}</h4>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
