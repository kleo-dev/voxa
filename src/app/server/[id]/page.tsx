import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";

export default async function Server(params: {params: Promise<{ id: string }>}) {
  const { id } = await params.params;

  return (
    <AppSidebar server={{
      id: 'bro',
      name: 'Bro',
      channels: [
        { id: '1', name: 'general', kind: 'text' },
        { id: '2', name: 'random', kind: 'text' },
        { id: '3', name: 'help', kind: 'text' },
        { id: '4', name: 'voice-chat', kind: 'voice' },
      ]
    }}>
      <MessageBox />
      <MessageBox />
    </AppSidebar>
  );
}
