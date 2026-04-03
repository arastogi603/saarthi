import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router"; // Ensure 'react-router-dom'
import { Sidebar } from "./components/sidebar"; // Import your Sidebar
import HomePage from "./pages/HomePage";
import { SaarthiBuddyEngine } from "./pages/BuddyMatchPage";
import { SessionsPage } from "./pages/SessionPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
import { MainPage } from "./pages/MainPage";
import { ChatPage } from "./pages/ChatPage";
import MatchesPage from "./pages/MatchesPage";
import { ChatProvider } from "./context/ChatContext";
import { SidebarProvider } from "./context/SidebarContext";
import { MobileHeader } from "./components/MobileHeader";

const App: React.FC = () => {
  return (
    <Router>
      <ChatProvider>
        <SidebarProvider>
          <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 dark:bg-gray-950 items-center overflow-hidden">
            <MobileHeader />
            <Sidebar />
            <main className="flex-1 w-full h-full overflow-y-auto pl-0 md:pl-6">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat/:roomId?" element={<ChatPage />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/me" element={<ProfilePage />} />
            <Route path="/connect" element={<SaarthiBuddyEngine />} />
          </Routes>
            </main>
          </div>
        </SidebarProvider>
      </ChatProvider>
    </Router>
  );
};

export default App;
