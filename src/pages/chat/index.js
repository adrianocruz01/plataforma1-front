import ChatComponent from '@/components/ChatComponent';

const ChatPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold mt-8 mb-4 text-center text-white">
        Chat Inspirado no WhatsApp
      </h1>
      <div className="max-w-7xl mx-auto">
        <ChatComponent />
      </div>
    </div>
  );
};

export default ChatPage;
