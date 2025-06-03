import { LinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAblyRoom } from "@/hooks/useWebsocket";
import { startConnection } from "@/lib/webRTC";

const ReceiveCard = ({ className }: { className?: string }) => {
  const [peerId, setPeerId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const { joinRoom, channelRef, userId } = useAblyRoom();

  const handleReceive = (peerId: string) => {
    joinRoom(peerId);
    setIsJoined(true);
  };

  useEffect(() => {
    if (isJoined) {
      startConnection({ userType: "receiver", channelRef: channelRef, userId });
    }
  }, [isJoined]);

  return (
    <div
      className={cn(
        "rounded-lg p-6 bg-card border-1 border-muted-foreground",
        className,
      )}
    >
      <h1 className="text-2xl font-bold mb-4">Receive</h1>
      <div className="mb-4">
        <label htmlFor="peerId" className="block text-sm font-medium mb-1">
          Enter Peer ID:
        </label>
        <input
          id="peerId"
          type="text"
          placeholder="e.g. abc-pqrs-xyz"
          onChange={(e) => {
            setPeerId(e.target.value);
          }}
          className="w-full p-2 border rounded-md placeholder-muted-foreground"
        />
        <Button
          className="w-full mt-4 cursor-pointer"
          onClick={() => handleReceive(peerId)}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          <span>Receive</span>
        </Button>
      </div>
    </div>
  );
};

export default ReceiveCard;
