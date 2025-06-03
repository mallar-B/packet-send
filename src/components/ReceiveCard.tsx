"use client";
import { HardDriveDownload, LinkIcon, Loader, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAblyRoom } from "@/hooks/useWebsocket";
import { startConnection } from "@/lib/webRTC";
import { Progress } from "./ui/progress";

const ReceiveCard = ({ className }: { className?: string }) => {
  const [peerId, setPeerId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [receiverProgress, setReceiverProgress] = useState(0);
  const { joinRoom, channelRef, userId } = useAblyRoom();

  const handleReceive = (peerId: string) => {
    try {
      joinRoom(peerId);
      setIsJoined(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isJoined) {
      startConnection({
        userType: "receiver",
        channelRef: channelRef,
        userId,
        setReceiverProgress,
      });
    }
  }, [isJoined]);

  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-card border border-muted-foreground",
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
        {receiverProgress !== 0 && receiverProgress !== 100 ? (
          <>
            <Progress value={receiverProgress} className="mt-4 w-full" />
            <span className="text-xl font-black">{receiverProgress}%</span>
          </>
        ) : null}

        {receiverProgress === 0 ? (
          <Button
            className="w-full mt-4 cursor-pointer"
            onClick={() => handleReceive(peerId)}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            <span>Receive</span>
          </Button>
        ) : receiverProgress < 100 ? (
          <Button className="w-full mt-4 cursor-not-allowed" disabled>
            <Loader className="w-4 h-4 mr-2" />
            <span>Receiving</span>
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="mt-4 cursor-pointer w-full"
              onClick={() => handleReceive(peerId)}
            >
              <HardDriveDownload className="w-4 h-4 mr-2" />
              <span>Receive again</span>
            </Button>
            <Button
              className="w-full mt-4 cursor-pointer"
              onClick={() => {
                window.location.reload();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              <span>Send</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveCard;
