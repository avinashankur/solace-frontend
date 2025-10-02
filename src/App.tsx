import Calendar from "./components/Calendar";
import Features from "./components/Features";
import ChatBot from "./components/ChatBot";
import { useState } from "react";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <main className="mx-auto max-w-4xl mt-10">
      <Calendar completedDays={4} />
      <Features onChatClick={() => setShowChat(true)} />
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </main>
  );
}

export default App;
