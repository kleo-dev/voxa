import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";

export default async function Server(params: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params.params;

  return (
    <AppSidebar
      server={{
        id: "bro",
        name: "Bro",
        channels: [
          { id: "1", name: "general", kind: "text" },
          { id: "2", name: "random", kind: "text" },
          { id: "3", name: "help", kind: "text" },
          { id: "4", name: "voice-chat", kind: "voice" },
        ],
      }}
    >
      <MessageBox
        messages={[
          {
            id: "1",
            authorId: "user1",
            content: `# Test\n### Hello World\n\nThis is a **markdown** message with _various_ elements:\n\n- Item 1\n- Item 2\n- Item 3\n\n[Click here](https://example.com) for more info.\n\n1. First\n2. Second\n3. Third`,
            channelId: "1",
            timestamp: new Date(),
          },
        ]}
      />
    </AppSidebar>
  );
}
