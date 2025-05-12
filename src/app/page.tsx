"use client";
import * as Ably from "ably";
import InteractionCard from "@/components/InteractionCard";
import { client } from "@/lib/websocket";
import { useChannel } from "ably/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [users, setUsers] = useState<Set<string>>(new Set());
  const channelRef = useRef<Ably.RealtimeChannel>(null);

  const ablyRef = useRef(
    new Ably.Realtime(
      "cYeJDg.xsbpCA:sYLES_QdRTu_aaoumSAnXIUcG4utCdGufKKESu5lpsg",
    ),
  );

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId === "") return;
    channelRef.current = ablyRef.current.channels.get(roomId);
    channelRef.current.subscribe((message) => {
      console.log(message);
      if (message.name === "user connected") {
        setUsers(users => users.add(message.id));
      }
    });
    channelRef.current.publish("user connected", JSON.stringify(users));
  };

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.detach();
      }
    };
  }, []);

  return (
    <main className="flex flex-col gap-[32px] items-center justify-center ">
      <InteractionCard />
    </main>
  );
}
