"use client";
import { useEffect } from "react";
import { useAblyRoom } from "@/hooks/useWebsocket";
import FileUploadCard from "@/components/FileUploadCard";
import ReceiveCard from "@/components/ReceiveCard";
import { useFileContext } from "@/context/SelectedFileContext";
import PeerIdCard from "@/components/PeerIdCard";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  const {
    channelRef,
    currentRoomId,
    joinRoom,
    senderProgress,
    setSenderProgress,
    userId,
    isJoined,
    setIsJoined,
    leaveRoom,
    connectingToPeer,
    setConnectingToPeer,
  } = useAblyRoom();
  const { file } = useFileContext();

  useEffect(() => {
    if (file) {
      setSenderProgress(0);
      leaveRoom();
      joinRoom();
    }
    return () => {
      if (channelRef.current) {
        channelRef.current.detach();
      }
    };
  }, [file]);

  return (
    <main className="flex flex-col gap-[32px] lg:pt-28 pt-24 items-center justify-start bg-background min-h-screen overflow-auto">
      <Toaster
        toastOptions={{
          className: "",
          duration: 1500,
          style: {
            background: "#7287fd",
            color: "#cdd6f4",
          },
        }}
      />
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-8 md:gap-8 items-start justify-start w-full h-full px-4 sm:px-8 md:px-12 xl:px-[10%] 2xl:px-64">
        <section className="md:col-span-5 flex flex-col md:text-left mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Secure <span className="text-mocha-mauve">P2P</span> File Sharing
          </h1>
          <p className="text-mocha-subtext0 max-w-xl md:mx-0 text-base md:text-lg">
            Send files directly to device without server storage. Fast, secure,
            and private.
          </p>
          <div className="mt-6 sm:mt-8">
            <FileUploadCard
              progress={senderProgress}
              isDisabled={isJoined && !file} // Joined and no file means receiver
            />
          </div>
        </section>
        <div className="w-full mt-4 md:mt-8 md:col-span-3 self-end">
          {!file ? (
            <ReceiveCard
              className="w-full"
              joinRoom={joinRoom}
              channelRef={channelRef}
              userId={userId}
              isJoined={isJoined}
              setIsJoined={setIsJoined}
              leaveRoom={leaveRoom}
              connectingToPeer={connectingToPeer}
              setConnectingToPeer={setConnectingToPeer}
            />
          ) : (
            <PeerIdCard
              className="w-full mt-4 md:mt-8 md:col-span-3 md:self-end md:mb-20 px-4"
              roomId={currentRoomId}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
