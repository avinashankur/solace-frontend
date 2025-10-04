import Calendar from "./components/Calendar";
import Features from "./components/Features";
import ChatBot from "./components/ChatBot";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { ArrowRight, Bot } from "lucide-react";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <img src="/bg.svg" alt="bg" className="absolute top-0 left-0" />
      <img src="/maitri.svg" alt="Maitri" className="absolute top-15 left-1/2 -translate-x-1/2" />
      <main className="mx-auto max-w-6xl mt-46">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 z-10 relative">
          <div className="space-y-5">
            <Calendar completedDays={4} />
            <Features onChatClick={() => setShowChat(true)} />
          </div>
          <div className="overflow-hidden rounded-xl col-span-2 relative shadow-custom-sh">
            <div className="flex items-center gap-2 border-b border-border bg-secondary w-full px-5 py-3">
              <div className="rounded-md bg-white p-1.5 text-muted-foreground">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="font-medium">Chat with Maitri</span>
            </div>

            <div className="flex flex-col items-center justify-center h-[80%]">
              <div className="p-5">
                <p className="text-sm mb-4 text-muted-foreground">
                  Your companion is here when you need a thoughtful
                  conversation.
                </p>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowChat(true)}
                      className="gap-2 bg-accent border-border"
                      variant="outline"
                    >
                      <span>Open chat</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {showChat && (
              <ChatBot onClose={() => setShowChat(false)} title="Maitri" />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
