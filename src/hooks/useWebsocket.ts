import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { useRef, useState } from "react";

export const useAblyRoom = () => {
  const client = new Ably.Realtime(
    "cYeJDg.xsbpCA:sYLES_QdRTu_aaoumSAnXIUcG4utCdGufKKESu5lpsg",
  );
  const ablyRef = useRef(client);
  const channelRef = useRef<Ably.RealtimeChannel>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [users, setUsers] = useState<Set<string>>(new Set());

  const createRoomcode = () => {
    const part = (length: number) => {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      return Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");
    };
    return `${part(3)}-${part(4)}-${part(3)}`;
  };

  const joinRoom = async (roomId?: string) => {
    if (!roomId) {
      roomId = createRoomcode();
    }
    channelRef.current = ablyRef.current.channels.get(roomId);
    channelRef.current.subscribe((message) => {
      console.log(message);
      if (message.name === "user connected") {
        setUsers((users) => users.add(message.id));
      }
    });
    channelRef.current.publish("user connected", JSON.stringify(users));
    setRoomId(roomId);
  };
  return { isJoined, channelRef, ablyRef, joinRoom, roomId };
};
