"use client";

import AppSidebar from "@/components/Sidebar";
import MessageBox from "@/components/MessageBox";
import useUser from "@/hooks/get-user";

export default function HomePage() {
  const { user, loading } = useUser();

  return (
    <AppSidebar user={user}>
      <MessageBox
        channelName="Alice"
        messages={[]}
        userList={[]}
        setUserList={() => {}}
        sendMessage={() => {}}
      />
    </AppSidebar>
  );
}
