"use client";
import * as Ably from "ably";
import { useChannel } from "ably/react";
import { useEffect, useRef, useState } from "react";
import { useAblyRoom } from "@/hooks/useWebsocket";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUploadCard from "@/components/FileUploadCard";
import Header from "@/components/Header";
import ReceiveCard from "@/components/ReceiveCard";

export default function Home() {
  const [users, setUsers] = useState<Set<string>>(new Set());
  const { channelRef, roomId, joinRoom } = useAblyRoom();

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.detach();
      }
    };
  }, []);

  return (
    <main className="flex flex-col gap-[32px] items-center justify-center bg-card">
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
        <FileUploadCard className="mt-8"/>
        </section>
        <ReceiveCard className="mt-8" />
      </div>
      {/* <Button onClick={() => joinRoom()}>join</Button> */}
    </main>
  );
}
