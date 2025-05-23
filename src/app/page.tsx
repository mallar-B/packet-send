"use client";
import * as Ably from "ably";
import InteractionCard from "@/components/InteractionCard";
import { useChannel } from "ably/react";
import { useEffect, useRef, useState } from "react";
import { useAblyRoom } from "@/hooks/useWebsocket";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <main className="flex flex-col gap-[32px] items-center justify-center ">
      <Label>Room ID: {roomId}</Label>
      <InteractionCard />
      <Button onClick={() => joinRoom()}>join</Button>
    </main>
  );
}
