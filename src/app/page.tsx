"use client";
import { useEffect, useState } from "react";
import { useAblyRoom } from "@/hooks/useWebsocket";
import FileUploadCard from "@/components/FileUploadCard";
import Header from "@/components/Header";
import ReceiveCard from "@/components/ReceiveCard";
import { useFileContext } from "@/context/SelectedFileContext";
import PeerIdCard from "@/components/PeerIdCard";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { channelRef, currentRoomId, joinRoom } = useAblyRoom();
  const { file } = useFileContext();

  useEffect(() => {
    if (file) {
      joinRoom();
    }
    return () => {
      if (channelRef.current) {
        channelRef.current.detach();
      }
    };
  }, [file]);

  return (
    <main className="flex flex-col gap-[32px] items-center justify-center bg-background">
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
      <div className="grid grid-cols-3 gap-[32px] items-center justify-center w-full px-[15%]">
        <section className="col-span-2 flex flex-col text-center lg:text-left mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Secure <span className="text-mocha-mauve">P2P</span> File Sharing
          </h1>
          <p className="text-mocha-subtext0 max-w-2xl mx-auto lg:mx-0">
            Send files directly to your peers without server storage. Fast,
            secure, and private.
          </p>
          <FileUploadCard className="mt-8" />
        </section>
        {!file ? (
          <ReceiveCard className="mt-8" />
        ) : (
          <PeerIdCard className="mt-8" roomId={currentRoomId} />
        )}
      </div>
    </main>
  );
}
