
import React from "react";
import DebugWrapper from "@/components/DebugWrapper";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AIFeatures from "@/components/AIFeatures";
import FeatureShowcase from "@/components/FeatureShowcase";
import Testimonials from "@/components/Testimonials";
import SponsorsWallOfFame from "@/components/SponsorsWallOfFame";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAUpdateNotifier from "@/components/pwa/PWAUpdateNotifier";
import NotesContent from "@/components/notes/NotesContent";
import { useAuthenticatedSupabaseNotes } from "@/hooks/useAuthenticatedSupabaseNotes";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const noteHookData = useAuthenticatedSupabaseNotes();

  // If user is authenticated, show the notes interface
  if (user) {
    return (
      <DebugWrapper componentName="Index">
        <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
          <Header />
          <NotesContent 
            notes={noteHookData.allNotes}
            searchQuery=""
            sortOrder="newest"
            filterType="all"
            customNoteNames={{}}
            formatNoteId={(id: string) => id}
            activeNoteId={noteHookData.currentNoteId || ""}
            onLoadNote={(noteId: string) => {
              const noteContent = noteHookData.allNotes[noteId];
              if (noteContent) {
                noteHookData.handleLoadNote(noteId, noteContent);
              }
            }}
            onDeleteNote={(noteId: string, e: React.MouseEvent) => {
              e.stopPropagation();
              return noteHookData.handleDeleteNote(noteId);
            }}
            onOpenShare={(noteId: string) => {
              console.log("Share note:", noteId);
            }}
            onRenameNote={async (oldNoteId: string, newNoteId: string) => {
              // For now, just return false as rename is not implemented
              return false;
            }}
          />
          <PWAInstaller />
          <PWAUpdateNotifier />
        </div>
      </DebugWrapper>
    );
  }

  // If not authenticated, show the landing page
  return (
    <DebugWrapper componentName="Index">
      <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518]">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <AIFeatures />
        <FeatureShowcase />
        <Testimonials />
        <SponsorsWallOfFame />
        <Footer />
        <PWAInstaller />
        <PWAUpdateNotifier />
      </div>
    </DebugWrapper>
  );
};

export default Index;
