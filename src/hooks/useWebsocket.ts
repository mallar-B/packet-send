import * as Ably from "ably";
// import {
//   AblyProvider,
//   ChannelProvider,
//   useChannel,
//   useConnectionStateListener,
// } from "ably/react";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useWebRTC } from "./useWebRtc";

const { startConnection } = useWebRTC();

export const useAblyRoom = () => {
  const client = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLYAPIKEY);
  const ablyRef = useRef(client);
  const channelRef = useRef<Ably.RealtimeChannel>(null);
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [users, setUsers] = useState<Set<string>>(new Set());
  const userId = uuid();

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
    channelRef.current.presence.subscribe("enter", (member) => {
      console.log(member.id + "joined");
      setUsers((users) => users.add(member.id));
      setTimeout(() => {
        if (users.size === 2) {
          console.log("ran startconnection() from sender");
          startConnection({ userType: "sender", channelRef: channelRef, userId });
        }
      }, 1000);
    });
    channelRef.current.presence.enterClient(userId);
    setCurrentRoomId(roomId);
  };
  return {
    channelRef,
    ablyRef,
    joinRoom,
    currentRoomId,
    userId,
  };
};
