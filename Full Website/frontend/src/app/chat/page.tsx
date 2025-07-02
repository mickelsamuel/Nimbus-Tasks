import ProtectedLayout from '@/components/layout/ProtectedLayout';
import ChatInterface from './ChatInterface';

export default function ChatPage() {
  return (
    <ProtectedLayout>
      <ChatInterface />
    </ProtectedLayout>
  );
}